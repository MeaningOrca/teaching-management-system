from django.http import JsonResponse, HttpResponse
from .models import Course, Score
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

def submit_grades(request):
    pass

def get_grades(request):
    scores = Score.objects.filter(student_id=request.user.user_id)
    data = {}
    for i in scores:
        course = Course.objects.get(course_id=i.course_id).course_name
        data[course] =  i.score

    return JsonResponse(data)

def search_course(request, id):
    try:
        course = Course.objects.get(course_id=id)
        teachers = []
        for i in Teacher.objects.all():
            teachers.append({"id": i.teacher_id, "name": i.teacher_name})

        data = {
            "name": course.course_name, "semester": course.semester,
            "teachers": teachers
        }
        return JsonResponse(data, status=200)
    except Course.DoesNotExist:
        return JsonResponse({}, status=400)

def modify_course(request):
    data = json.loads(request.body)
    try:
        course = Course.objects.get(course_id=data["courseId"])
        course.course_name = data["courseName"]
        course.semester = data["semester"]
        course.teacher = Teacher.objects.get(teacher_id=data["teacher"])
        course.save()
        return HttpResponse(status=200)
    except Exception as e:
        print(e)
        return HttpResponse(status=500)
