from django.http import JsonResponse
from .models import Course

def get_courses(request):
    courses = Course.objects.all()
    course_list = [{"id": course.course_id, "name": course.course_name} for course in courses]
    return JsonResponse({"courses": course_list})
