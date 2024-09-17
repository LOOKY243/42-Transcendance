from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate, login, logout
from .models import CustomUser
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.views.generic.edit import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone


class RegisterView(APIView):
    def put(self, request):
        username = request.data.get('username')
        
        if CustomUser.objects.filter(username=username).exists():
            return JsonResponse({"ok": False, "error": "usernameError"})

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return JsonResponse({"ok": True, "username": user.username})
        return JsonResponse({"ok": False})


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            response =  JsonResponse({
                "ok": True,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "token_refresh_required": False,
            })
            response.set_cookie(
                'accessToken', str(refresh.access_token), max_age=3600, httponly=True, secure=False, samesite='Lax'
            )
            response.set_cookie(
                'refreshToken', str(refresh), max_age=86400, httponly=True, secure=False, samesite='Lax'
            )
            return response
        else:
            return JsonResponse({"ok": False})
        

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        response = JsonResponse({"ok": True})
        
        response.delete_cookie('accessToken')
        response.delete_cookie('refreshToken')
        
        return response

class GetUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return JsonResponse({"username": user.username})

class UpdateEmailView(LoginRequiredMixin, UpdateView):
    model = CustomUser
    fields = ['email']
    success_url = '/'

class TwoFactorSetupView(APIView):
    def put(self, request):
        username = request.data.get('username')
        user = CustomUser.objects.filter(username=username).first()

        if not user:
            return JsonResponse({'ok': False})
        if not user.email:
            return JsonResponse({'ok': False})
    
        verification_code = get_random_string(length=6, allowed_chars='0123456789')

        subject = 'Your Two-Factor Authentication Verification Code'
        message = f'Your verification code is: {verification_code}'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]

        try:
            send_mail(subject, message, from_email, recipient_list)
            user.verification_code = verification_code
            user.verification_code_created_at = timezone.now()
            user.save()
            return JsonResponse({'ok': True})
        except Exception as e:
            return JsonResponse({'ok': False, 'error': str(e)})
        
class TwoFactorVerifyView(APIView):
    def post(self, request):
        username = request.data.get('username')
        code = request.data.get('code')
        
        user = CustomUser.objects.filter(username=username).first()
        
        if not user:
            return JsonResponse({'ok': False, 'error': 'User not found'})
        
        if user.verification_code != code:
            return JsonResponse({'ok': False, 'error': 'Invalid code'})
        
        expiration_time = user.verification_code_created_at + timedelta(minutes=5)
        if timezone.now() > expiration_time:
            user.verification_code = None
            user.verification_code_created_at = None
            user.save()
            return JsonResponse({'ok': False, 'error': 'Code expired'})
        
        return JsonResponse({'ok': True})