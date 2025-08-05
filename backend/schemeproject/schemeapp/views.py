
from datetime import date
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
# from django.core.mail import send_mail
from django.db.models import Q
from django.db.models import Avg
from rest_framework import status
from django.db.models import Count
from schemeapp.serializers import  BookmarkedSerializer, DistrictSerializer, EligibilityQuestionSerializer, FeedbackSerializer, SchemeSerializer, StateSerializer, UserProfileDisplay
from .models import Bookmark, Districts, EligibilityQuestion, Rating, RequiredDocuments, Scheme, States, UpdatedUser, UserProfile
from django.core.mail import EmailMessage
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class SendOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            
            user = UpdatedUser.objects.get(email=email)
            user.set_otp()
            
            email_message = EmailMessage(
            subject='Your OTP Code',
            body=f'Your login OTP is {user.otp}. It will expire in 5 minutes.',
            from_email='giveandtakestartup@gmail.com',
            to=[email],
            
            )
            email_message.send()

            return Response({'detail': 'OTP sent successfully'})
    
        except UpdatedUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

# views.py

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            user = UpdatedUser.objects.get(email=email)

            if user.otp != otp:
                return Response({'error': 'Invalid OTP'}, status=400)

            if timezone.now() > user.otp_expiry:
                return Response({'error': 'OTP expired'}, status=400)

            return Response({'success': 'OTP verified successfully'})
        except UpdatedUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

class SetNewPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')

        try:
            user = UpdatedUser.objects.get(email=email)
            if timezone.now() > user.otp_expiry:
                return Response({'error': 'OTP expired. Cannot set new password.'}, status=400)
            try:
                validate_password(new_password, user=user)
            except ValidationError as e:
                return Response({'error':e.messages} , status=400)
            user.set_password(new_password)
            user.otp = None
            user.otp_expiry = None
            user.save()

            return Response({'success': 'Password updated successfully'})
        except UpdatedUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

#total users calling coming 
class TotalUserCount(APIView):
    permission_classes = [IsAuthenticated]  # Ensures only logged-in users can access

    def get(self,request):
        usercount = UpdatedUser.objects.count()
        user = request.user
        iscompleted=False
        schemacount = Scheme.objects.count()
        try:
            profilecompletion = UserProfile.objects.get(userid = user)
            iscompleted = profilecompletion.is_profile_complete
        except UserProfile.DoesNotExist:
            pass
        return Response({'usertotal':usercount,'profilecompletion':iscompleted,'totalscheme':schemacount})
