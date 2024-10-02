from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from cryptography.fernet import Fernet
import base64
from django.conf import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser):
    username = models.CharField(unique=True)
    email = models.EmailField(blank=True, null=True)
    tfa = models.BooleanField(default=False)
    pfp = models.BinaryField(blank=True, null=True)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_code_created_at = models.DateTimeField(blank=True, null=True)
    lang = models.CharField(default='en')
    friends = models.ManyToManyField('self', symmetrical=False, related_name='friends_of', blank=True)
    is_online = models.BooleanField(default=False)
    last_activity = models.DateTimeField(null=True, blank=True)
    is_encrypted = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def encrypt_data(self, data):
        cipher_suite = Fernet(settings.SECRET_KEY.encode())
        return base64.urlsafe_b64encode(cipher_suite.encrypt(data.encode())).decode()

    def decrypt_data(self, encrypted_data):
        if not isinstance(encrypted_data, str) or len(encrypted_data) == 0:
            return encrypted_data 
        try:
            cipher_suite = Fernet(settings.SECRET_KEY.encode())
            decoded_data = base64.urlsafe_b64decode(encrypted_data.encode())
            return cipher_suite.decrypt(decoded_data).decode()
        except Exception as e:
            return encrypted_data


    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username

    def update_last_activity(self):
        self.last_activity = timezone.now()
        self.is_online = True
        self.save()

