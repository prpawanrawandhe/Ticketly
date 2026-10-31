from django.urls import path
from . import views

urlpatterns = [
    path("add-bus/",views.add_bus_view,name="add_bus_view"),
    path("bus-list/",views.list_bus_view,name="list_bus_view"),
    path("edit-bus/<int:pk>",views.edit_bus_view,name="edit_bus_view"),
    path("delete-bus/<int:pk>",views.delete_bus_view,name="delete_bus_view"),
]
