from django.shortcuts import render
from rest_framework import generics
from .models import Type
from .serializers import TypeSerializer

class TypeList(generics.ListAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
