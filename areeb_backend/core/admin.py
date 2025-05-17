# admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.models import Group, Permission

from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from unfold.admin import ModelAdmin


admin.site.unregister(Group)


@admin.register(Group)
class GroupAdmin(BaseGroupAdmin, ModelAdmin):
    pass


@admin.register(Permission)
class PermissionAdmin(ModelAdmin):
    list_display = ('name', 'content_type', 'codename')
    list_filter = ('content_type',)
    search_fields = ('name', 'codename')
    ordering = ('content_type__app_label', 'content_type__model', 'codename')