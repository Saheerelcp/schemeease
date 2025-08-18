
from datetime import date
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
# from django.core.mail import send_mail
from datetime import timedelta
from django.utils.timezone import now
from rest_framework.permissions import AllowAny

from django.db.models import Q
from django.db.models import Avg
from rest_framework import status
from django.db.models import Count
from schemeapp.serializers import   ApplySchemeSerializer, BookmarkViewSerializer, BookmarkedSerializer, DistrictSerializer, EligibilityQuestionSerializer, FeedbackSerializer, NotificationSerializer, SchemeSerializer, StateSerializer, SuccessfulSerializer, UploadDocumentSerializer, UserProfileDisplay
from .models import Application, Bookmark, Districts, EligibilityQuestion, Notifications, Rating, RequiredDocuments, Scheme, States, SuccessfulApply, UpdatedUser, UploadedDocument, UserProfile
from django.core.mail import EmailMessage
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser


class SendOTPView(APIView):
    permission_classes = [AllowAny]  # Important

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
    permission_classes = [AllowAny]  # Important
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
    permission_classes = [AllowAny]  
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
        applicationcount = Application.objects.count()
        try:
            profilecompletion = UserProfile.objects.get(userid = user)
            iscompleted = profilecompletion.is_profile_complete
        except UserProfile.DoesNotExist:
            pass
        # Bookmark expiry notification check
        from .models import Bookmark  # Import here to avoid circular imports
        bookmarks = Bookmark.objects.filter(user=user)

        if bookmarks.exists():
            today = now().date()
            expiry_date_threshold = today + timedelta(days=2)  # 2 days before expiry
            expiring_bookmarks = bookmarks.filter(scheme__end_date__lte=expiry_date_threshold)

            for bookmark in expiring_bookmarks:
                # Create a notification (no duplicates for the same scheme)
                Notifications.objects.get_or_create(
                    user=user,
                    message=f"The scheme '{bookmark.scheme.title}' is expiring soon on {bookmark.scheme.end_date}."
                )
        
        return Response({'usertotal':usercount,'profilecompletion':iscompleted,'totalscheme':schemacount,'applicationcount':applicationcount})
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
            serializer = BookmarkedSerializer(data=request.data)
            if serializer.is_valid():
                is_bookmarked = serializer.validated_data.get('is_bookmarked', True)
                bookmarkId = serializer.validated_data.get('bookmarkId')
                if is_bookmarked is False:
                    try:
                        Bookmark.objects.get(id=bookmarkId).delete()
                        return Response({'msg':'deleted'})
                    except Bookmark.DoesNotExist:
                        return Response({'msg':'bookmark does not exist'})
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
            print('bookmarkId',bookmark.id)
            if bookmark:
                return Response({'is_bookmarked':bookmark.is_bookmarked,'bookmarkId':bookmark.id})
            else:
                return Response({'is_bookmarked':False,'bookmarkId':bookmark.id})
            
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
    
