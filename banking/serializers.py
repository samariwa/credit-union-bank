from rest_framework import serializers
from .models import Account, Transaction, Business

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'name', 'starting_balance', 'round_up_enabled', 'postcode']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['transaction_type', 'amount', 'from_account', 'to_account', 'timestamp']

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'name', 'category', 'sanctioned']
