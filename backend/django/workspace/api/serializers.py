from rest_framework import serializers
<<<<<<< HEAD
from .models import CustomUser
=======
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()
>>>>>>> origin/user

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=True, min_length=8)
    lang = serializers.CharField(required=False, allow_blank=True, default='en')

    class Meta:
<<<<<<< HEAD
        model = CustomUser
        fields = ['username', 'password', 'password_confirm', 'email', 'phoneNumber', 'tfa', 'pfp']
=======
        model = User
        fields = ['username', 'password', 'password_confirm', 'lang']
>>>>>>> origin/user
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "password are not the same."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
<<<<<<< HEAD
        
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            phoneNumber=validated_data.get('phoneNumber', ''),
            tfa=validated_data.get('tfa', False),
            pfp=validated_data.get('pfp', None)
        )
        user.set_password(validated_data['password'])
        user.save()
=======
        lang = validated_data.pop('lang', 'en')
        
        user = User.objects.create_user(**validated_data)
        user.language = lang
        user.save()
        
>>>>>>> origin/user
        return user