from django.urls import path
from .views import RegisterView, LoginView, GetUserView, LogoutView, TwoFactorSetupView, TwoFactorVerifyView, TwoFactorActivateView, UpdateLanguageView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('getUser/', GetUserView.as_view(), name='getUser'),
    path('2fa/activate/', TwoFactorActivateView.as_view(), name='two_factor_activate'),
    path('2fa/setup/', TwoFactorSetupView.as_view(), name='two_factor_setup'),
    path('2fa/verify/', TwoFactorVerifyView.as_view(), name='two_factor_verify'),
    path('updateLanguage/', UpdateLanguageView.as_view(), name='updateLanguage'),
    path('updatePassword/', UpdatePasswordView.as_view(), name='updatePassword'),
]
