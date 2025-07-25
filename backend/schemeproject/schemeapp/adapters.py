# schemeapp/adapters.py

from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.utils import user_email
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomAccountAdapter(DefaultAccountAdapter):
    def clean_email(self, email):
        email = email.lower().strip()
        if User.objects.filter(email=email).exists():
            raise ValidationError(_("This email is already registered."))
        return email
