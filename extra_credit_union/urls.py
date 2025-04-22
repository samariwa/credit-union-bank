# extra_credit_union/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from banking.backend.views import TransactionViewSet, AccountViewSet, BusinessViewSet
from banking.backend.auth_views import LoginView, UserAccountsView
from banking.backend.template_views import register_api

# DRF Router registration (handles /transactions/, /accounts/, /businesses/)
router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transactions')
router.register(r'accounts', AccountViewSet, basename='accounts')
router.register(r'businesses', BusinessViewSet, basename='businesses')

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Custom auth endpoints
    path('api/auth/login/', LoginView.as_view(), name='auth-login'),
    path('api/auth/register/', register_api, name='auth-register'),
    path('api/auth/user/', UserAccountsView.as_view(), name='auth-user'),
    path('api/auth/logout/', lambda request: Response({'detail': 'Successfully logged out.'}), name='auth-logout'),

    # Aliases (for frontend compatibility)
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/register/', register_api, name='register'),
    path('api/user/', UserAccountsView.as_view(), name='user'),
    path('api/logout/', lambda request: Response({'detail': 'Successfully logged out.'}), name='logout'),

    # API endpoints (accounts, transactions, etc.)
    #path('api/', include(router.urls)),
    path('api/', include('banking.backend.urls')),
]
