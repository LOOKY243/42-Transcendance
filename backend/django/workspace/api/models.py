from django.db import models
from django.contrib.auth.hashers import make_password

# Define a model for registration

class Register(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=30)

    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        self.password = make_password(self.password)
        super().save(*args, **kwargs)