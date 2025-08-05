from rest_framework import serializers

from schemeapp.models import Bookmark, Districts, EligibilityQuestion, Rating, RequiredDocuments, Scheme, States, UserProfile

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = Districts
        fields = '__all__'

class StateSerializer(serializers.ModelSerializer):
    # districts = DistrictSerializer(many=True, read_only=True)

    class Meta:
        model = States
        fields = '__all__'

class UserProfileDisplay(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        exclude = ['userid']

class RequiredDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequiredDocuments
        fields = '__all__' # include other fields if present

class SchemeSerializer(serializers.ModelSerializer):
    required_education = serializers.CharField(source='get_required_education_display', read_only=True)
    occupation = serializers.CharField(source = 'get_occupation_display' , read_only = True)
    required_documents = RequiredDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Scheme
        fields = '__all__'

    


class EligibilityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EligibilityQuestion
        fields = ['id','question_text','type','field_name']

class BookmarkedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['is_bookmarked']
    
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['rating']