class ApplyScheme(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        user = request.user
        scheme_id = request.GET.get('schemeId')
        scheme = Scheme.objects.get(id = scheme_id)

        if Application.objects.filter(user=user, scheme=scheme).exists():
            return Response({'repeat':"You have already applied for this scheme."})

        required_docs = RequiredDocuments.objects.filter(scheme=scheme)
        print(user,scheme)
        application = Application.objects.create(
            user=user,
            scheme=scheme,
            status='Pending'
        )
        print("All received files:", request.FILES)

        # Save uploaded documents
        for required_doc in required_docs:
            file = request.FILES.get(f"documents[{required_doc.id}]")
            print('files', file)
            if file:
                UploadedDocument.objects.create(
                application=application,
                required_document=required_doc,
                file=file
                )
        email_message = EmailMessage(
            subject='Application Recieved',
            body='Thank you for submitting your application. You can check your application status on Apply section in website.',
            from_email='giveandtakestartup@gmail.com',
            to=[user.email],
            
            )
        email_message.send()

        return Response(
            "Application submitted successfully!",status=status.HTTP_201_CREATED)
    
class ViewAppliedScheme(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        try:
            applicatonlist = Application.objects.filter(user = user)
            applications_serializer = ApplySchemeSerializer(applicatonlist,many=True)
            return Response(applications_serializer.data)
        except UpdatedUser.DoesNotExist:
            return Response('User is not valid')

class ViewResultApply(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        applicationId = request.GET.get('applicationId')
        user = request.user

        try:
            application = Application.objects.get(id = applicationId)
            if application.status == 'Approved':
                success = SuccessfulApply.objects.get(application = application)
                application_serializer = SuccessfulSerializer(success)
                

                return Response({'status':application.status,'result':application_serializer.data})
            elif application.status == 'Rejected':
                rejected_documents=[]
                rejection = UploadedDocument.objects.filter(application = application)
                
                for i in rejection:
                    if i.is_rejected:
                        rejected_documents.append(i)
                rejection_serializer = UploadDocumentSerializer(rejected_documents,many=True)
                
                return Response({'status':application.status,'result':rejection_serializer.data})
            elif application.status =='Pending' or application.status =='Under Review':
                review_serializer = ApplySchemeSerializer(application)
               
                return Response({'status':application.status,'result':review_serializer.data})
            else:
                return Response('something went wrong')
        except Application.DoesNotExist:
            return Response('Something went wrong')

class ReuploadFile(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request):
        documentId = request.GET.get('documentId')  
        try:
            doc = UploadedDocument.objects.get(id=documentId)
            file = request.FILES.get('file')
            if file:
                doc.file = file
                doc.is_approved = False
                doc.is_rejected = False
                doc.rejection_reason = ''
                doc.save()
                return Response({'message':'Document reuploaded successfully'})
            else:
                return Response({'message':'No file is returned'})
        except UploadedDocument.DoesNotExist:
            return Response({'message':'No document exist'})
        
class BookmarkView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        
        bookmarked = Bookmark.objects.filter(user = user).select_related('scheme')
        search = request.GET.get("search")
        if search:
            bookmarked = bookmarked.filter(scheme__title__icontains=search)
        sort_order = request.GET.get('sort')
        if sort_order == 'Z-A':
            bookmarked = bookmarked.order_by('-scheme__title')
        else:
            bookmarked = bookmarked.order_by('scheme__title')
        bookmark_serializer = BookmarkViewSerializer(bookmarked,many=True)
        return Response(bookmark_serializer.data)

class RecommendedView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        scheme = Scheme.objects.all()
        try:
            profile = UserProfile.objects.get(userid=user)
            scheme_list = []
            search = request.GET.get('search')
            sort_order = request.GET.get('sort')
            dob = profile.dob
            today = date.today()
            age = today.year - dob.year - ((today.month,today.day) <(dob.month , dob.day))
            for i in scheme:
                basic_eligible = True
                if i.min_age and age < i.min_age :
                    basic_eligible = False
                if i.max_age and age > i.max_age:
                    basic_eligible = False
                if i.gender != 'Any' and i.gender != profile.gender:
                    basic_eligible = False
                if i.disability_required != 'Any' and i.disability_required != profile.disability:
                    basic_eligible = False
                if i.required_education != 'any' and i.required_education != profile.study:
                    basic_eligible = False
                if i.occupation != 'any' and (i.occupation).lower() != (profile.occupation).lower():
                    basic_eligible = False
                if i.eligible_castes :
                    allowed_castes = [c.strip().lower() for c in i.eligible_castes.split(',')]
                    if profile.caste.lower()  not in allowed_castes:
                        basic_eligible = False
                if profile.income >= i.income_limit:
                    basic_eligible = False
                if basic_eligible:
                    if not search or search.lower() in i.title.lower():
                        scheme_list.append(i)
                    
            
            if sort_order:
                if sort_order == 'Z-A':
                    scheme_list = sorted(scheme_list, key=lambda s: s.title, reverse=True)
                else:
                    scheme_list = sorted(scheme_list, key=lambda s:s.title)
            
            scheme_serializer = SchemeSerializer(scheme_list,many=True)
            return Response(scheme_serializer.data)
        except UserProfile.DoesNotExist:
            return Response('Userprofile does not exist')
    
class NotificationDisplay(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        try:
            userNotification = Notifications.objects.filter(user = user).order_by('-added_at')
            notification_serializer = NotificationSerializer(userNotification,many=True)
            return Response(notification_serializer.data)
        except UpdatedUser.DoesNotExist:
            return Response('user is not logged')
    def patch(self,request):
        user = request.user
        notificationId = request.GET.get('notificationId')
        notification=Notifications.objects.get(id=notificationId)
        is_readed_true = request.data.get('is_readed')
        notification.is_readed = is_readed_true
        notification.save()
        return Response('readed ')
    def delete(self,request):
        notificationId = request.GET.get('notificationId')
        Notifications.objects.get(id=notificationId).delete()
        return Response('deleted')

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Only logged-in users can log out

    def post(self, request):
        response = Response({"message": "Logged out successfully"})
        
        response.delete_cookie('access_token')  
        response.delete_cookie('refresh_token')
        return response