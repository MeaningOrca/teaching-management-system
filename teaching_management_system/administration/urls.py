from django.urls import path
from . import views

urlpatterns = [
    path('users/add', views.add_user, name='add'),  # Example route
    path('users/search', views.search_user, name='search'),
    path('users/delete', views.delete_user, name='delete')
]
