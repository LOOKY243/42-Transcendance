from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication


class RegisterView(APIView):
    def put(self, request):
        username = request.data.get('username')
        
        if User.objects.filter(username=username).exists():
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

# class CheckAuthView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         if request.user.is_authenticated:
#             return JsonResponse({"ok": True})
#         else:
#             return JsonResponse({"ok": False})

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
