from django.http import JsonResponse
from .models import Teacher  # Adjust the import path based on your app structure

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
