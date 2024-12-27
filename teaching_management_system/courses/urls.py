from django.urls import path
from . import views

urlpatterns = [
    path('get-courses/', views.get_courses, name='get_courses'),
    path('api/courses/add', views.add_courses, name='add_courses'),
    path('api/grades/submit', views.submit_grades, name='submit_grades'),
    path('api/courses/<int:id>', views.search_course, name='search_course'),
    path('api/courses/modify', views.modify_course, name='modify'),
    path('api/courses/delete/<int:id>', views.delete_course, name='delete'),
    path('get-grades', views.get_grades, name='get_grades'),
    path('get-students-in-course/<int:id>/', views.get_students_in_course, name='get-students-in-course'),
    path('api/enrollment/add', views.add_enrollment, name='add_enrollment'),
    path('api/enrollment/cancel', views.cancel_enrollment, name='cancel_enrollment'),
    path('api/get-enrolled-courses', views.get_enrolled_courses, name='get-enrolled-courses'),
    path('api/get-student-grades/', views.get_student_grades, name='get_student_grades'),
]
