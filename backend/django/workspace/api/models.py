from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone

class CustomUser(AbstractBaseUser):
    username = models.CharField(max_length=24, unique=True)
    password = models.CharField(max_length=128)
    email = models.EmailField(blank=True, null=True)
    phoneNumber = models.CharField(max_length=10, blank=True, null=True)
    tfa = models.BooleanField(default=False)
    pfp = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_code_created_at = models.DateTimeField(blank=True, null=True)
    language = models.CharField(max_length=10, default='en')

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['password']

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username
