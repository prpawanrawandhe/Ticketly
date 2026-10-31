from django.contrib import admin
from .models import Bookings, BookedSeat

# Register your models here.
admin.site.register(Bookings)
admin.site.register(BookedSeat)
