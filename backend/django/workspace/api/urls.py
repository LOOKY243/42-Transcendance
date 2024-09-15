from django.urls import path
from .views import RegisterView, LoginView, CheckAuthView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('isAuth/', CheckAuthView.as_view(), name='isAuth'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
