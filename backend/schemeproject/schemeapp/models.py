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
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    benefits = models.TextField()
    # Eligibility Criteria
    min_age = models.PositiveIntegerField(null=True, blank=True)
    max_age = models.PositiveIntegerField(null=True, blank=True)
    eligible_castes = models.CharField(max_length=255, blank=True, choices=[('Any','Any'),('SC,ST','SCST'),('OBC','OBC'),('General','General')] ,default='Any')
    income_limit = models.FloatField(null=True, blank=True, help_text="Annual income upper limit in INR")
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Any', 'Any')], default='Any')
    EDUCATION_CHOICES = [
        ('any', 'Any'),
        ('below_10', 'Below 10th'),
        ('10', '10th'),
        ('12', '12th'),
        ('diploma', 'Diploma'),
        ('ug', 'Undergraduate (UG)'),
        ('pg', 'Postgraduate (PG)'),
        ('phd', 'PhD / Doctorate'),
        ('other', 'Other'),
    ]

    required_education = models.CharField(
        max_length=20,
        choices=EDUCATION_CHOICES,
        default='any',
        blank=True,
        help_text="Select the minimum educational qualification required"
    )
    disability_required = models.CharField(max_length=30,choices=[('Any','Any'),('Yes','Yes'),('None','None')],default='None')
    EMPLOYMENT_CHOICES = [
    ('student', 'Student'),
    ('farmer', 'Farmer'),
    ('teacher', 'Teacher'),
    ('government_employee', 'Government Employee'),
    ('private_employee', 'Private Sector Employee'),
    ('business', 'Business'),
    ('homemaker', 'Homemaker'),
    ('unemployed', 'Unemployed'),
    ('retired', 'Retired'),
    ('other', 'Other'),
    ('any', 'Any'),  # optional fallback
    ]

    occupation = models.CharField(
        max_length=30,
        choices=EMPLOYMENT_CHOICES,
        default='any',
        blank=True,
        help_text="Select your employment or occupation status"
    )

    # Dates & Department
    department = models.CharField(max_length=200,choices=[
            ('Agriculture', 'Agriculture'),
            ('Education', 'Education'),
            ('Healthcare', 'Healthcare'),
            ('Employment', 'Employment'),
            ('Housing', 'Housing'),
            ('Social Welfare', 'Social Welfare'),
        ])
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