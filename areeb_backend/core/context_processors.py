from django.views import View
from django.shortcuts import render, get_object_or_404, redirect
from django.core.paginator import Paginator
from django_filters.views import FilterView
from django.db.models import Sum, DecimalField, Count
from events.models import Event
from type.models import Type
from reservations.models import Reservation
# from reports.models import Reports
from .utils import get_chart_data
import json


def get_dashboard_data(request):
    if not request.user.has_perm('users.view_dashboard'):
        return {'dashboard': None}
    reservations = Reservation.objects.all()
    events = Event.objects.all()
    types = Type.objects.all()
    context = {}
    context['number_of_events'] = events.count()
    context['number_of_types'] = types.count()
    context['number_of_reservations'] = reservations.count()
    context['total_revenue'] = reservations.aggregate(total=Sum('price'))['total']
    
    
    area_chart_data = get_chart_data(reservations)
    context['area_chart_data'] = area_chart_data

    event_labels = [event.name for event in Event.objects.all()]
    event_data = []
    for event in event_labels:
        reservations_count = reservations.filter(event__name=event).count()
        event_data.append(reservations_count)

    context['pie_chart_data'] = {'data':event_data,'labels':event_labels}
        
    top_types = Type.objects.annotate(reservations_count=Count('events__reservations')).annotate(revenue=Sum('events__reservations__price')).order_by('-reservations_count').filter(reservations_count__gt=0)[:5]
    context['top_types'] = top_types

    return {'dashboard': context}
