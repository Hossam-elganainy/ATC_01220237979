from rest_framework import generics, permissions, parsers
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import LoginSerializer, RegisterSerializer , UserSrializers, PasswordResetSerializer
from rest_framework.permissions import IsAuthenticated



class LoginView(APIView):
    @swagger_auto_schema(
        request_body=LoginSerializer,
        operation_description="Login to the application",
        responses={200: openapi.Response("Login successful"), 400: openapi.Response("Invalid email or password")}
    )
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data.get('token')
            reponse = {
                'token': token.key,
                'user_data': UserSrializers(serializer.validated_data.get('user')).data
            }
            return Response(reponse, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            token = data.get('token')
            response = {
                'token': token.key,
                'user_data': UserSrializers(data.get('user')).data
            }
            
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserSrializers

    def get_object(self):
        return self.request.user
    


class PasswordResetView(APIView):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        request_body=PasswordResetSerializer,
        operation_description="Reset password",
        responses={200: openapi.Response("Password reset successful"), 400: openapi.Response("Invalid email")}
    )

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            return Response({"message":'password changed successfully'},status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)