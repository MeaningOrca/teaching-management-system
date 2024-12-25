from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.http import JsonResponse


@login_required
def home_view(request):
    return render(request, 'home.html', {'role': request.user.role})


def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('/')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('/login')

import json

def print_json(request):
    # if isinstance(data, str):
    #     try:
    #         data = json.loads(data)
    #     except json.JSONDecodeError:
    #         data = {"message": "Invalid JSON string"}
    #         return JsonResponse(data, status=500)
    #
    # # Pretty print the JSON data
    # print(json.dumps(data, indent=4, ensure_ascii=False))
    # data = {"message": "Success!"}
    # return JsonResponse(data, status=200)
    # Extract query parameters or POST data
    data = {
        "method": request.method,
        "headers": dict(request.headers),  # Convert headers to a dictionary
        "body": request.body.decode("utf-8"),  # Decode body if needed
        "GET_params": request.GET.dict(),  # Convert QueryDict to a regular dictionary
        "POST_params": request.POST.dict()  # Convert QueryDict to a regular dictionary
    }
    # Serialize data to JSON
    json_data = json.dumps(data, indent=4, ensure_ascii=False)
    print(json_data)
    return JsonResponse({"message": "Request details", "data": json.loads(json_data)})
