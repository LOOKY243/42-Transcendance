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
from django.views.generic.edit import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .utils import check_token_status
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from rest_framework.parsers import MultiPartParser, FormParser
import base64
from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404

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
        return JsonResponse({"ok": False})


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)

            user.update_last_activity()
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
        current_user = request.user
        
        if current_user.is_authenticated:
            current_user.is_online = False
            current_user.save()
            
            logout(request)

            response = JsonResponse({"ok": True})
            response.delete_cookie('accessToken')
            response.delete_cookie('refreshToken')
        else:
            response = JsonResponse({"ok": False, "error": "User is not authenticated."})

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

class UpdateLanguageView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        new_lang = request.data.get('lang')

        user.update_last_activity()

        if not new_lang:
            return JsonResponse({"ok": False, "error": "No language provided"})

        if new_lang == user.lang:
            return JsonResponse({"ok": False, "error": "New language is the same as the current language"})

        user.lang = new_lang
        user.save()

        return JsonResponse({"ok": True})

class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    PASSWORD_MAX_LENGTH = 30

    def patch(self, request):
        user = request.user
        user.update_last_activity()
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
        user.update_last_activity()
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
        user.update_last_activity()
        
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
        user.update_last_activity()

        if user.pfp:
            encoded_pfp = base64.b64encode(user.pfp).decode('utf-8')
            return JsonResponse({
                "ok": True,
                "pfp": f"data:image/png;base64,{encoded_pfp}"
            })
        else:
            return JsonResponse({"ok": False, "error": "Profile picture not found"})

class SearchUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        search_string = request.data.get('search_string', '')
        current_user = request.user
        current_user.update_last_activity()
        friends = current_user.friends.all()

        users = CustomUser.objects.filter(
            username__icontains=search_string
        ).exclude(
            id__in=friends.values_list('id', flat=True)
        ).exclude(
            id=current_user.id
        )

        user_list = [{"id": user.id, "username": user.username} for user in users]

        return JsonResponse({
            "ok": True,
            "users": user_list
        })

class AddFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        friend_username = request.data.get('username')

        if not friend_username:
            return JsonResponse({"ok": False, "error": "No username provided."})

        try:
            friend = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            return JsonResponse({"ok": False, "error": "User not found."})

        current_user = request.user
        current_user.update_last_activity()

        if friend.id == current_user.id:
            return JsonResponse({"ok": False, "error": "You cannot add yourself as a friend."})

        if friend in current_user.friends.all():
            return JsonResponse({"ok": False, "error": "This user is already your friend."})

        current_user.friends.add(friend)
        current_user.save()

        return JsonResponse({"ok": True, "message": f"{friend.username} has been added as a friend."})

class GetFriendListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user
        current_user.update_last_activity()

        friends = current_user.friends.all()
        friend_list = []

        expiration_time = timedelta(minutes=15)

        for friend in friends:
            is_online = False
            if not friend.is_online:
                is_online = False

            elif friend.last_activity and (timezone.now() - friend.last_activity) < expiration_time:
                is_online = True
            else:
                friend.is_online = False
                friend.save()
                
            friend_list.append({
                "id": friend.id,
                "username": friend.username,
                "is_online": is_online,
            })

        if not friend_list:
            return JsonResponse({
                "ok": False,
                "message": "No friends found."
            })

        return JsonResponse({
            "ok": True,
            "friends": friend_list
        })

class RemoveFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        current_user = request.user
        friend_to_remove = get_object_or_404(CustomUser, username=request.data.get('username'))

        if friend_to_remove in current_user.friends.all():
            current_user.friends.remove(friend_to_remove)
            current_user.save()
            return JsonResponse({"ok": True, "message": "Friend has been removed."})
        else:
            return JsonResponse({"ok": False, "message": "Friend not found in your friend list."})