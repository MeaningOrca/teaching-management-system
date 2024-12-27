import json
from django.http import JsonResponse
from .models import Counselor, Admin, Report
from students.models import Student
from teachers.models import Teacher
from courses.models import Course

from .tools import save_to_db, get_users_object


def add_user(request):
    data = {
        "method": request.method,
        "headers": dict(request.headers),  # Convert headers to a dictionary
        "body": request.body.decode("utf-8"),  # Decode body if needed
        "GET_params": request.GET.dict(),  # Convert QueryDict to a regular dictionary
        "POST_params": request.POST.dict()  # Convert QueryDict to a regular dictionary
    }
    # Serialize data to JSON
    json_data = json.dumps(data, indent=4, ensure_ascii=False)
    response = save_to_db(json.loads(json_data))
    print(response)
    if response == "OK":
        return JsonResponse({"message": "Request details", "data": response})
    return JsonResponse({"error": response}, status=400)


def search_user(request):
    data = request.GET.dict()
    users = get_users_object(data["user_id"])

    return JsonResponse(users)


def delete_user(request, id, type):
    # May be add select to make it easier not 2 requests same time
    # data = json.loads(request.body.decode("UTF-8"))
    match type:
        case "student":
            Student.objects.get(student_id=id).delete()
        case "teacher":
            Teacher.objects.get(teacher_id=id).delete()
        case "counselor":
            Counselor.objects.get(counselor_id=id).delete()
        case "admin":
            Admin.objects.get(admin_id=id).delete()

    return JsonResponse({"success": "200"}, status=200)


def edit_user(request, id, type):
    print(id, type, request.body)
    data = json.loads(request.body)
    match type:
        case "student":
            student = Student.objects.get(student_id=id)
            student.student_name = data["student_name"]
            student.gender = data["gender"]
            student.birthday = data["birthday"]
            student.class_assigned = data["class_assigned"]
            student.department = data["department"]
            student.save()
        case "teacher":
            teacher = Teacher.objects.get(teacher_id=id)
            teacher.teacher_name = data["teacher_name"]
            teacher.gender = data["gender"]
            teacher.contact = data["contact"]
            teacher.department = data["department"]
            teacher.save()
        case "counselor":
            counselor = Counselor.objects.get(counselor_id=id)
            counselor.counselor_name = data["counselor_name"]
            counselor.department = data["department"]
            counselor.class_assigned = data["class_assigned"]
            counselor.course = Course.objects.get(course_id=data["course"])
            counselor.save()
        case "admin":
            admin = Admin.objects.get(admin_id=id)
            admin.admin_name = data["admin_name"]
            admin.save()

    return JsonResponse({"success": "200"}, status=200)

def get_reports(request):
    reports = Report.objects.filter(student_id=request.user.user_id)
    response = {"reports": []}

    for report in reports:
        response["reports"].append({
            "title": report.reason,
            "from_user": report.report_role,
            "content": report.report_text,
            "created_at": report.report_date
        })

    return JsonResponse(response, status=200)
