from django.urls import path
from .views import EventListView, EventRetrieveView

urlpatterns = [
    path('', EventListView.as_view(), name='event-list'),
    path('<int:pk>/', EventRetrieveView.as_view(), name='event-detail'),
]
