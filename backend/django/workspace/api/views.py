from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer

# class RegisterListCreate(generics.ListCreateAPIView):
#     queryset = Register.objects.all()
#     serializer_class = RegisterSerializer

class RegisterView(APIView):
    def put(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"username": user.username}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)