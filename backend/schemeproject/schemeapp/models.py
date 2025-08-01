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
    rural = models.CharField(max_length=15,null=True)
    study = models.CharField(max_length=20,null=True)

class Scheme(models.Model):
    # Basic Info
    
    title = models.CharField(max_length=255,null=True)
    description = models.TextField()
    benefits = models.TextField()
    # Eligibility Criteria
    min_age = models.PositiveIntegerField(null=True, blank=True)
    max_age = models.PositiveIntegerField(null=True, blank=True)
    eligible_castes = models.CharField(max_length=255, blank=True, help_text="Comma-separated values: SC,ST,OBC,General")
    income_limit = models.FloatField(null=True, blank=True, help_text="Annual income upper limit in INR")
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Any', 'Any')], default='Any')
    required_education = models.CharField(max_length=255, blank=True, help_text="e.g., 10th Pass, Graduate, ITI")
    disability_required = models.BooleanField(default=False)
    employment_status = models.CharField(
        max_length=20,
        choices=[('Employed', 'Employed'), ('Unemployed', 'Unemployed'),('Student', 'Student'), ('Any', 'Any')],
        default='Any'
    )

    # Dates & Department
    department = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()

    # Documents
    required_documents = models.TextField(blank=True, help_text="List required documents, separated by commas")
    attachment = models.FileField(upload_to='scheme_docs/', blank=True)

    def __str__(self):
        return self.title


class EligibilityQuestion(models.Model):
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    expected_answer = models.CharField(max_length=20)  # e.g. "yes", "no"
    field_name = models.CharField(max_length=50)  # optional, for matching answers
    type = models.CharField(max_length=20, choices=[("boolean", "Yes/No"), ("text", "Text"), ("number", "Number")])
    
    def __str__(self):
        return f"{self.scheme.title} - {self.question_text}"