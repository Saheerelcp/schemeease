from rest_framework import serializers

from schemeapp.models import UserProfile



class UserProfileDisplay(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        exclude = ['userid']