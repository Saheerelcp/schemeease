from django.urls import path
from schemeapp.views import SendOTPView,VerifyOTPView,SetNewPasswordView,TotalUserCount,UserProfileView,SchemeSpecific,SchemeList,ViewScheme,CheckEligibility,Bookmarksetup,RatingSetup,StateCall,DistirctCall


urlpatterns = [
    path('request-otp/', SendOTPView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
    path('set-new-password/', SetNewPasswordView.as_view(), name='set_new_password'),
    path('total-user/',TotalUserCount.as_view()),
    path('user-profile/',UserProfileView.as_view()),
    path('scheme-counts/',SchemeSpecific.as_view()),
    path('schemes/',SchemeList.as_view()),
    path('scheme-view/',ViewScheme.as_view()),
    path('check-eligibility/',CheckEligibility.as_view()),
    path('bookmarked/',Bookmarksetup.as_view()),
    path('rating/',RatingSetup.as_view()),
    path('states/',StateCall.as_view()),
    path('districts/',DistirctCall.as_view())
]