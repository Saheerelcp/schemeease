from rest_framework import serializers

from schemeapp.models import Application, Bookmark, Districts, EligibilityQuestion, Rating, RequiredDocuments, Scheme, States, SuccessfulApply, UserProfile

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

class ApplySchemeSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='scheme.title', read_only=True)
    department = serializers.CharField(source='scheme.department', read_only=True)
    class Meta:
        model = Application
        fields = ['id', 'title', 'department', 'status', 'applied_at']  # include other relevant fields

class SuccessfulSerializer(serializers.ModelSerializer):
    scheme_name = serializers.CharField(source = 'application.scheme.title',read_only = True)
    status = serializers.CharField(source = 'application.status',read_only = True)
    
    class Meta:
        model = SuccessfulApply
        fields = ['id','status','scheme_name','printout']