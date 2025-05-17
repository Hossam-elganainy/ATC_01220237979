from django.shortcuts import render
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from .models import Event
from .serializers import EventSerializer
from rest_framework import parsers
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

class EventListView(ListAPIView):
    serializer_class = EventSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    queryset = Event.objects.all()
    def get_queryset(self):
        # تحديث حالة الأحداث السابقة
        self.update_past_events()
        
        # إرجاع الأحداث النشطة فقط
        return Event.objects.filter(is_active=True)
    
    def update_past_events(self):
        """تحديث حالة الأحداث التي انتهى موعدها"""
        today = timezone.now().date()
        now = timezone.now().time()
        
        # الأحداث التي تاريخها قبل اليوم
        past_events = Event.objects.filter(date__lt=today, is_active=True)
        for event in past_events:
            event.is_active = False
            event.save(update_fields=['is_active'])
        
        # الأحداث التي في نفس اليوم ولكن وقتها قد مر
        today_events = Event.objects.filter(date=today, is_active=True)
        for event in today_events:
            if event.time < now:
                event.is_active = False
                event.save(update_fields=['is_active'])

class EventRetrieveView(RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]


   






