from django.urls import path
from . import views

urlpatterns = [
    path("add-routes/",views.add_routes_view,name="add_routes_view"),
    path("routes/",views.routes_list_view,name="routes_list_view"),
    path("add-schedule/",views.add_schedule_view,name="add_schedule_view"),
    path("add-schedule-template/",views.add_scheduleTemplate_view),
    path("schedules/",views.schedules_view,name="schedules_view"),
    path("edit-schedules/<int:pk>",views.edit_schedules_view,name="edit_schedules_view"),
    path("delete-schedules/<int:pk>",views.delete_schedules_view,name="delete_schedules_view"),
    path("available-schedules/",views.available_schedules_view,name="available_schedules_view"),
]
