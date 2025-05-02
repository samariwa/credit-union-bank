from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import action, api_view, permission_classes
from django.db import models
from django.db.models import Sum
from django.contrib.auth.models import User
from .models import Account, Transaction, Business
from .serializers import AccountSerializer, TransactionSerializer, BusinessSerializer
from decimal import Decimal
import os
import subprocess
import logging

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        # Extract user data from request
        # Validate required fields
        if not username or not password:
            return Response(
                {"error": "Username and password are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create the user
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            
            # Create default Current Account with 1000 starting balance
            current_account = Account.objects.create(
                name=f"{first_name or username}'s Current Account",
                starting_balance=Decimal('1000.00'),
                round_up_enabled=False,
                user=user,
                account_type='current'
            )
            
            # Create default Savings Account with 0 starting balance
            savings_account = Account.objects.create(
                name=f"{first_name or username}'s Savings Account",
                starting_balance=Decimal('0.00'),
                round_up_enabled=True,  # Enable round-up for savings by default
                user=user,
                account_type='savings'
            )
            
            # Return success response with account details
            return Response({
                "message": "User registered successfully",
                "user_id": user.id,
                "accounts": [
                    {
                        "id": str(current_account.id),
                        "name": current_account.name,
                        "type": current_account.get_account_type_display(),
                        "balance": str(current_account.starting_balance)
                    },
                    {
                        "id": str(savings_account.id),
                        "name": savings_account.name,
                        "type": savings_account.get_account_type_display(),
                        "balance": str(savings_account.starting_balance)
                    }
                ]
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"error": f"Error creating user: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    
    def get_queryset(self):
        # If user is authenticated, return only their accounts
        # For admin users, return all accounts
        if self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return Account.objects.all()
            # Return only accounts associated with the logged-in user
            return Account.objects.filter(user=self.request.user)
        return Account.objects.none()
    
    def get_permissions(self):
        # For list and retrieve actions, require authentication
        if self.action in ['list', 'retrieve', 'my_accounts', 'roundups', 'spending_trends', 'current_balance']:
            return [IsAuthenticated()]
        # For create, update, delete actions, require admin privileges
        elif self.action in ['create', 'update', 'partial_update', 'destroy', 'manager_list']:
            return [IsAdminUser()]
        return [AllowAny()]
        
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_accounts(self, request):
        """
        Get all accounts belonging to the currently authenticated user.
        This endpoint needs a valid JWT token in the Authorization header.
        """
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        accounts = Account.objects.filter(user=request.user)
        serializer = self.get_serializer(accounts, many=True)
        
        # Print debugging info
        print(f"User: {request.user}, Auth: {request.user.is_authenticated}")
        print(f"Found {accounts.count()} accounts")
        
        return Response(serializer.data)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        # Filter transactions by business if a business ID is provided in the query params
        business_id = self.request.query_params.get('business', None)
        if business_id:
            return Transaction.objects.filter(business_id=business_id)

        # Default behavior: return transactions for accounts owned by the user
        if self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return Transaction.objects.all()
            user_accounts = Account.objects.filter(user=self.request.user)
            return Transaction.objects.filter(from_account__in=user_accounts)
        return Transaction.objects.none()
    
    def get_permissions(self):
        # For read actions, require authentication
        if self.action in ['list', 'retrieve', 'account_transactions', 'spending_summary']:
            return [IsAuthenticated()]
        # For write actions, also require authentication
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        def extract_account_id(value):
            # Extract the ID before the first space or parenthesis
            return value.split()[0] if value else None

        logging.info(f"Incoming request payload: {self.request.data}")
        transaction_type = self.request.data.get('transaction_type')
        amount = Decimal(self.request.data.get('amount', '0'))
        from_account_id = self.request.data.get('from_account')
        to_account_id = self.request.data.get('to_account')

        from_account_id = extract_account_id(from_account_id)
        to_account_id = extract_account_id(to_account_id)

        logging.info(f"Transaction Type: {transaction_type}, Amount: {amount}, From Account ID: {from_account_id}, To Account ID: {to_account_id}")

        try:
            if transaction_type in ['withdrawal', 'payment', 'transfer']:
                if not from_account_id:
                    logging.error(f"{transaction_type.capitalize()} transaction missing 'from_account_id'.")
                    raise ValueError("'from_account_id' is required for this transaction type.")

                try:
                    from_account = Account.objects.get(id=from_account_id)
                except Account.DoesNotExist:
                    logging.error(f"Account with ID {from_account_id} does not exist for {transaction_type} transaction.")
                    raise ValueError("Account not found for this transaction.")

                if from_account.current_balance < amount:
                    logging.error(f"Insufficient funds for {transaction_type} transaction. Current balance: {from_account.current_balance}, Attempted amount: {amount}.")
                    raise ValueError("Insufficient funds for this transaction.")

            if transaction_type == 'withdrawal':
                from_account.current_balance -= amount
                from_account.save()

            elif transaction_type == 'deposit':
                from_account_id = None  # Ignore from_account for deposits
                if not to_account_id:
                    logging.error("Deposit transaction missing 'to_account_id'.")
                    raise ValueError("'to_account_id' is required for deposit transactions.")

                try:
                    to_account = Account.objects.get(id=to_account_id)
                except Account.DoesNotExist:
                    logging.error(f"Account with ID {to_account_id} does not exist for deposit transaction.")
                    raise ValueError("Account not found for deposit transaction.")

                logging.info(f"To Account ID: {to_account_id}, Initial Balance: {to_account.current_balance}")
                to_account.current_balance += amount
                to_account.save()
                logging.info(f"To Account ID: {to_account_id}, Updated Balance: {to_account.current_balance}")

            elif transaction_type == 'transfer':
                from_account = Account.objects.get(id=from_account_id)
                to_account = Account.objects.get(id=to_account_id)
                from_account.current_balance -= amount
                to_account.current_balance += amount
                from_account.save()
                to_account.save()

            elif transaction_type == 'payment':
                if not from_account_id:
                    logging.error("Payment transaction missing 'from_account_id'.")
                    raise ValueError("'from_account_id' is required for payment transactions.")

                try:
                    from_account = Account.objects.get(id=from_account_id)
                except Account.DoesNotExist:
                    logging.error(f"Account with ID {from_account_id} does not exist for payment transaction.")
                    raise ValueError("Account not found for payment transaction.")

                logging.info(f"From Account ID: {from_account_id}, Initial Balance: {from_account.current_balance}")
                from_account.current_balance -= amount
                if from_account.current_balance < 0:
                    logging.error("Insufficient funds for payment transaction.")
                    raise ValueError("Insufficient funds for payment transaction.")
                from_account.save()
                logging.info(f"From Account ID: {from_account_id}, Updated Balance: {from_account.current_balance}")

            serializer.save()
        except Account.DoesNotExist:
            logging.error(f"Account not found. From Account ID: {from_account_id}, To Account ID: {to_account_id}")
            raise ValueError("Account not found")
        except Exception as e:
            logging.error(f"Error processing transaction: {str(e)}")
            raise ValueError(f"Error processing transaction: {str(e)}")

    @action(detail=False, methods=['get'], url_path='account/(?P<account_id>[^/.]+)')
    def account_transactions(self, request, account_id=None):
        # View all transactions related to a specific account
        try:
            account = Account.objects.get(id=account_id)
            
            # Check if the user has permission to access this account
            if account.user != request.user and not request.user.is_staff:
                return Response({"detail": "You don't have permission to access this account"}, 
                               status=status.HTTP_403_FORBIDDEN)
                
            transactions = Transaction.objects.filter(from_account=account)
            serializer = self.get_serializer(transactions, many=True)
            return Response(serializer.data)
        except Account.DoesNotExist:
            return Response({"detail": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='spending-summary/(?P<account_id>[^/.]+)')
    def spending_summary(self, request, account_id=None):
        # Summarize spending by category for a given account
        try:
            account = Account.objects.get(id=account_id)
            
            # Check if the user has permission to access this account
            if account.user != request.user and not request.user.is_staff:
                return Response({"detail": "You don't have permission to access this account"}, 
                               status=status.HTTP_403_FORBIDDEN)
                
            # Summarize spending by business category
            spending_summary = Transaction.objects.filter(
                from_account=account,
                transaction_type="payment"
            ).values('business__category').annotate(total=Sum('amount'))        
            return Response(spending_summary)
        except Account.DoesNotExist:
            return Response({"detail": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='top-10-spenders')
    def top_10_spenders(self, request):
        # Get the top 10 spenders by amount - admin only
        if not request.user.is_staff:
            return Response({"detail": "Admin privileges required"}, status=status.HTTP_403_FORBIDDEN)
            
        top_spenders = Transaction.objects.filter(transaction_type="payment") \
            .values('from_account__name') \
            .annotate(total_spent=Sum('amount')) \
            .order_by('-total_spent')[:10]
        return Response(top_spenders)

    @action(detail=False, methods=['get'], url_path='sanctioned-business-report')
    def sanctioned_business_report(self, request):
        # Report all transactions related to sanctioned businesses - admin only
        if not request.user.is_staff:
            return Response({"detail": "Admin privileges required"}, status=status.HTTP_403_FORBIDDEN)
            
        sanctioned_transactions = Transaction.objects.filter(business__sanctioned=True) \
            .values('business__name') \
            .annotate(total_spent=Sum('amount'))
        return Response(sanctioned_transactions)


class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    
    def get_permissions(self):
        # For read operations, require authentication
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        # For write operations, require admin privileges
        return [IsAdminUser()]


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_users_and_accounts(request):
    """
    Endpoint to retrieve all users and their associated accounts.
    Accessible only by admin users.
    """
    users = User.objects.all()
    accounts = Account.objects.all()

    user_data = [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_staff": user.is_staff,  # Added is_staff field
        }
        for user in users
    ]

    account_serializer = AccountSerializer(accounts, many=True)

    return Response({
        "users": user_data,
        "accounts": account_serializer.data,
    })


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Retrieve the profile details of the currently authenticated user.
        """
        user = request.user
        return Response({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "username": user.username
        }, status=status.HTTP_200_OK)


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        data = request.data

        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.username = data.get("username", user.username)

        user.save()

        return Response({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
        }, status=status.HTTP_200_OK)
