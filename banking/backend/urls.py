"""
URLs for the banking app with additional diagnostic endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.views import APIView
from rest_framework.response import Response
from .views import AccountViewSet, TransactionViewSet, BusinessViewSet, get_all_users_and_accounts, UserProfileView, UserUpdateView
from .auth_views import LoginView, UserAccountsView
from .test_view import TestView
import logging
import traceback
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.exceptions import ValidationError

# Highly simplified registration view to test routing
class SimpleRegisterView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Simple registration view GET works!"})
    
    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get("username")
            password = request.data.get("password")
            email = request.data.get("email")
            first_name = request.data.get("first_name")
            last_name = request.data.get("last_name")

            if not username or not password or not email:
                raise ValidationError("Username, password, and email are required.")

            if not first_name or not last_name:
                raise ValidationError("First name and last name are required.")

            if User.objects.filter(username=username).exists():
                raise ValidationError("Username already exists.")

            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name
            )

            return Response({"message": "User registered successfully.", "user_id": user.id}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'businesses', BusinessViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Test routing with very simple views
    path('simple-register/', SimpleRegisterView.as_view(), name='simple-registration'),
    path('test-view/', TestView.as_view(), name='banking-test-view'),
]

# TASK1: Add swagger documentation
from drf_yasg.views import get_schema_view
from drf_yasg import openapi 
from rest_framework.permissions import AllowAny 

schema_view = get_schema_view(
   openapi.Info(
      title="Banking API",
      default_version='v1',
      description="API documentation for Extra Credit Union",
   ),
   public=True,
   permission_classes=(AllowAny,),
)

urlpatterns += [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
# ENDTASK1

# These insecure endpoints are kept from the original file
from django.http import JsonResponse
import subprocess
from rest_framework.response import Response


urlpatterns += [
    # Additional diagnostic endpoint
    path('url-test/', lambda request: JsonResponse({"message": "Banking URLs are being loaded correctly"})),
    path('admin/all_users_and_accounts/', get_all_users_and_accounts, name='all-users-and-accounts'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('user/update/', UserUpdateView.as_view(), name='user-update'),
]
