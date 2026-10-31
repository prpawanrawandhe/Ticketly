from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import status
from rest_framework.response import Response
from .serializer import RoutesSerializer, ScheduleSerializer, ScheduleTemplateSerializer
from .models import Routes , Schedule
from accounts.models import OperatorProfile
from buses.models import Bus
from datetime import timedelta

@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_routes_view(request):
    serializer = RoutesSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"msg":"Bus Route Created Successfully!!!"},status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def routes_list_view(request):
    search = request.GET.get("search","")
    routes = Routes.objects.filter(source__icontains=search)
    serializer = RoutesSerializer(routes,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_schedule_view(request):
    if request.user.role != "OPERATOR":
        return Response({"msg":"You are not allowed"},status=status.HTTP_403_FORBIDDEN)

    try:
        operator = request.user.operator_profile
    except OperatorProfile.DoesNotExist:
        return Response({"error":"Operator profile not found"},status=status.HTTP_404_NOT_FOUND)

    if not operator.is_approved:
        return Response({"error":"Operator profile is not approved"},status=status.HTTP_403_FORBIDDEN)
    bus_id = request.data.get('bus')
    try:
        bus = Bus.objects.get(id=bus_id)
    except Bus.DoesNotExist:
        return Response({"error":"Bus not found"},status=status.HTTP_404_NOT_FOUND)

    if bus.operator != request.user.operator_profile:
        return Response({"msg": "You don't own this bus"}, status=status.HTTP_403_FORBIDDEN)

    serializer = ScheduleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(bus=bus)
        return Response({"msg":"Schedule created Successfully !!!"},status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_scheduleTemplate_view(request):
    if request.user.role != "OPERATOR":
        return Response({"msg":"You are not allowed"},status=status.HTTP_403_FORBIDDEN)

    try:
        operator = request.user.operator_profile
    except OperatorProfile.DoesNotExist:
        return Response({"error":"Operator profile not found"},status=status.HTTP_404_NOT_FOUND)

    if not operator.is_approved:
        return Response({"error":"Operator profile is not approved"},status=status.HTTP_403_FORBIDDEN)
    bus_id = request.data.get('bus')
    try:
        bus = Bus.objects.get(id=bus_id)
    except Bus.DoesNotExist:
        return Response({"error":"Bus not found"},status=status.HTTP_404_NOT_FOUND)

    if bus.operator != request.user.operator_profile:
        return Response({"msg": "You don't own this bus"}, status=status.HTTP_403_FORBIDDEN)

    serializer = ScheduleTemplateSerializer(data=request.data)
    if serializer.is_valid():
        template = serializer.save(bus=bus)
        for i in range(1,31):
            Schedule.objects.create(
                bus=template.bus,
                route=template.route,
                arrival_time = template.arrival_time + timedelta(days=i),
                departure_time = template.departure_time + timedelta(days=i),
                estimated_time = template.estimated_time,
                seater_price = template.seater_price,
                sleeper_price = template.sleeper_price,
            )
        return Response({"msg":"Schedule created Successfully !!!"},status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def schedules_view(request):
    if request.user.role != "OPERATOR":
        return Response({"msg":"You are not allowed"},status=status.HTTP_403_FORBIDDEN)
    
    try:
        operator = request.user.operator_profile
    except OperatorProfile.DoesNotExist:
        return Response({"error":"Operator profile not found"},status=status.HTTP_404_NOT_FOUND)
    
    if not operator.is_approved:
        return Response({"error":"Operator profile is not approved"},status=status.HTTP_403_FORBIDDEN)

    schedules = Schedule.objects.filter(bus__operator = operator)
    
    serializer = ScheduleSerializer(schedules,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_schedules_view(request,pk):
    if request.user.role != "OPERATOR":
        return Response({"msg":"You are not allowed"},status=status.HTTP_403_FORBIDDEN)
        
    try:
        operator = request.user.operator_profile
    except OperatorProfile.DoesNotExist:
        return Response({"error":"Operator profile not found"},status=status.HTTP_404_NOT_FOUND)
    
    if not operator.is_approved:
        return Response({"error":"Operator profile is not approved"},status=status.HTTP_403_FORBIDDEN)

    bus_id = request.data.get('bus')
    try:
        bus = Bus.objects.get(id=bus_id)
    except Bus.DoesNotExist:
        return Response({"error":"Bus not found"},status=status.HTTP_404_NOT_FOUND)

    if bus.operator != request.user.operator_profile:
        return Response({"msg": "You don't own this bus"}, status=status.HTTP_403_FORBIDDEN)

    try:
        schedule = Schedule.objects.get(id=pk,bus__operator=operator)
    except Schedule.DoesNotExist:
        return Response({"error":"Schedule not found"},status=status.HTTP_404_NOT_FOUND)
    serializer = ScheduleSerializer(schedule,data=request.data)
    if serializer.is_valid():
        serializer.save(bus=bus)
        return Response({"msg":"Schedule saved Successfully !!!"},status=status.HTTP_200_OK)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_schedules_view(request,pk):
    if request.user.role != "OPERATOR":
            return Response({"msg":"You are not allowed"},status=status.HTTP_403_FORBIDDEN)
            
    try:
        operator = request.user.operator_profile
    except OperatorProfile.DoesNotExist:
        return Response({"error":"Operator profile not found"},status=status.HTTP_404_NOT_FOUND)
    
    if not operator.is_approved:
        return Response({"error":"Operator profile is not approved"},status=status.HTTP_403_FORBIDDEN)

    try:
        schedule = Schedule.objects.get(id=pk,bus__operator=operator)
    except Schedule.DoesNotExist:
        return Response({"error":"Schedule not found"},status=status.HTTP_404_NOT_FOUND)
    schedule.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([AllowAny])
def available_schedules_view(request):
    source = request.query_params.get('source')
    destination = request.query_params.get('destination')
    journey_date = request.query_params.get('date')

    schedules = Schedule.objects.filter(
        route__source__iexact=source,
        route__destination__iexact=destination,
        departure_time__date=journey_date)

    serializer = ScheduleSerializer(schedules,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)
    



    