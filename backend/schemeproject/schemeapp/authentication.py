from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomJWTAuthentication(JWTAuthentication):
    print("CustomJWTAuthentication triggered")

    def authenticate(self, request):
        print("🔥 CustomJWTAuthentication running...")

        raw_token = request.COOKIES.get('access')
        if raw_token is None:
            print("❌ No access_token in cookies")
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
