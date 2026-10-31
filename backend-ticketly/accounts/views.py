from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from .serializer import UserSerializer , OperatorProfileSerializer
from .models import User, OperatorProfile
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from payments.models import Wallet

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user=serializer.save()
        Wallet.objects.create(user=user)
        return Response({"msg":"Registration Successfull!"},status.HTTP_201_CREATED)
    else:
        return Response({"error":"Registration Failed"},status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def operator_register_view(request):
    with transaction.atomic():
        user_serializer = UserSerializer(data=request.data)

        if user_serializer.is_valid():
            user = user_serializer.save()
            user.role = "OPERATOR"
            user.save()

        OperatorProfile.objects.create(
            user = user,
            company_name = request.data.get('company_name','')
        )
        return Response({"msg":"Operator Created Successfully!!"},status=status.HTTP_201_CREATED)
    return Response(user_serializer.errors,status=status.HTTP_400_BAD_REQUEST)





