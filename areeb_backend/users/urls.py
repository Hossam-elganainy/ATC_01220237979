from django.urls import path
from .views import LoginView,RegisterView,PasswordResetView,UserProfileView

urlpatterns = [
    
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('password_reset/', PasswordResetView.as_view(), name='password_reset'),
    path('user_profile/', UserProfileView.as_view(), name='user_profile'),
]
