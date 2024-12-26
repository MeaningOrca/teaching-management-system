import json
from django.http import JsonResponse, HttpResponse

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


def delete_user(request, id):
    # May be add select to make it easier not 2 requests same time
    # data = json.loads(request.body.decode("UTF-8"))
    # user = get_user_object("student", data["identifier"])
    # user.delete()
    print(id)
    return JsonResponse({"success": "200"}, status=200)
