from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.http import JsonResponse

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

import random
import string
from django.core.mail import send_mail

def generate_verification_code(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_email_verification_code(user, code):
    subject = 'Your Verification Code'
    message = f'Your verification code is {code}'
    send_mail(subject, message, '42delahess@gmail.com', [user.email])
