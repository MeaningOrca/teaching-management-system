from django.http import JsonResponse
from .models import Teacher  # Adjust the import path based on your app structure
from administration.models import Report, Counselor
import json

from students.models import Student


def list_teachers(request):
    if request.method == "GET":
        try:
            # Query the database for all teachers
            teachers = Teacher.objects.all().values("teacher_id", "teacher_name")
            # Convert the QuerySet to a list and return it as JSON
            return JsonResponse(list(teachers), safe=False)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


def add_report(request):
    data = json.loads(request.body)
    print(data)
    try:
        report = Report(
            report_date=data["reportDate"],
            reason=data["reason"],
            report_role=data["reportRoler"],
            report_status=data["reportStatus"],
            report_text=data["reportText"],
            student=Student.objects.get(student_id=data["studentID"]),
            counselor=Counselor.objects.get(counselor_id=data["counselorID"]),
            teacher=Teacher.objects.get(teacher_id=request.user.user_id)
        )
        report.save()
        print("success!", report)

        return JsonResponse({"success": "success"}, status=200)
    except Exception as e:
        print(e)
        return JsonResponse({"message": str(e)}, status=500)

def update_contact_info(request):
    (Teacher.objects.filter(teacher_id=request.user.user_id)
     .update(contact=json.loads(request.body)["contact"]))

    return JsonResponse({"success": "success"}, status=200)
