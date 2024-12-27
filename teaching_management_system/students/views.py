from Scripts.bottle import response
from courses.models import Enrollment, Score
from .models import Student, StudentSerializer
from django.http import JsonResponse

def get_students(request):
    course_id = request.GET.dict()["course_id"]
    ids = Enrollment.objects.filter(course_id=course_id)
    response = {"data": []}

    for i in ids:
        response["data"].append({
            "id": i.student_id,
            "name": i.student.student_name,
            "score": 80
        })

    return JsonResponse(response)

def get_student_courses(request):
    id = request.GET.dict()["studentId"]
    response = {"data": []}
    for i in Enrollment.objects.filter(student_id=id):
        try:
           score = Score.objects.get(course_id=i.course_id, student_id=id).score
        except Score.DoesNotExist:
            score = '-'
        finally:
            response["data"].append({
                "courseName": i.course.course_name,
                "score": score
            })

    return JsonResponse(response)

def get_students_list(request):
    response = {"data": []}
    for i in Student.objects.all():
        response["data"].append(StudentSerializer(i).data)
    return JsonResponse(response)
