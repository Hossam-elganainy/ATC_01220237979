from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import User
from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm

@admin.register(User)
class CustomUserAdmin(ModelAdmin, UserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    change_password_form = AdminPasswordChangeForm
    model = User
    
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'get_group')
    list_filter = ('is_staff', 'is_active', 'groups')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('معلومات شخصية', {'fields': ('first_name', 'last_name')}),
        ('الصلاحيات', {
            'fields': (
                'is_active',
                'is_staff',
                # 'is_superuser',
                # 'groups',
                
            ),
        }),
        ('تواريخ مهمة', {'fields': ('last_login',), 'classes': ('collapse',)}),
    )
    
    # add_fieldsets = (
    #     (None, {
    #         'classes': ('wide',),
    #         'fields': (
    #             'id_number',
    #             'first_name',
    #             'last_name',
    #             'password1',
    #             'password2',
    #             'is_staff',
    #             'is_active',
    #             'groups',
    #            
    #         )
        # }),
    # )
    
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    
    # إضافة خيارات Unfold
    list_per_page = 25
    save_on_top = True
    show_full_result_count = True
    
    def get_group(self, obj):
        """
        Get the first group of the user to display in the list
        """
        return obj.groups.first().name if obj.groups.exists() else '-'
    get_group.short_description = 'Group'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        
        # Exclude admin user from the list
        qs = qs.exclude(email='admin')
        
        if request.user.is_superuser:
            return qs

        if request.user.is_staff and request.user.has_perm('users.view_user'):
            branch = getattr(request.user, 'branch', None)
            if branch:
                return qs.filter(related_branch=branch)
            branch2 = getattr(request.user, None)
            if branch2:
                return qs.filter(related_branch=branch2)
        return qs.none()

    # def get_search_results(self, request, queryset, search_term):
    #     # Exclude admin user from search results
    #     queryset = queryset.exclude(email='admin')
        
    #     # For Specialist autocomplete in Reports, filter by branch
    #     if request.GET.get('field_name') == 'specialist':
    #         branch = getattr(request.user, 'branch', None) or getattr(request.user, None)
    #         if branch:
    #             queryset = queryset.filter(related_branch=branch)  # use 'branch=branch' if that's the correct field
    #     # For User autocomplete, show all users
    #     elif request.GET.get('field_name') == 'user':
    #         queryset = User.objects.all().exclude(email='admin')
    #     return super().get_search_results(request, queryset, search_term)
    
    # def has_add_permission(self, request):
    #     return False
    
    # def has_delete_permission(self, request, obj=None):
    #     return False
    
    # def has_change_permission(self, request, obj=None):
    #     return False
    
    # def has_view_permission(self, request, obj=None):
    #     return True



