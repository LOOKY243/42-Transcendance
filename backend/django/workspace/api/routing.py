from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/socket-server/<str:room_name>/', consumers.PongConsumer.as_asgi())
]