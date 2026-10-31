from django.db import models
from accounts.models import OperatorProfile

# Create your models here.
class Bus(models.Model):

    class BusType(models.TextChoices):
        AC_SEATER = "Ac/Seater","AC/SEATER"
        NON_AC_SEATER = "Non-Ac/Seater","NON-AC/SEATER"
        AC_SLEEPER = "Ac/Sleeper","AC/SLEEPER"
        NON_AC_SLEEPER = "Non-Ac/Sleeper","NON-AC/SLEEPER"
        AC_SEATER_SLEEPER = "Ac/Seater/Sleeper","AC/SEATER/SLEEPER"
        NON_AC_SEATER_SLEEPER = "Non-Ac/Seater/Sleeper","NON-AC/SEATER/SLEEPER"


    operator = models.ForeignKey(OperatorProfile,on_delete=models.CASCADE)
    bus_number = models.CharField( max_length=12)
    bus_name = models.CharField( max_length=50)
    bus_type = models.CharField(max_length=30,choices=BusType.choices,default=BusType.NON_AC_SEATER)
    seater = models.CharField(max_length=3)
    sleeper = models.CharField(max_length=3)

    def __str__(self):
        return f"{self.bus_name}-{self.id}"