
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
# from django.core.mail import send_mail
from rest_framework import status

from schemeapp.serializers import UserProfileDisplay
from .models import UpdatedUser, UserProfile
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
        try:
            profilecompletion = UserProfile.objects.get(userid = user)
            iscompleted = profilecompletion.is_profile_complete
        except UserProfile.DoesNotExist:
            pass
        return Response({'usertotal':usercount,'profilecompletion':iscompleted})
    
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
                    'address': formdata.get('address'),
                    'occupation': formdata.get('occupation'),
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