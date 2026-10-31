from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from .serializer import WalletSerializer,PaymentSerializer
from .models import Wallet,Payment
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from decimal import Decimal
from bookings.models import Bookings
from bookings.serializer import BookingsSerializer
import uuid

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_money_view(request):
    try:
        amount = Decimal(request.data.get('amount'))
    except (TypeError, ValueError):
        return Response(
            {"error": "Please provide a valid amount"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not amount.is_finite() or amount <= 0:
        return Response(
            {"error": "Amount must be greater than zero"},
            status=status.HTTP_400_BAD_REQUEST
        )

    with transaction.atomic():
        wallet = Wallet.objects.select_for_update().get(user=request.user)
        wallet.balance += amount
        wallet.save(update_fields=['balance'])

    return Response({
        "msg": "Money added successfully!",
        "balance": str(wallet.balance)
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def payments(request):

    all_payments = Payment.objects.filter(booking__user = request.user)

    serialzer = PaymentSerializer(all_payments,many=True)
    return Response(serialzer.data,status=status.HTTP_200_OK)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wallet_balance_view(request):
    try:
        wallet = Wallet.objects.get(user=request.user)
    except Wallet.DoesNotExist:
        return Response(
            {"error": "Wallet not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        "balance": str(wallet.balance)
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payment_confirmation_view(request, id):
    user = request.user

    try:
        booking = Bookings.objects.get(id=id, user=user)
    except Bookings.DoesNotExist:
        return Response(
            {"error": "Booking not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.booking_status == Bookings.BookingStatus.CONFIRMED:
        return Response({"error": "Booking already confirmed"}, status=400)

    if booking.booking_status == Bookings.BookingStatus.CANCELLED:
        return Response({"error": "Booking is cancelled"}, status=400)

    # if Payment.objects.filter(booking=booking).exists():
    #     return Response({"error": "Payment already exists for this booking"}, status=400)

    total_fare = booking.total_fare
    transaction_id = f"TR{uuid.uuid4().hex[:8].upper()}"

    payment = Payment.objects.create(
        booking=booking,
        amount=total_fare,
        status=Payment.PaymentStatus.PENDING,
        transaction_id=transaction_id,
    )

    try:
        with transaction.atomic():
            wallet = Wallet.objects.select_for_update().get(user=user)

            if total_fare > wallet.balance:
                raise ValueError("INSUFFICIENT_BALANCE")

            wallet.balance -= total_fare
            wallet.save(update_fields=["balance"])

            booking.booking_status = Bookings.BookingStatus.CONFIRMED
            booking.save(update_fields=["booking_status"])

            payment.status = Payment.PaymentStatus.SUCCESS
            payment.save(update_fields=["status"])

    except ValueError as e:
        payment.status = Payment.PaymentStatus.FAILED
        payment.save(update_fields=["status"])

        if str(e) == "INSUFFICIENT_BALANCE":
            return Response(
                {"error": "Insufficient balance. Please add money."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"error": "Payment failed"}, status=400)

    except Wallet.DoesNotExist:
        payment.status = Payment.PaymentStatus.FAILED
        payment.save(update_fields=["status"])
        return Response({"error": "Wallet not found"}, status=404)

    except Exception:
        payment.status = Payment.PaymentStatus.FAILED
        payment.save(update_fields=["status"])
        return Response({"error": "Payment failed"}, status=400)

    return Response({
        "msg": "Booking confirmed",
        "transaction_id": transaction_id,
        "Journey Details": BookingsSerializer(booking).data,
        "remaining_balance": str(wallet.balance),
    }, status=status.HTTP_200_OK)