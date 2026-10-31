from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN","Admin"
        OPERATOR = "OPERATOR", "Bus Operator"
        CUSTOMER = "CUSTOMER","Customer"

    role = models.CharField(max_length=10,choices=Role.choices,default=Role.CUSTOMER)

    def __str__(self):
        return self.username

class OperatorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name="operator_profile")
    company_name = models.CharField(max_length=50)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.company_name