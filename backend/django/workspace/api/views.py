from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout, get_user_model, update_session_auth_hash
from .serializers import RegisterSerializer, UpdatePasswordSerializer
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenRefreshView
import requests
from django.shortcuts import redirect
from .models import CustomUser, MatchHistory
from .utils import generate_verification_code, get_ft_token, generate_random_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from rest_framework.parsers import MultiPartParser, FormParser
import base64

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
            return JsonResponse({"ok": False, "error": "usernameError"}, status=400)

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return JsonResponse({"ok": True, "username": user.username})
        return JsonResponse({"ok": False, 'password': request.data.get('password'), 'passwd_confirm': request.data.get('password_confirm')}, status=400)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            response = JsonResponse({
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


class FtLoginRedirectView(APIView):
    def get(self, request):
        client_id = settings.CLIENT_ID
        redirect_uri = settings.REDIRECT_URI
        authorization_url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
        return redirect(authorization_url)
        

class FtLoginCallbackView(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return JsonResponse({'ok': False, 'error': 'Authorization code not provided'}, status=400)

        access_token = get_ft_token(code)
        if not access_token:
            return JsonResponse({'ok': False, 'error': 'Failed to obtain access token'}, status=400)
        
        user_info_url = 'https://api.intra.42.fr/v2/me'
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(user_info_url, headers=headers)
        user_info = response.json()

        username = user_info.get('login')
        email = user_info.get('email')
        if not username or not email:
            return JsonResponse({'ok': False, 'error': 'Failed to retrieve user info'})

        user = CustomUser.objects.filter(username=username).first()

        if not user:
            tmp_password = generate_random_password()
            register_data = {
                'username': username,
                'password': tmp_password,
                'password_confirm': tmp_password,
                'email': email
            }
            if CustomUser.objects.filter(username=username).exists():
                return JsonResponse({"ok": False, "error": "usernameError"}, status=400)
            
            serializer = RegisterSerializer(data=register_data)
            
            if serializer.is_valid():
                user = serializer.save()

                subject = 'Registered successfully'
                message = f'You have been registered successfully. Your temporary password is {tmp_password}. Please change it as soon as possible.'
                from_email = settings.EMAIL_HOST_USER
                recipient_list = [email]
                send_mail(subject, message, from_email, recipient_list)
                login(request, user)
                return JsonResponse({'ok': True, 'message': 'User registered successfully. Check your email.'})
            else:
                return JsonResponse({'ok': False, 'errors': serializer.errors}, status=400)
        else:
            user = authenticate(username=username, password=user.password)
            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                response = JsonResponse({
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
                return JsonResponse({"ok": False, "error": "Authentication failed"}, status=400)


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
        encoded_pfp = None
        
        if user.pfp:
            encoded_pfp = base64.b64encode(user.pfp).decode('utf-8')

        return JsonResponse({
            "ok": True,
            "username": user.username,
            "lang": user.lang,
            "pfp": f"data:image/png;base64,{encoded_pfp}" if encoded_pfp else None,
        })

class GetUserTfaView(APIView):
    def get(self, request):
        user = user.request
        return JsonResponse({
            "ok": True,
            "tfa": user.tfa
        })

class UpdatePfpView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        pass

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

        return JsonResponse({"ok": True, "message": "2fa activated successfully"})
    

class TwoFactorSetupView(APIView):
    def put(self, request):
        user = request.user

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
        code = request.data.get('code')
        
        user = request.user
        
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

        if new_lang == user.lang:
            return JsonResponse({"ok": False, "error": "New language is the same as the current language"})

        user.lang = new_lang
        user.save()

        return JsonResponse({"ok": True})
    
class GetMatchHistoryView(APIView):
    def get(self, request, player_id):
        matches = MatchHistory.objects.filter(player_id=player_id)[:5]
        match_data = [{
            'opponent': match.match_date,
            'score': match.score,
            'game_mode': match.gamemode
        } for match in matches]

        return JsonResponse({'last_five_matches': match_data})
    
class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    PASSWORD_MAX_LENGTH = 30

    def patch(self, request):
        user = request.user
        serializer = UpdatePasswordSerializer(data=request.data)

        if serializer.is_valid():
            currentPassword = serializer.validated_data['currentPassword']
            newPassword = serializer.validated_data['newPassword']

            if not user.check_password(currentPassword):
                return JsonResponse({"ok": False, "error": "Current password is incorrect"})

            if currentPassword == newPassword:
                return JsonResponse({"ok": False, "error": "New password cannot be the same as the current password"})
            
            if len(newPassword) > self.PASSWORD_MAX_LENGTH:
                return JsonResponse({"ok": False, "error": f"Password cannot exceed {self.PASSWORD_MAX_LENGTH} characters"})

            user.set_password(newPassword)
            user.save()
            update_session_auth_hash(request, user)

            return JsonResponse({"ok": True})
        
        return JsonResponse({"ok": False, "errors": serializer.errors})

class UpdateUsernameView(APIView):
    permission_classes = [IsAuthenticated]
    USERNAME_MAX_LENGTH = 24

    def patch(self, request):
        user = request.user
        new_username = request.data.get('username', '').strip()

        if not new_username:
            return JsonResponse({"ok": False, "error": "New username cannot be empty"})

        if len(new_username) > self.USERNAME_MAX_LENGTH:
            return JsonResponse({"ok": False, "error": f"Username cannot exceed 24 characters"})

        if new_username == user.username:
            return JsonResponse({"ok": False, "error": "New username cannot be the same as the current username"})

        if User.objects.filter(username=new_username).exists():
            return JsonResponse({"ok": False, "error": "Username already taken"})

        user.username = new_username
        user.save()

        return JsonResponse({"ok": True, "username": user.username})


class UpdateProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    MAX_FILE_SIZE = 5 * 1024 * 1024

    def patch(self, request):
        user = request.user
        
        if 'pfp' not in request.FILES:
            return JsonResponse({"ok": False, "error": "No profile picture provided"})
        
        profile_picture = request.FILES['pfp']
        
        if profile_picture.content_type != 'image/png':
            return JsonResponse({"ok": False, "error": "Only PNG images are allowed"})
        
        if profile_picture.size > self.MAX_FILE_SIZE:
            return JsonResponse({"ok": False, "error": "File size exceeds 5MB limit"})
        
        user.pfp = profile_picture.read()
        user.save()

        return JsonResponse({"ok": True, "message": "Profile picture updated successfully"})

class GetProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.pfp:
            encoded_pfp = base64.b64encode(user.pfp).decode('utf-8')
            return JsonResponse({
                "ok": True,
                "pfp": f"data:image/png;base64,{encoded_pfp}"
            })
        else:
            return JsonResponse({"ok": False, "error": "Profile picture not found"})
