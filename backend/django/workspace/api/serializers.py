from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=True, min_length=8)
    lang = serializers.CharField(required=False, allow_blank=True, default='en')

    class Meta:
        model = User
        fields = ['username', 'password', 'password_confirm', 'lang']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "password are not the same."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        lang = validated_data.pop('lang', 'en')
        
        user = User.objects.create_user(**validated_data)
        user.language = lang
        user.save()
        
        return user