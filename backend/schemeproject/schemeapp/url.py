from django.urls import path
from schemeapp.views import SendOTPView,VerifyOTPView,SetNewPasswordView

urlpatterns = [
    path('request-otp/', SendOTPView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
    path('set-new-password/', SetNewPasswordView.as_view(), name='set_new_password'),

]