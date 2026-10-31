from django.contrib import admin
from .models import Routes, Schedule, ScheduleTemplate

# Register your models here.
admin.site.register(Routes)
admin.site.register(Schedule)
admin.site.register(ScheduleTemplate)
