from django.contrib import admin
from .models import Type
from unfold.admin import ModelAdmin


class TypeAdmin(ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name', 'description')

admin.site.register(Type, TypeAdmin)

