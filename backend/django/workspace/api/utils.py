import random, string, requests
from django.conf import settings

def generate_verification_code(length=6):
    return ''.join(random.choices(string.digits, k=length))

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