class StateCall(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            state = States.objects.all()
            serializer = StateSerializer(state,many=True)
            return Response(serializer.data)
        except Exception:
            return Response('something went wrong')

class DistirctCall(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        state_id = request.GET.get('stateId')
        if state_id:
            districts = Districts.objects.filter(state_id=state_id)
        else:
            districts = Districts.objects.all()
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        user  = request.user
        formdata = request.data.get('formData')
        if not formdata:
            return Response({'error': 'Form data is missing'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile, created = UserProfile.objects.update_or_create(
                userid=user,
                defaults={
                    'fullname': formdata.get('fullname'),
                    'dob': formdata.get('dob'),
                    'gender': formdata.get('gender'),
                    'phone': formdata.get('phone'),
                    'email': formdata.get('email'),
                    'aadhar': formdata.get('aadhar'),
                    'state': request.data.get('selectedState'),
                    'district': request.data.get('selectedDistrict'),
                    'pincode': formdata.get('pincode'),
                    'rural' : formdata.get('rural'),
                    'address': formdata.get('address'),
                    'occupation': formdata.get('occupation'),
                    'study' : formdata.get('study'),
                    'income': formdata.get('income'),
                    'marital': formdata.get('marital'),
                    'caste': formdata.get('caste'),
                    'disability': formdata.get('disability'),
                }
            )
            UserProfile.objects.filter(userid=user).update(is_profile_complete = True)
            if created :
                return Response('Profile Created Successfully!',status=status.HTTP_201_CREATED)
            else:
                return Response('Profile Updated Successfully!',status=status.HTTP_200_OK)
        except Exception as e:
            return Response('Something went wrong')
    def get(self,request):
        try:
            profile = UserProfile.objects.get(userid=request.user)
            state = profile.state
            district = profile.district
            isCompleted = profile.is_profile_complete
            serializer = UserProfileDisplay(profile)
            return Response({
                'profile': serializer.data,
                'state': state,
                'district': district,
                'profilecomplete':isCompleted
            })
        except Exception as e:
            return Response('No such content')
    
    def delete(self,request):
        print('hello')
        user=request.user
        try:
            profile = UserProfile.objects.get(userid = user)
            profile.delete()
            return Response('Profile deleted Sucessfully!')
        except Exception:
            return Response('There is no user profile to delete!')
        
class SchemeSpecific(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        counts = Scheme.objects.values('department').annotate(count = Count('id')).order_by('department')
        return Response(list(counts))

class SchemeList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        department = request.GET.get('department')
        queryset = Scheme.objects.filter(department = department)
        #Search then how is it okay
        search = request.GET.get('search')
        if search:
            queryset = queryset.filter(title__icontains=search)
        
        #filter
        gender = request.GET.get('gender')
        disability = request.GET.get('disability_required')
        employment = request.GET.get('occupation')
        eligible_castes = request.GET.get('eligible_castes')
        income_limit = request.GET.get('income_limit')
        required_education = request.GET.get('required_education')

        if gender:
            queryset = queryset.filter(gender__iexact=gender)
        if disability:
            queryset = queryset.filter(disability_required__iexact=disability)
        if employment:
            queryset = queryset.filter(occupation__iexact=employment)
        
        if eligible_castes == "SCST":
            queryset = queryset.filter( 
                Q(eligible_castes__iregex=r'\bSC\b') | Q(eligible_castes__iregex=r'\bST\b')
                )
        elif eligible_castes:
            queryset = queryset.filter(eligible_castes__iexact=eligible_castes)
        if income_limit:
            queryset = queryset.filter(income_limit__gte=income_limit)
            print('querset',list(queryset))
        if required_education:
            queryset = queryset.filter(required_education__iexact = required_education) 

        #sort
        sort_order = request.GET.get('sort')
        if sort_order == 'Z-A':
            queryset = queryset.order_by('-title')
        else:
            queryset = queryset.order_by('title')
        
        serializer = SchemeSerializer(queryset, many=True)
        return Response(serializer.data)
        
class ViewScheme(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        schemeId = request.GET.get('schemeId')
        try:
            scheme = Scheme.objects.get(id = schemeId)
            serializer = SchemeSerializer(scheme)
            return Response(serializer.data)
        except Exception:
            return Response('something went wrong')
        
class CheckEligibility(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        schemeId = request.GET.get('schemeId')
        try:
            scheme = Scheme.objects.get(id = schemeId)
        except Scheme.DoesNotExist:
            return Response({'error':'scheme not found'})
        
        user = request.user
        profile = UserProfile.objects.get(userid = user)
        basic_eligible = True
        reasons = []
        dob = profile.dob
        today = date.today()
        age = today.year - dob.year - ((today.month,today.day) <(dob.month , dob.day))
        if scheme.min_age and age < scheme.min_age:
            basic_eligible = False
            reasons.append('Age is below minimum required.')
        if scheme.max_age and age > scheme.max_age:
            basic_eligible = False
            reasons.append('Age exceeds maximum limit.')
        if scheme.gender != "Any" and profile.gender != scheme.gender:
            basic_eligible = False
            reasons.append("Gender mismatch.")
        if scheme.disability_required !="Any" and  profile.disability != scheme.disability_required:
            print('schemedisability',scheme.disability_required)
            basic_eligible = False
            reasons.append("Disability required.")
        if scheme.required_education !="any" and profile.study != scheme.required_education:
            basic_eligible = False
            reasons.append("Required education mismatch.")
        if scheme.occupation != "any" and (profile.occupation).lower() != (scheme.occupation).lower():
            basic_eligible = False
            reasons.append("Occupation mismatch.")
        if scheme.eligible_castes:
            allowed_castes = [c.strip().lower() for c in scheme.eligible_castes.split(',')]
            if profile.caste.lower() not in allowed_castes:
                basic_eligible = False
                reasons.append("Caste not eligible.")
        if scheme.income_limit and profile.income > scheme.income_limit:
            basic_eligible = False
            reasons.append("Income exceeds limit.")
        
        questions = EligibilityQuestion.objects.filter(scheme=schemeId)
        question_serializer = EligibilityQuestionSerializer(questions,many=True)
        print(basic_eligible,'coolieeeeeeeeeeeeee')
        return Response({
            'basic_eligibility' : basic_eligible,
            'reasons' :reasons,
            'questions':question_serializer.data
        })
    
    def post(self,request):
        schemeId = request.GET.get('schemeId')
        questions = EligibilityQuestion.objects.filter(scheme = schemeId)
        user_answers = request.data.get('answers',{})

        wrong_answers = []
        for i in questions:
            answer = user_answers.get(i.field_name or str(i.id))
            if answer is None:
                wrong_answers.append({
                    'questions':i.question_text,
                    'error':'no answer provided'
                })
                continue
            if str(answer).strip().lower() != str(i.expected_answer).strip().lower():
                wrong_answers.append({
                    "question": i.question_text,
                    "expected": i.expected_answer,
                    "got": answer
                })
        passed = len(wrong_answers) == 0
        return Response({
            'all_answers_correct' : passed,
            'wrong_answers':wrong_answers
        })
        
class Bookmarksetup(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user
        schemeId = request.GET.get('schemeId')
        try:
            scheme = Scheme.objects.get(id = schemeId)
            print(user,'helii')
            serializer = BookmarkedSerializer(data=request.data)
            print('kuttistory')
            if serializer.is_valid():
                is_bookmarked = serializer.validated_data.get('is_bookmarked', True)
                Bookmark.objects.update_or_create(user=user,scheme=scheme,defaults={'is_bookmarked': is_bookmarked})
                return Response({'msg':'Bookmarked'})
            print(serializer.errors)
            return Response(serializer.errors)
        except Exception:
            return Response('Something went wrong')
    def get(self,request):
        user = request.user
        scheme = request.GET.get("schemeId")
        try:
            bookmark = Bookmark.objects.get(user=user,scheme = scheme)
            if bookmark:
                return Response({'is_bookmarked':bookmark.is_bookmarked})
            else:
                return Response({'is_bookmarked':False})
            
        except Exception:
            return Response('something went wrong')
        
class RatingSetup(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user
        schemeId = request.GET.get('schemeId')
        try:
            
            serializer = FeedbackSerializer(data=request.data)
            scheme= Scheme.objects.get(id = schemeId)
            print('marcoooo',scheme)

            if serializer.is_valid():
                print('ratingssssss')
                rating = serializer.validated_data.get('rating')
                
                Rating.objects.update_or_create(
                    user=user,
                    scheme = scheme,
                    defaults={'rating':rating}
                )
                return Response({'msg':'rating added successfully'})
            return Response('something went wrong')
        except Exception:
            return Response('scheme does not exist')
    
    def get(self,request):
        user = request.user
        schemeId = request.GET.get('schemeId')
        try:
            scheme = Scheme.objects.get(id = schemeId)
            average = Rating.objects.filter(scheme=scheme).aggregate(Avg('rating'))['rating__avg'] or 0
            try:
                userrating_obj = Rating.objects.get(scheme=scheme, user=user)
                userrating = userrating_obj.rating
            except Rating.DoesNotExist:
                userrating = None    
            totalrating = Rating.objects.filter(scheme=scheme).count() 
            return Response({
                'average': round(average or 0),
                'userrating': userrating,
                'totalrating': totalrating
            })
        except Exception:
            return Response('something went wrong')       
    

