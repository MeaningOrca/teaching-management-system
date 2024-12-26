from django.urls import path
from . import views

urlpatterns = [
    path('users/add', views.add_user, name='add'),  # Example route
    path('users/search', views.search_user, name='search'),
    path('users/delete/<int:id>', views.delete_user, name='delete')
]
