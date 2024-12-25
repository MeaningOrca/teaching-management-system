from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_teachers, name='teachers'),  # Example route
]
