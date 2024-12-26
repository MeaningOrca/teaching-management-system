from django.urls import path
from . import views

urlpatterns = [
    path('users/add', views.add_user, name='add'),  # Example route
    path('users/search', views.search_user, name='search'),
    path('users/delete/<int:id>/<str:type>', views.delete_user, name='delete'),
    path('users/update/<int:id>/<str:type>', views.edit_user, name='update')
]
