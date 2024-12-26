from django.urls import path
from . import views

urlpatterns = [
    path('get-courses/', views.get_courses, name='get_courses'),
    path('api/courses/add', views.add_courses, name='add_courses'),
    path('api/grades/submit', views.submit_grades, name='submit_grades')
]
