import random, string, requests
from django.conf import settings

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

