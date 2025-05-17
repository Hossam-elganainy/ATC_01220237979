from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta


def get_chart_data(object):
    object_over_week_days = [0 for _ in range(7)]

    # Loop over each day of the past week
    for i in range(7):
        start_date = timezone.now() - timedelta(days=i + 1)
        end_date = timezone.now() - timedelta(days=i)

        # Filter object by excluding specified statuses and within the date range
        object_over_week_days[i] = object.filter(
            created_at__gt=start_date,
            created_at__lte=end_date
        ).count()
        
    chart_data = {
        'labels': [(timezone.now() - timedelta(days=i)).strftime('%A') for i in range(7)][::-1],
        'data': object_over_week_days[::-1]
    }
    
    return chart_data