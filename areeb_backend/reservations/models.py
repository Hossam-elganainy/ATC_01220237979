from django.db import models
from users.models import User
from events.models import Event
from django.utils.translation import gettext_lazy as _
from type.models import Type

STATUS_CHOICES = [
    ('pending', 'قيد الانتظار'),
    ('cancelled', 'ملغي'),
    ('completed', 'مكتمل'),
]

PAYMENT_METHOD_CHOICES = [
    ('cash', 'نقدي'),
    ('card', 'بطاقة'),
]
 

PAYMENT_STATUS_CHOICES = [
    ('pending', 'قيد الانتظار'),
    ('paid', 'مدفوع'),
    ('failed', 'فشل'),
    ('waiting_for_refund', 'قيد الانتظار للاسترجاع'),
    ('refunded', 'مسترجع'),
    ('cancelled', 'ملغي')
]

class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE,related_name='reservations')
    price = models.FloatField(verbose_name=_('price'))
    status = models.CharField(max_length=255, choices=STATUS_CHOICES,verbose_name=_('status'))
    # related_type = models.ForeignKey(Type, on_delete=models.CASCADE,related_name='reservations',blank=True,null=True)
    payment_method = models.CharField(max_length=255, choices=PAYMENT_METHOD_CHOICES,verbose_name=_('payment method')) 
    payment_status = models.CharField(max_length=255, choices=PAYMENT_STATUS_CHOICES,verbose_name=_('payment status'))
    charge_id = models.CharField(max_length=255, verbose_name=_('charge id'), null=True, blank=True)

    # date = models.DateTimeField(verbose_name=_('date'))

    created_at = models.DateTimeField(auto_now_add=True,verbose_name=_('created_at'))
    updated_at = models.DateTimeField(auto_now=True,verbose_name=_('updated_at'))

    class Meta:
        verbose_name = _('reservation')
        verbose_name_plural = _('reservations')
        # unique together user service and date
        unique_together = ('user', 'event')

    def __str__(self):
        return f"{self.user.email} - {self.event.name} - {self.event.type.name}"

  
    # @property
    # def get_related_type(self):
    #     return self.event.type
    
    # def save(self, *args, **kwargs):
    #     if self.event and not self.related_type:
    #         self.related_type = self.event.type
    #     super().save(*args, **kwargs)
