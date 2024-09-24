from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, UpdatePasswordSerializer
from django.contrib.auth import authenticate, login, logout
from .models import CustomUser
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .utils import generate_verification_code
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .utils import check_token_status
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash


User = get_user_model() 

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)

            refresh_token = request.data.get('refresh')

            if refresh_token:
                refresh_token_obj = RefreshToken(refresh_token)
                
                user_id = refresh_token_obj['user_id']
                
                user = User.objects.filter(id=user_id).first()
                if user is None:
                    return JsonResponse({'error': 'User does not exist'}, status=401)

            return response
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=401)

class RegisterView(APIView):
    def put(self, request):
        username = request.data.get('username')
        
        if CustomUser.objects.filter(username=username).exists():
            return JsonResponse({"ok": False, "error": "usernameError"})

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return JsonResponse({"ok": True, "username": user.username})
        return JsonResponse({"ok": False}, status=400)


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
            return JsonResponse({"ok": False}, status=404)
        

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
        return JsonResponse({
            "ok": True,
            "username": user.username,
            "lang": user.lang
        })

class UpdateEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        new_email = request.data.get('new_email')

        if not new_email:
            return JsonResponse({"ok": False, "error": "Email is required"}, status=400)

        try:
            validate_email(new_email)
        except ValidationError:
            return JsonResponse({"ok": False, "error": "Invalid email address"}, status=400)

        user = request.user
        user.email = new_email
        user.save()

        return JsonResponse({"ok": True, "message": "Email updated successfully"})
    

class TwoFactorActivateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        email = request.data.get('email')

        if not email:
            return JsonResponse({"ok": False, "error": "Email is required"}, status=400)

        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({"ok": False, "error": "Invalid email address"}, status=400)

        user = request.user
        user.email = email
        user.tfa = True
        user.save()

        return JsonResponse({"ok": True, "message": "Email updated successfully"})
    

class TwoFactorSetupView(APIView):
    def put(self, request):
        username = request.data.get('username')
        user = CustomUser.objects.filter(username=username).first()

        if not user:
            return JsonResponse({'ok': False}, status=400)
        if not user.tfa:
            return JsonResponse({'ok': False, 'error': '2fa not active'}, status=404)
    
        verification_code = generate_verification_code()

        subject = 'Your Two-Factor Authentication Verification Code'
        message = f'Your verification code is: {verification_code}'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [user.email]

        try:
            send_mail(subject, message, from_email, recipient_list)
            user.verification_code = verification_code
            user.verification_code_created_at = timezone.now()
            user.save()
            return JsonResponse({'ok': True})
        except Exception as e:
            return JsonResponse({'ok': False, 'error': str(e), 'from email': from_email}, status=500)
        
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
        user.verification_code = None
        user.verification_code_created_at = None
        user.save()
        return JsonResponse({'ok': True})

class UpdateLanguageView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        new_lang = request.data.get('lang')

        if not new_lang:
            return JsonResponse({"ok": False, "error": "No language provided"})

        user.lang = new_lang
        user.save()

        return JsonResponse({"ok": True})

class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UpdatePasswordSerializer(data=request.data)

        if serializer.is_valid():
            currentPassword = serializer.validated_data['currentPassword']
            newPassword = serializer.validated_data['newPassword']

            if not user.check_password(currentPassword):
                return JsonResponse({"ok": False, "error": "Current password is incorrect"})

            user.set_password(newPassword)
            user.save()
            update_session_auth_hash(request, user)

            return JsonResponse({"ok": True})
        
        return JsonResponse({"ok": False, "errors": serializer.errors})