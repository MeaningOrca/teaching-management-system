import json
from django.http import JsonResponse, HttpResponse

from .tools import save_to_db, get_user_object

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
    user = get_user_object(data["user_type"], data["user_id"])

    data = json.dumps({"name": user.student_name})
    return JsonResponse({"message": "Request details", "data": json.loads(data)})


def delete_user(request):
    # data = json.loads(request.body.decode("UTF-8"))
    # user = get_user_object("student", data["identifier"])
    # user.delete()
    return JsonResponse({"success": "200"}, status=200)
