from django.http import JsonResponse, HttpResponse
from .models import Course, Score, Enrollment
from teachers.models import Teacher
from students.models import Student
import json


def get_courses(request):
    courses = Course.objects.all()
    course_list = [{"id": course.course_id, "name": course.course_name} for course in courses]
    return JsonResponse({"courses": course_list})


def add_courses(request):
    try:
        data = json.loads(request.body.decode("utf-8"))

        Course(
            course_id=data["courseId"],
            course_name=data["courseName"],
            credits=data["credits"],
            semester=data["semester"],
            teacher=Teacher.objects.get(teacher_id=data["teacherId"]),
            # student = "1",
        ).save()
    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"message": "success"})


def submit_grades(request):
    data = json.loads(request.body)
    try:
        score = Score(
            score = data["grade"],
            student = Student.objects.get(student_id=data["studentID"]),
            course = Course.objects.get(course_id=data["courseID"])
        )
        score.save()
        return JsonResponse({"success": 200}, status=200)
    except Exception as e:
        print(e)
        return JsonResponse({"message": "Not found!"}, status=400)


def get_grades(request):
    scores = Score.objects.filter(student_id=request.user.user_id)
    data = {}
    for i in scores:
        course = Course.objects.get(course_id=i.course_id).course_name
        data[course] = i.score

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
        return JsonResponse({"success": 200}, status=200)
    except Exception as e:
        print(e)
        return HttpResponse(status=500)


def delete_course(request, id):
    try:
        Course.objects.get(course_id=id).delete()
        return JsonResponse({"success": 200}, status=200)
    except Exception as e:
        print(e)
        return HttpResponse(status=500)

def get_students_in_course(request, id):
    course = Course.objects.get(course_id=id)
    print(course, course.student.student_id)
    return HttpResponse(status=500)

def add_enrollment(request):
    course_id = json.loads(request.body)["course_id"]
    try:
        obj = Enrollment(
            student = Student.objects.get(student_id=request.user.user_id),
            course = Course.objects.get(course_id=course_id),
        )
        obj.save()
        return JsonResponse({"success": 200}, status=200)
    except Exception as e:
        print(e)
        return HttpResponse(status=500)

def get_enrolled_courses(request):
    enrollment = Enrollment.objects.filter(student_id = request.user.user_id)
    response = {"courses": []}
    for i in enrollment:
        course = Course.objects.get(course_id=i.course_id)
        response["courses"].append({
            "id": i.course_id,
            "name": course.course_name
        })
    return JsonResponse(response, status=200)

def cancel_enrollment(request):
    course_id = json.loads(request.body)["course_id"]
    Enrollment.objects.get(course_id=course_id, student_id=request.user.user_id).delete()
    return JsonResponse({"success": 200}, status=200)


def get_student_grades(request):
    scores = Score.objects.filter(student_id=request.user.user_id)
    data = {"courses": []}

    for i in scores:
        data["courses"].append({
            "score": i.score,
            "course_name": Course.objects.get(course_id=i.course_id).course_name
        })

    return JsonResponse(data, status=200)
