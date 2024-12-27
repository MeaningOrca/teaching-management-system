from django.urls import path
from . import views

urlpatterns = [
    path('fetch/', views.get_students, name='get_students'),
    path('courses/', views.get_student_courses, name='get_student_courses'),
    path('list/', views.get_students_list, name="get_students_list")
]
