from rest_framework import serializers
from .models import Routes, Schedule ,ScheduleTemplate
from buses.serializer import BusSerializer

class RoutesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Routes
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    bus = BusSerializer(read_only=True)
    route = RoutesSerializer(read_only=True)
    class Meta:
        model = Schedule
        fields = '__all__'

class ScheduleTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleTemplate
        fields = '__all__'