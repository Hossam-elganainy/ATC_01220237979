from rest_framework import serializers
from .models import Reservation
from django.utils import timezone
from datetime import datetime, time, timedelta
from django.db.models import Count

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        exclude = ['user']
        read_only_fields = ['created_at', 'updated_at','status','price','payment_status','charge_id']

    def validate_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("لا يمكن الحجز في تاريخ سابق.")
        return value

    def validate(self, attrs):
        event = attrs.get('event')
        if event and event.attendees_count <= 0:
            raise serializers.ValidationError({"event": "هذا الحدث مكتمل ولا يمكن الحجز فيه."})
        
        if event and event.is_past_event:
            raise serializers.ValidationError({"event": "لا يمكن الحجز في حدث انتهى موعده."})
        
        date = attrs.get('date')
        request = self.context.get('request')
        if request and request.user and date:
            booking_date = date.date()
            
            existing_reservations = Reservation.objects.filter(
                user=request.user,
                date__date=booking_date,
                status__in=['pending', 'completed']
            )
            
            if existing_reservations.exists():
                raise serializers.ValidationError({"date": "لديك بالفعل حجز في هذا اليوم. لا يمكن حجز أكثر من حدث في نفس اليوم."})
                
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['status'] = 'pending'
        validated_data['payment_status'] = 'pending'
        validated_data['price'] = validated_data['event'].price
        if validated_data['event'].price == 0:
            validated_data['payment_status'] = "paid"
        
        event = validated_data['event']
        event.attendees_count -= 1
        
        if event.attendees_count <= 0:
            event.is_active = False
            
        event.save()
        
        return super().create(validated_data)
    

    
        
        



