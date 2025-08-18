from django.db import models
from django.core.mail import EmailMessage
# models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
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
    eligible_castes = models.CharField(max_length=255, blank=True, choices=[('Any','Any'),('SC,ST','SC,ST'),('OBC','OBC'),('General','General'),('EWS','EWS')] ,default='Any')
    income_limit = models.PositiveBigIntegerField(null=True, blank=True, help_text="Annual income upper limit in INR")
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
    disability_required = models.CharField(max_length=30,choices=[('Any','Any'),('Yes','Yes'),('None','None')],default='Any')
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
    attachment = models.FileField(upload_to='scheme_docs/', blank=True)

    def __str__(self):
        return self.title


class EligibilityQuestion(models.Model):
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    expected_answer = models.CharField(max_length=20,choices=[('Yes','Yes'),('No','No')])  # e.g. "yes", "no"
    field_name = models.CharField(max_length=50)  # optional, for matching answers
    type = models.CharField(max_length=20, choices=[("boolean", "Yes/No")])
    
    def __str__(self):
        return f"{self.scheme.title} - {self.question_text}"

class Bookmark(models.Model):
    user = models.ForeignKey(UpdatedUser ,on_delete=models.CASCADE, related_name='bookmarked')
    scheme = models.ForeignKey(Scheme ,on_delete=models.CASCADE,related_name='scheme')
    is_bookmarked = models.BooleanField(default=False)
    
class Rating(models.Model):
    user = models.ForeignKey(UpdatedUser , on_delete=models.CASCADE,related_name='user')
    scheme = models.ForeignKey(Scheme,models.CASCADE,related_name='ratedscheme')
    rating = models.IntegerField()

class States(models.Model):
    name = models.CharField(max_length=100)

class Districts(models.Model):
    state = models.ForeignKey(States,on_delete=models.CASCADE)
    district = models.CharField(max_length=100)

class RequiredDocuments(models.Model):
    scheme = models.ForeignKey(Scheme,on_delete=models.CASCADE,related_name='required_documents')
    name = models.CharField(max_length=100)

class Application(models.Model):
    user = models.ForeignKey(UpdatedUser, on_delete=models.CASCADE)
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE)
    applied_at = models.DateTimeField(auto_now_add=True)
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Under Review', 'Under Review'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    # def save(self, *args, **kwargs):
    #     if self.uploaded_documents.exists():
    #         if all(doc.is_approved for doc in self.uploaded_documents.all()):
    #             self.status = 'Approved'
    #         elif any(doc.is_rejected for doc in self.uploaded_documents.all()):
    #             self.status = 'Rejected'
    #         elif any(doc.is_approved or doc.is_rejected for doc in self.uploaded_documents.all()):
    #             self.status = 'Under Review'
    #         else:
    #             self.status = 'Pending'
    #     else:
    #         self.status = 'Pending'
    #     super().save(*args, **kwargs)
    def save(self, *args, **kwargs):
    # Store the old status before changes
        old_status = None
        if self.pk:  # Object exists already
            old_status = type(self).objects.get(pk=self.pk).status

        # --- STATUS UPDATE LOGIC ---
            if self.uploaded_documents.exists():
                if all(doc.is_approved for doc in self.uploaded_documents.all()):
                    self.status = 'Approved'
                elif any(doc.is_rejected for doc in self.uploaded_documents.all()):
                    self.status = 'Rejected'
                elif any(doc.is_approved or doc.is_rejected for doc in self.uploaded_documents.all()):
                    self.status = 'Under Review'
                else:
                    self.status = 'Pending'
            else:
                self.status = 'Pending'
        else:
            self.status = 'Pending'

        # Save first so status is committed before sending notifications
        super().save(*args, **kwargs)

        # --- NOTIFICATION LOGIC ---
        if self.pk and old_status != self.status:
            if self.status == 'Pending':
                email = self.user.email
                email_message = EmailMessage(
                    subject='Application Status',
                    body=f'Your application for {self.scheme.title} is pending.Wait for minimum 2 days to verify our team .',
                    from_email='giveandtakestartup@gmail.com',
                    to=[email],
            
                )
                email_message.send()
                Notifications.objects.create(
                    user=self.user,
                    message=f"Your application for {self.scheme.title} is pending "
                )
            elif self.status == 'Under Review' and any(doc.is_approved or doc.is_rejected for doc in self.uploaded_documents.all()):
                email = self.user.email
                email_message = EmailMessage(
                    subject='Application Status',
                    body=f'Your application for {self.scheme.title} is under review .',
                    from_email='giveandtakestartup@gmail.com',
                    to=[email],
            
                )
                email_message.send()
                Notifications.objects.create(
                    user=self.user,
                    message=f"Your application for {self.scheme.title} is under review."
                )
            elif self.status == 'Approved':
                email = self.user.email
                email_message = EmailMessage(
                    subject='Application Status',
                    body=f'Congratulations! Your application for {self.scheme.title} is verified .You can download printout of application from schemeEase',
                    from_email='giveandtakestartup@gmail.com',
                    to=[email],
            
                )
                email_message.send()
                Notifications.objects.create(
                    user=self.user,
                    message=f"Congratulations! Your application for {self.scheme.title} is approved."
                )
            elif self.status == 'Rejected':
                email = self.user.email
                email_message = EmailMessage(
                    subject='Application Status',
                    body=f'Unfortunately, your application for {self.scheme.title} is rejected .Check out the website for the reasons .Please re-upload rejected documents for the successfull application .',
                    from_email='giveandtakestartup@gmail.com',
                    to=[email],
            
                )
                email_message.send()
                Notifications.objects.create(
                    user=self.user,
                    message=f"Unfortunately, your application for {self.scheme.title} is rejected."
                )

    
    def __str__(self):
        return f"{self.user} - {self.scheme.title}"
    
class UploadedDocument(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='uploaded_documents')
    required_document = models.ForeignKey(RequiredDocuments, on_delete=models.CASCADE,related_name='required_document')
    file = models.FileField(upload_to='uploads/documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_rejected = models.BooleanField(default=False)
    rejection_reason = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.application.save()
    def clean(self):
        if self.is_approved and self.is_rejected:
            raise ValidationError("A document cannot be both approved and rejected.")
        if self.is_rejected and not self.rejection_reason:
            raise ValidationError("Please provide a rejection reason when rejecting a document.")
        if self.is_approved and self.rejection_reason:
            raise ValidationError("You can't add rejection reason for approved applications")



class SuccessfulApply(models.Model):
    application = models.ForeignKey(Application,on_delete=models.CASCADE)
    printout = models.FileField(upload_to='successful/printouts/')
    added_at = models.DateTimeField(auto_now_add=True)

class Notifications(models.Model):
    user = models.ForeignKey(UpdatedUser,on_delete=models.CASCADE)
    message = models.TextField()
    is_readed = models.BooleanField(default=False)
    added_at = models.DateTimeField(auto_now_add=True)