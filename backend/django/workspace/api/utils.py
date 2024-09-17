import random
import string
from django.core.mail import send_mail

def generate_verification_code(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_email_verification_code(user, code):
    subject = 'Your Verification Code'
    message = f'Your verification code is {code}'
    send_mail(subject, message, '42delahess@gmail.com', [user.email])
