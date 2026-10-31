from rest_framework import serializers
from .models import Bus

class BusSerializer(serializers.ModelSerializer):
    operator = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Bus
        fields = '__all__'