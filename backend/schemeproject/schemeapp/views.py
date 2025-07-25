# views.py


from django.utils import timezone
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from .models import UpdatedUser
from django.core.mail import EmailMessage


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

            # You can now log the user in or return a token manually
            return Response({'success': 'OTP verified successfully'})
        except UpdatedUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

class SetNewPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')

        try:
            user = UpdatedUser.objects.get(email=email)

            # Optional: Ensure OTP was verified (you can track this using a flag or session)
            if timezone.now() > user.otp_expiry:
                return Response({'error': 'OTP expired. Cannot set new password.'}, status=400)

            user.set_password(new_password)
            user.otp = None
            user.otp_expiry = None
            user.save()

            return Response({'success': 'Password updated successfully'})
        except UpdatedUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)