from django.urls import path
from . import views

urlpatterns = [
    path('get-courses/', views.get_courses, name='get_courses'),
    path('api/courses/add', views.add_courses, name='add_courses'),
    path('api/grades/submit', views.submit_grades, name='submit_grades'),
    path('api/courses/<int:id>', views.search_course, name='search_course'),
    path('api/courses/modify', views.modify_course, name='modify'),
    path('get-grades', views.get_grades, name='get_grades')
]
