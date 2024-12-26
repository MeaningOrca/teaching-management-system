from django.http import JsonResponse
from .models import Course
from teachers.models import Teacher
import json

def get_courses(request):
    courses = Course.objects.all()
    course_list = [{"id": course.course_id, "name": course.course_name} for course in courses]
    return JsonResponse({"courses": course_list})

def add_courses(request):
    try:
        data = json.loads(request.body.decode("utf-8"))

        Course(
            course_id = data["courseId"],
            course_name = data["courseName"],
            credits = data["credits"],
            semester = data["semester"],
            teacher = Teacher.objects.get(teacher_id=data["teacherId"]),
            # student = "1",
        ).save()
    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"message": "success"})
