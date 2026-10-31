from rest_framework import serializers
from .models import User,OperatorProfile

class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username','password','email']

class OperatorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorProfile
        fields = ['user','company_name']