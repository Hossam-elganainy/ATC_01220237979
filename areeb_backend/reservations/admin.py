from django.contrib import admin
from .models import Reservation
from unfold.admin import ModelAdmin
from django.utils.translation import gettext_lazy as _
from events.models import Event
from django.db import models


@admin.register(Reservation)
class ReservationAdmin(ModelAdmin):
    autocomplete_fields = ['user', 'event']
    list_display = ('user', 'event', 'price', 'status', 'payment_method', 'payment_status')
    list_filter = ('status', 'payment_method', 'payment_status')
    search_fields = ('user__email', 'event__name')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        
        if request.user.is_superuser:
            return qs

        if request.user.is_staff and request.user.has_perm('reservations.view_reservation'):
            type = getattr(request.user, 'type', None)
            if type:
                return qs.filter(related_type=type)
            # جرب أيضاً لو اسم الحقل related_branch
            type2 = getattr(request.user, 'related_type', None)
            if type2:
                return qs.filter(related_type=type2)
        return qs.none()
