from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from .models import Bus
from accounts.models import OperatorProfile
from .serializer import BusSerializer
from rest_framework.permissions import IsAuthenticated

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_bus_view(request):
    if request.user.role != "OPERATOR":
        return Response({'error':'Sorry only bus-operator can add bus'},status=status.HTTP_403_FORBIDDEN)

    if not request.user.operator_profile.is_approved:
        return Response({'error':'Sorry you are not approved Bus-Operator!!!'},status=status.HTTP_403_FORBIDDEN)

    serializer = BusSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(operator = request.user.operator_profile)
        return Response({"msg":"Bus created Successfully !!!"},status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_bus_view(request):
    if request.user.role != "OPERATOR":
        return Response({'error':'Sorry only bus-operator can see'},status=status.HTTP_403_FORBIDDEN)
    operator = request.user.operator_profile
    buses = Bus.objects.filter(operator=operator)
    bus_serializer = BusSerializer(buses,many=True)
    return Response(bus_serializer.data,status=status.HTTP_200_OK) 

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_bus_view(request,pk):
    if request.user.role != "OPERATOR":
        return Response({'error':'Sorry Only Bus Operator Allowed'},status=status.HTTP_403_FORBIDDEN)
    
    try:
        operator = request.user.operator_profile
    except OperatorProfile.DoesNotExist:
        return Response({'error': 'Operator profile not found'},status=status.HTTP_403_FORBIDDEN)

    if not operator.is_approved:
        return Response({'error': 'You are not approved'},status=status.HTTP_403_FORBIDDEN)

    try:
        bus = Bus.objects.get(pk=pk,operator=operator)
    except Bus.DoesNotExist:
        return Response({'error': 'Bus not found'},status=status.HTTP_404_NOT_FOUND)

    serializer = BusSerializer(bus, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'msg': 'Bus updated successfully'},
            status=status.HTTP_200_OK
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_bus_view(request,pk):
    if request.user.role != "OPERATOR":
        return Response({'error':'Sorry Only Bus Operator Allowed'},status=status.HTTP_403_FORBIDDEN)

    try:
        operator = request.user.operator_profile
    except OperatorProfile.DoesNotExist:
        return Response({'error': 'Operator profile not found'},status=status.HTTP_403_FORBIDDEN)

    if not operator.is_approved:
        return Response({'error': 'You are not approved'},status=status.HTTP_403_FORBIDDEN)

    try:
        bus = Bus.objects.get(pk=pk,operator=operator)
    except Bus.DoesNotExist:
        return Response({'error': 'Bus not found'},status=status.HTTP_404_NOT_FOUND)

    bus.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)