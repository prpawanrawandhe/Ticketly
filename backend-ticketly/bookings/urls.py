from django.urls import path
from . import views

urlpatterns = [
    path("create-booking/<int:id>",views.create_booking_view,name="create_booking_view"),
    path("available-seats/<int:id>",views.available_seats_view,name="available_seats_view"),
    path("bookings/",views.bookings_view,name="bookings_view"),
    path("booking-details/<int:id>",views.booking_detail_view,name="booking_detail_view"),
    path("cancel-booking/<int:id>",views.cancel_booking_view,name="cancel_booking_view"),
    path("operator/bookings/",views.operator_bookings_view,name="operator_bookings_view"),
    path("operator/schedules/<int:schedule_id>/bookings/",views.operator_schedule_bookings_view),
    path('operator/dashboard/', views.operator_dashboard_view),
]
