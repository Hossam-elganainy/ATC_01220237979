from django.db import models
from type.models import Type
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
import datetime


class Event(models.Model):
    name = models.CharField(max_length=255,verbose_name=_('name'))
    description = models.TextField(verbose_name=_('description'))
    price = models.DecimalField(max_digits=10, decimal_places=2,verbose_name=_('price'))
    attendees_count = models.IntegerField(default=0,verbose_name=_('attendees_count'))
    type = models.ForeignKey(Type, on_delete=models.CASCADE, related_name='events',verbose_name=_('type'))
    image = models.ImageField(upload_to='events/',verbose_name=_('image'))
    is_active = models.BooleanField(default=True,verbose_name=_('is_active'))
    date = models.DateField(verbose_name=_('date'))
    time = models.TimeField(verbose_name=_('time'))
    location = models.CharField(max_length=255,verbose_name=_('location'))
    latitude = models.DecimalField(max_digits=10, decimal_places=8,verbose_name=_('latitude'))
    longitude = models.DecimalField(max_digits=10, decimal_places=8,verbose_name=_('longitude'))


    created_at = models.DateTimeField(auto_now_add=True,verbose_name=_('created_at'))
    updated_at = models.DateTimeField(auto_now=True,verbose_name=_('updated_at'))

    class Meta:
        verbose_name = _('event')
        verbose_name_plural = _('events')

    def __str__(self):
        return f"{self.name} - {self.type.name}"
    
    @property
    def is_past_event(self):
        """تحقق مما إذا كان موعد الحدث قد انتهى"""
        today = timezone.now().date()
        if self.date < today:
            return True
        elif self.date == today:
            # إذا كان نفس اليوم، تحقق من الوقت
            now = timezone.now().time()
            return self.time < now
        return False
    
    def save(self, *args, **kwargs):
        # تحديث حالة is_active بناءً على ما إذا كان الحدث قد انتهى
        if self.is_past_event:
            self.is_active = False
        super().save(*args, **kwargs)