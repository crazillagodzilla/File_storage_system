import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from rest_framework.test import APIRequestFactory
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import LoginView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import json

User = get_user_model()

try:
    print("Checking if migrations have been applied...")
    print(f"User model: {User}")
    
    # Try to simulate a token refresh to see the actual error
    print("\nTesting RefreshToken class...")
    
    # Create a dummy refresh token (this will fail if table doesn't exist)
    try:
        # Create a test user first
        print("Creating test user...")
        user = User.objects.create(username="testuser", email="test@test.com")
        print(f"User created: {user}")
        
        # Now create a refresh token
        print("Creating refresh token...")
        refresh = RefreshToken.for_user(user)
        print("Refresh token created successfully!")
        print(f"Access token: {str(refresh.access_token)[:50]}...")
        print(f"Refresh token: {str(refresh)[:50]}...")
        
    except Exception as e:
        print(f"Error during token creation: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

except Exception as e:
    print(f"Setup error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
