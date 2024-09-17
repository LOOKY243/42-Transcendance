from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'password_confirm', 'email', 'tfa', 'pfp', 'verification_code', 'verification_code_created_at', 'language']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "password are not the same."})
        return attrs
    
    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            tfa=validated_data.get('tfa', False),
            pfp=validated_data.get('pfp', None),
            verification_code=validated_data.get('verification_code', None),
            verification_code_created_at=validated_data.get('verification_code_created_at', None),
            language=validated_data.get('language', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user