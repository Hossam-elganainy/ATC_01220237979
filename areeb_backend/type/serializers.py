from rest_framework import serializers
from .models import Type

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        exclude = ['created_at', 'updated_at','description']
