from django.db import models
from bookings.models import Bookings
from accounts.models import User

# Create your models here.

class Payment(models.Model):

    class PaymentStatus(models.TextChoices):
        PENDING = "PENDING","Pending"
        SUCCESS = "SUCCESS","Success"
        FAILED = "FAILED","Failed"


    booking = models.ForeignKey(Bookings, on_delete=models.CASCADE)
    amount = models.DecimalField( max_digits=8, decimal_places=2)
    status = models.CharField(max_length=10,choices=PaymentStatus.choices,default=PaymentStatus.PENDING)
    transaction_id = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.booking.user}-{self.status}'

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2,default=1000.00)

    def __str__(self):
        return f'{self.user}-{self.balance}'
