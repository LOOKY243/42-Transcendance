from rest_framework import serializers
from .models import Register

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Register
        fields = ["username", "password"]

    def create(self, validated_data):
        # Override the create method to hash the password before saving
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)