from rest_framework import serializers
from .models import BookedSeat, Bookings
from routes.serializer import ScheduleSerializer

class BookedSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookedSeat
        fields = '__all__'

class BookingsSerializer(serializers.ModelSerializer):
    schedule = ScheduleSerializer(read_only=True)
    seats = BookedSeatSerializer(
        source='bookedseat_set',
        many=True,
        read_only=True
    )
    class Meta:
        model = Bookings
        fields = '__all__'