from rest_framework import serializers
from .models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=150, write_only=True)
    password = serializers.CharField(max_length=128, write_only=True)
    
    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if not user:
            raise serializers.ValidationError(_("User with this email does not exist"))
        return value
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError(_("Invalid password"))
        token, created = Token.objects.get_or_create(user=user)
        
        data['user'] = user
        data['token'] = token
        
        return data
    
    
    
    
    
class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(max_length=128, write_only=True)
    password2 = serializers.CharField(max_length=128, write_only=True)
    
    class Meta:
        model = User
        fields = ['first_name','last_name','email', 'password1', 'password2']


    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if user:
            raise serializers.ValidationError(_("User with this email already exists"))
        return value

    
    def validate(self, data):
        password1 = data.get('password1')
        password2 = data.get('password2')
        
        if password1 != password2:
            raise serializers.ValidationError(_("Passwords do not match"))
        
        return data
    
    
    def create(self, validated_data):
        user = User.objects.create(
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data.get('email')
        )
            
        user.set_password(validated_data.get('password2'))
        user.save()
        
        token, created = Token.objects.get_or_create(user=user)
        
        validated_data['user'] = user
        validated_data['token'] = token
        
        return validated_data
        


class UserSrializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'first_name', 'last_name',"email"]
        read_only_fields = ['email',]


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=150)
    old_password = serializers.CharField(max_length=150)
    new_password = serializers.CharField(max_length=150)
    confirm_new_password = serializers.CharField(max_length=150)
    
    def validate(self, data):
        email = data.get('email')
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        confirm_new_password = data.get('confirm_new_password')

        curr_user = self.context.get('request').user

        #check if user with this email exist
        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError(_("User with this email does not exist"))

        if not user == curr_user:
            raise serializers.ValidationError(_("You are not authorized to perform this action"))

        
        #check old password
        user = authenticate(email=email, password=old_password)
        if not user:
            raise serializers.ValidationError(_("invalid old password"))
        
        #check new password and confirm_new_password
        if new_password != confirm_new_password:
            raise serializers.ValidationError(_("new password and confirm new password do not match"))
        
        user.set_password(confirm_new_password)
        user.save()
        
        return data
                