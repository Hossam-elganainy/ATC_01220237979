from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Reservation
from .serializers import ReservationSerializer
from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta, time
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.db.models import Count
from django.db.models.functions import TruncHour
from datetime import datetime

class ReservationListCreateView(generics.ListCreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set payment_status as 'pending' if payment_method is 'cash'
        if serializer.validated_data.get('payment_method') == 'cash':
            serializer.save(user=self.request.user, payment_status='pending')
        else:
            serializer.save(user=self.request.user)
    
class ReservationCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        instance = Reservation.objects.get(id=kwargs['pk'])
        user = request.user
        if instance.user != user:
            return Response({"error": "You are not allowed to cancel this reservation"}, status=status.HTTP_403_FORBIDDEN)
        if instance.status == 'cancelled':
            return Response({"error": "This reservation is already cancelled"}, status=status.HTTP_400_BAD_REQUEST)
        if instance.status == 'completed':
            return Response({"error": "Cannot cancel it. This reservation is already completed"}, status=status.HTTP_400_BAD_REQUEST)

        current_time = timezone.now()
        if instance.date - current_time < timedelta(hours=24):
            return Response({"error": "Cannot cancel it. This reservation is too close to the date"}, status=status.HTTP_400_BAD_REQUEST)

        # إذا كان الحجز قيد الانتظار أو مكتمل، قم بزيادة عدد المشاركين في الحدث
        if instance.status in ['pending', 'completed']:
            event = instance.event
            event.attendees_count += 1
            
            # إذا كان الحدث غير نشط (مغلق) وأصبح هناك مكان متاح، قم بإعادة تنشيطه
            if not event.is_active and event.attendees_count > 0:
                event.is_active = True
                
            event.save()

        # Handle refund logic
        if instance.payment_status == 'paid':
            if instance.payment_method == 'cash':
                instance.payment_status = 'waiting_for_refund'
                instance.status = 'cancelled'
                instance.save()
                return Response({"message": "Reservation cancelled successfully. Waiting for refund."}, status=status.HTTP_200_OK)
            elif instance.payment_method == 'card':
                instance.payment_status = 'waiting_for_refund'
                instance.status = 'cancelled'
                instance.save()
                #TODO: refund the payment
                return Response({"message": "Reservation cancelled successfully. Waiting for refund."}, status=status.HTTP_200_OK)

        instance.status = 'cancelled'
        instance.payment_status = 'cancelled'
        instance.save()
        return Response({"message": "Reservation cancelled successfully."}, status=status.HTTP_200_OK)

class AvailableTimeSlotsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # الحصول على التاريخ من الطلب - إذا لم يتم توفيره يستخدم اليوم
        date_param = request.query_params.get('date')
        try:
            if date_param:
                date_obj = datetime.strptime(date_param, '%Y-%m-%d').date()
            else:
                date_obj = timezone.now().date()
        except ValueError:
            return Response(
                {"error": "صيغة التاريخ غير صحيحة. استخدم الصيغة YYYY-MM-DD"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # تحقق مما إذا كان التاريخ في الماضي
        if date_obj < timezone.now().date():
            return Response(
                {"error": "لا يمكن الحجز في تاريخ سابق"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # إنشاء قائمة بالفترات المحجوزة فقط
        reserved_time_slots = []
        
        # الحصول على عدد الحجوزات لكل ساعة في هذا التاريخ
        for hour in range(8, 21):  # من 8 صباحًا إلى 9 مساءً (8-20)
            start_datetime = datetime.combine(date_obj, time(hour=hour))
            end_datetime = start_datetime + timedelta(hours=1)
            
            # تحويل إلى timezone-aware datetime إذا كان timezone مُمكّنًا
            start_datetime = timezone.make_aware(start_datetime) if timezone.is_naive(start_datetime) else start_datetime
            end_datetime = timezone.make_aware(end_datetime) if timezone.is_naive(end_datetime) else end_datetime
            
            # عدد الحجوزات في هذه الساعة
            count = Reservation.objects.filter(
                date__gte=start_datetime,
                date__lt=end_datetime,
                status__in=['pending', 'completed']  # استبعاد الحجوزات الملغية
            ).count()
            
            # إضافة الفترة فقط إذا كان بها حجوزات
            if count > 4:
                time_slot = {
                    "date": date_obj.strftime('%Y-%m-%d'),
                    "hour": hour,
                    "time": f"{hour}:00",
                    "reservations_count": count
                }
                reserved_time_slots.append(time_slot)
            
        return Response({"reserved_time_slots": reserved_time_slots})
