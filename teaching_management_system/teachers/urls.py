from django.urls import path
from . import views

urlpatterns = [
    path('/reports/add', views.add_report, name='add_report'),
    path('', views.list_teachers, name='teachers'),  # Example route
    path('/update', views.update_contact_info, name='update_contact_info')
]
