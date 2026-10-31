from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Bookings, BookedSeat
from .serializer import BookingsSerializer, BookedSeatSerializer
from routes.models import Schedule
from decimal import Decimal
from django.db import transaction
from buses.models import Bus


def seats(schedule,all=True):
    seater = int(schedule.bus.seater)
    sleeper = int(schedule.bus.sleeper)

    all_seater_seats = [f"S{i}" for i in range(1, seater + 1)]
    all_sleeper_seats = [f"U{i}" for i in range(1, sleeper + 1)]
    all_seats = all_seater_seats + all_sleeper_seats

    if all:
        return all_seats

    booked_seats = BookedSeat.objects.filter(
        schedule=schedule
    ).values_list('seat_number', flat=True)
    print(booked_seats)

    available_seats = [
        seat for seat in all_seats
        if seat not in booked_seats
    ]

    return available_seats

@api_view(['GET'])
@permission_classes([AllowAny])
def available_seats_view(request, id):
    try:
        schedule = Schedule.objects.get(id=id)
    except Schedule.DoesNotExist:
        return Response(
            {"error": "Schedule not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    available_seats = seats(schedule,False)

    return Response({
        "schedule_id": schedule.id,
        "available_seats": available_seats
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking_view(request,id):
    try:
        schedule = Schedule.objects.get(id=id)
    except Schedule.DoesNotExist:
        return Response({"error": "Schedule not found"},status=status.HTTP_404_NOT_FOUND)

    all_seats = seats(schedule)
    req_seats= request.data.get('seats')

    if not isinstance(req_seats, list) or len(req_seats) == 0:
        return Response({'error': 'Please Select Seat and try '},status=status.HTTP_400_BAD_REQUEST)


    if not all(seat in all_seats for seat in req_seats):
        return Response({'error': 'Requested seats are not valid'},status=status.HTTP_400_BAD_REQUEST)
    available_seats = seats(schedule,False)

    if not all(seat in available_seats for seat in req_seats):
        return Response({'error':'Seats already Occupied'},status=status.HTTP_400_BAD_REQUEST)

    sleeper_price = schedule.sleeper_price
    seater_price = schedule.seater_price
    total_fare = Decimal('0.00')

    for i in req_seats:
        if i[0] == 'S':
            total_fare += seater_price
        else:
            total_fare += sleeper_price
    print(total_fare,sleeper_price,seater_price)
    try:

        with transaction.atomic():
            booking = Bookings.objects.create(
                user = request.user,
                schedule=schedule,
                total_fare=total_fare
            )
            passengers = request.data.get("passengers")

            for passenger in passengers:
                BookedSeat.objects.create(
                    booking=booking,
                    schedule=schedule,
                    seat_number=passenger['seat'],
                    passenger_name=passenger['name'],
                    passenger_age=passenger['age']
            )

            return Response({
                "message": "Booking created successfully",
                "booking_id": booking.id,
                "total_fare": str(total_fare),
                "seats": req_seats,
                "from":schedule.route.source,
                "to":schedule.route.destination,

            }, status=status.HTTP_201_CREATED)
    except Exception:
        return Response({"err":Exception},status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bookings_view(request):
    user = request.user
    bookings = Bookings.objects.filter(user=user)

    serializer = BookingsSerializer(bookings,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_detail_view(request,id):
    user = request.user

    booking = Bookings.objects.filter(id=id,user=user)
    serializer = BookingsSerializer(booking,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_booking_view(request,id):
    user = request.user

    with transaction.atomic():
        try:
            booking = Bookings.objects.get(id=id,user=user)
            booking.booking_status = "CANCELLED"
            booking.save()
        except Bookings.DoesNotExist:
            return Response({"error":"booking not found"},status=status.HTTP_404_NOT_FOUND)


        booked_seats = BookedSeat.objects.filter(booking=booking)
        booked_seats.delete()
        return Response({"msg":"Booking Successfully Cancelled !!!"},status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def operator_bookings_view(request):
    user = request.user

    if user.role != 'OPERATOR':
        return Response(
            {"error": "Only operators can access this data"},
            status=status.HTTP_403_FORBIDDEN
        )

    bookings = Bookings.objects.filter(
        schedule__bus__operator__user=user
    )

    serializer = BookingsSerializer(bookings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def operator_schedule_bookings_view(request, schedule_id):
    user = request.user

    if user.role != 'OPERATOR':
        return Response(
            {"error": "Only operators can access this data"},
            status=status.HTTP_403_FORBIDDEN
        )

    bookings = Bookings.objects.filter(
        schedule_id=schedule_id,
        schedule__bus__operator__user=user
    )

    serializer = BookingsSerializer(bookings, many=True)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def operator_dashboard_view(request):
    user = request.user
    if user.role != "OPERATOR":
        return Response({"error":"Only Bus Operator Is Allowed"},status=status.HTTP_403_FORBIDDEN)

    buses = Bus.objects.filter(operator__user = user)
    schedules = Schedule.objects.filter(bus__operator__user = user)
    bookings = Bookings.objects.filter(schedule__bus__operator__user = user)

    if not bookings.exists():
        return Response(
            {"error": "You are not allowed to access this data"},
            status=status.HTTP_403_FORBIDDEN
        )

    return Response({
        "total_buses":buses.count(),
        "total_schedules": schedules.count(),
        "total_bookings": bookings.count(),
        "confirmed_bookings": bookings.filter(booking_status="Confirmed").count()
    }, status=status.HTTP_200_OK)