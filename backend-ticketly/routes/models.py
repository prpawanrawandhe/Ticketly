from django.db import models
from buses.models import Bus

# Create your models here.
class Routes(models.Model):
    source = models.CharField(max_length=50)
    destination = models.CharField(max_length=50)
    distance_km = models.IntegerField()

    def __str__(self):
        return f'{self.source}-{self.destination}-{self.id}'

class Schedule(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    route = models.ForeignKey(Routes,on_delete=models.PROTECT)
    arrival_time = models.DateTimeField()
    departure_time = models.DateTimeField()
    estimated_time = models.DurationField()
    seater_price = models.DecimalField(max_digits=8, decimal_places=2)
    sleeper_price = models.DecimalField( max_digits=8, decimal_places=2)


    def __str__(self):
        return f'{self.bus}-{self.route}-{self.id}'

class ScheduleTemplate(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    route = models.ForeignKey(Routes,on_delete=models.PROTECT)
    arrival_time = models.DateTimeField()
    departure_time = models.DateTimeField()
    estimated_time = models.DurationField()
    seater_price = models.DecimalField(max_digits=8, decimal_places=2)
    sleeper_price = models.DecimalField( max_digits=8, decimal_places=2)


    def __str__(self):
        return f'{self.bus}-{self.route}-{self.id}'