from django.urls import path
from .views import RegisterView, LoginView, GetUserView, LogoutView, UpdateLanguageView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('getUser/', GetUserView.as_view(), name='getUser'),
    path('updateLanguage/', UpdateLanguageView.as_view(), name='updateLanguage'),
]
