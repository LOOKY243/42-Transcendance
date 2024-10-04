import random
import string
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.http import JsonResponse
from django.core.mail import send_mail

def generate_verification_code(length=6):
    return ''.join(random.choices(string.digits, k=length))

def check_token_status(request):
	access_token = request.COOKIES.get('accessToken')
	refresh_token = request.COOKIES.get('refreshToken')

	if not access_token:
		return False

	try:
		access_token_obj = AccessToken(access_token)
		return True
	
	except TokenError:
		if refresh_token:
			try:
				refresh_token_obj = RefreshToken(refresh_token)
				return False
			except TokenError:
				return False
		return False

def generate_random_password(length=12):
    if length < 12:
        raise ValueError("Password length should be at least 12 characters.")
    
    lowercase = random.choice(string.ascii_lowercase)
    uppercase = random.choice(string.ascii_uppercase)
    digit = random.choice(string.digits)
    symbol = random.choice(string.punctuation)
    
    remaining_length = length - 4
    all_characters = string.ascii_letters + string.digits + string.punctuation
    password = [lowercase, uppercase, digit, symbol] + random.choices(all_characters, k=remaining_length)
    
    random.shuffle(password)
    
    return ''.join(password)
