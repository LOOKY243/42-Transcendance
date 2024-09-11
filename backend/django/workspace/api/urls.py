from django.urls import path
from . import views

urlpatterns = [
    path("", views.RegisterListCreate.as_view(), name="register-view-create")
]