from django.contrib import admin
from .models import Event
from unfold.admin import ModelAdmin

class EventAdmin(ModelAdmin):
    list_display = ('name', 'description', 'price', 'type', 'created_at', 'updated_at','is_active','attendees_count','date','time','location','latitude','longitude')
    list_filter = ('type','is_active','date')
    search_fields = ('name', 'description','date')
    list_editable = ('is_active',)
    list_per_page = 25
    save_on_top = True
    show_full_result_count = True
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('name', 'description', 'price', 'type', 'is_active','date','time','location','latitude','longitude'),
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
admin.site.register(Event, EventAdmin)
