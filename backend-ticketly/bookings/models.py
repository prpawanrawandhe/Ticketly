from django.db import models
from accounts.models import User
from buses.models import Bus
from routes.models import Routes , Schedule

# Create your models here.
class Bookings(models.Model):

    class BookingStatus(models.TextChoices):
        PENDING = "Pending","PENDING",
        CONFIRMED = "Confirmed","CONFIRMED",
        CANCELLED = "Cancelled","CANCELLED",
    

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_fare = models.DecimalField(max_digits=10,decimal_places=2)
    booking_status = models.CharField(max_length=50,choices=BookingStatus.choices,default=BookingStatus.PENDING)
    booked_at = models.DateTimeField(auto_now_add=True)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)


    def __str__(self):
        return f'{self.user}-{self.booking_status}-{self.id}'

class BookedSeat(models.Model):
    booking = models.ForeignKey(Bookings, on_delete=models.CASCADE)
    seat_number = models.CharField(max_length=3)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    passenger_name = models.CharField(max_length=50)
    passenger_age = models.IntegerField()

    class Meta:
        constraints = [models.UniqueConstraint(fields=['schedule','seat_number'],name='unique_seat_per_schedule')]

    def __str__(self):
        return f'{self.booking.user}-{self.seat_number}-{self.id}'

