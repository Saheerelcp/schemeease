from django.db import models

# models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta

class UpdatedUser(AbstractUser):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)

    def set_otp(self):
        import random
        self.otp = str(random.randint(100000, 999999))
        self.otp_expiry = timezone.now() + timedelta(minutes=5)
        self.save()

class UserProfile(models.Model):
    userid = models.ForeignKey(UpdatedUser,on_delete=models.CASCADE , related_name='profile')
    fullname = models.CharField(max_length=50,blank=True,null=True)
    dob = models.DateField(null=True)
    gender = models.CharField(max_length=10,null=True)
    phone = models.CharField(max_length=10,null=True)
    email = models.EmailField(unique=True,null=True)
    aadhar = models.CharField(max_length=12, null=True)
    state = models.CharField(max_length=40,null=True)
    district = models.CharField(max_length=40,null=True)
    pincode = models.CharField(max_length=6,null=True)
    address = models.TextField(null=True)
    occupation = models.CharField(max_length=40,null=True)
    income = models.BigIntegerField(null=True)
    marital = models.CharField(max_length=20,null=True)
    caste = models.CharField(max_length=10,null=True)
    disability = models.CharField(max_length=10,null=True)
    is_profile_complete = models.BooleanField(default=False)


