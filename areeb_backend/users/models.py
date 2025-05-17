from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from .managers import UserManager
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token


class User(AbstractBaseUser, PermissionsMixin):
    # related_branch = models.ForeignKey('branches.Branch', on_delete=models.CASCADE, verbose_name=_('related branch'),null=True,blank=True)
    first_name = models.CharField(max_length=150, blank=True,verbose_name=_('first name'))
    last_name = models.CharField(max_length=150, blank=True,verbose_name=_('last name'))
    email = models.EmailField( unique=True,verbose_name=_('email'))

    
    RegistrationDate = models.DateTimeField(auto_now_add=True,verbose_name=_('registration date'))

    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
        
    )
    
    is_superuser = models.BooleanField(
        _("Superuser status"),
        default=False,
        help_text=_("Designates that this user has all permissions without explicitly assigning them."),
        
    )
    
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_("Designates whether this user should be treated as active. "
        "Unselect this instead of deleting accounts."),
        
    )

    # إضافة حقل groups بشكل صريح
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="custom_user_set",
        related_query_name="user",
    )

    # إضافة حقل user_permissions بشكل صريح
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="custom_user_set",
        related_query_name="user",
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
    
    @property
    def get_token(self):
        token, created = Token.objects.get_or_create(user=self)
        return token.key
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return f"{self.email} - {self.first_name} {self.last_name}"
    
    def has_perm(self, perm, obj=None):
        """
        Check if the user has a specific permission
        """
        # The superuser has all permissions
        if self.is_superuser:
            return True
            
        if not self.is_active:
            return False
            
        # Check if user has this permission directly
        if self.user_permissions.filter(codename=perm.split('.')[-1]).exists():
            return True
            
        # Check if any of user's groups has this permission
        return self.groups.filter(permissions__codename=perm.split('.')[-1]).exists()

    def has_module_perms(self, app_label):
        """
        Check if the user has permissions on a specific application
        """
        # The superuser has all permissions
        if self.is_superuser:
            return True
            
        if not self.is_active:
            return False
            
        # Check if user has any permissions in this app
        return self.user_permissions.filter(content_type__app_label=app_label).exists() or \
               self.groups.filter(permissions__content_type__app_label=app_label).exists()
    
