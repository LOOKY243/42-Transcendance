from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'password_confirm', 'email', 'phoneNumber', 'tfa', 'pfp']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "password are not the same."})
        return attrs
    
    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            phoneNumber=validated_data.get('phoneNumber', ''),
            tfa=validated_data.get('tfa', False),
            pfp=validated_data.get('pfp', None)
        )
        user.set_password(validated_data['password'])
        user.save()
        return user