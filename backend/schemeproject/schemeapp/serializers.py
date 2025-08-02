from rest_framework import serializers

from schemeapp.models import EligibilityQuestion, Scheme, UserProfile



class UserProfileDisplay(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        exclude = ['userid']

class SchemeSerializer(serializers.ModelSerializer):
    required_education = serializers.CharField(source='get_required_education_display', read_only=True)

    class Meta:
        model = Scheme
        fields = '__all__'

    


class EligibilityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EligibilityQuestion
        fields = ['id','question_text','type','field_name']