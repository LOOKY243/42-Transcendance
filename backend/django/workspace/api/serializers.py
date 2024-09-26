from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=True, min_length=8)
    lang = serializers.CharField(required=False, allow_blank=True, default='en')

    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'password_confirm', 'email', 'tfa', 'pfp', 'verification_code', 'verification_code_created_at', 'lang']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "password are not the same."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser(
            username=validated_data.get('username'),
            email=validated_data.get('email', ''),
            tfa=validated_data.get('tfa', False),
            pfp=validated_data.get('pfp', None),
            verification_code=validated_data.get('verification_code', None),
            verification_code_created_at=validated_data.get('verification_code_created_at', None),
            lang=validated_data.pop('language', 'en')
        )
        user.set_password(validated_data.get('password'))
        user.save()
        
        return user

class UpdatePasswordSerializer(serializers.Serializer):
    currentPassword = serializers.CharField(required=True, write_only=True)
    newPassword = serializers.CharField(required=True, write_only=True, min_length=8)
    newPasswordConfirm = serializers.CharField(required=True, write_only=True, min_length=8)

    def validate(self, attrs):
        if attrs['newPassword'] != attrs['newPasswordConfirm']:
            raise serializers.ValidationError({"newPassword": "New passwords do not match."})
        if attrs['currentPassword'] != attrs['newPassword']:
            raise serializers.ValidationError({"newPassword": "New password can't be the same as the old password"})
        return attrs