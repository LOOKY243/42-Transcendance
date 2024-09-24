import random, string, requests
from .models import CustomUser, CustomUserManager
from django.contrib.auth import login
from django.conf import settings
from django.shortcuts import redirect

def generate_verification_code(length=6):
    return ''.join(random.choices(string.digits, k=length))

def get_ft_token(code):
    token_url = "https://api.intra.42.fr/oauth/token"
    token_data = {
        'grant_type': 'authorization_code',
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.REDIRECT_URI
    }
    response = requests.post(token_url, data=token_data)
    token_info = response.json()
    access_token = token_info.get('access_token')
    return access_token

    
def log_ft_user(request, username, email):
    user = CustomUser.objects.filter(username=username)
    if not user:
        user = CustomUserManager().create_user(username=username, email=email, password=None)
        login(request, user)
        return 1
    else:
        login(request, user)
        return 2
    
def authorize_redirect(request):
    client_id = settings.CLIENT_ID
    redirect_uri = settings.REDIRECT_URI
    authorization_url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    
    return redirect(authorization_url)
