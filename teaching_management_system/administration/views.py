import json
from django.http import JsonResponse

from .tools import save_to_db

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
