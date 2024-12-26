from django.http import JsonResponse
from .models import Teacher  # Adjust the import path based on your app structure
import json

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
    return JsonResponse({"success": "success"}, status=200)

def update_contact_info(request):
    (Teacher.objects.filter(teacher_id=request.user.user_id)
     .update(contact=json.loads(request.body)["contact"]))

    return JsonResponse({"success": "success"}, status=200)
