from django.urls import path
from .views import ReservationListCreateView, ReservationCancelView, AvailableTimeSlotsView

urlpatterns = [
    path('', ReservationListCreateView.as_view(), name='reservation-list-create'),
    path('<int:pk>/cancel/', ReservationCancelView.as_view(), name='reservation-cancel'),
]

