import uuid
from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
from math import ceil

class Account(models.Model):
    ACCOUNT_TYPES = [
        ('current', 'Current'),
        ('savings', 'Savings'),
        ('credit', 'Credit'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    starting_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    round_up_enabled = models.BooleanField(default=False)
    postcode = models.CharField(max_length=10, null=True, blank=True)
    round_up_pot = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    # Add user field to associate with Django User
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts', null=True, blank=True)
    # Add account type field
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES, default='current')

    def save(self, *args, **kwargs):
        if not self.pk:  # If the account is being created
            self.current_balance = self.starting_balance
        if not self.user.is_staff:  # Check if the user is not an admin
            self.starting_balance = Decimal('0.00')  # Set a default value instead of None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Business(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    sanctioned = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('payment', 'Payment'),
        ('withdrawal', 'Withdrawal'),
        ('deposit', 'Deposit'),
        ('collect_roundup', 'Collect Roundup'),
        ('transfer', 'Transfer'),
        ('roundup_reclaim', 'Round Up Reclaim'),
    ]

    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    from_account = models.ForeignKey(Account, related_name='outgoing_transactions', on_delete=models.CASCADE, null=True, blank=True)
    to_account = models.ForeignKey(Account, related_name='incoming_transactions', on_delete=models.CASCADE, null=True, blank=True)
    business = models.ForeignKey(Business, related_name='transactions', on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"

    def save(self, *args, **kwargs):
        # Check if this is a new transaction
        is_new = self.pk is None
        super().save(*args, **kwargs)

        # Handle round-up logic for payment transactions
        if is_new and self.transaction_type == 'payment':
            # Deduct the payment amount from the current balance
            self.from_account.current_balance -= self.amount
            self.from_account.save()

            if self.from_account.round_up_enabled:
                # Calculate the round-up amount
                rounded_up_amount = Decimal(ceil(self.amount))  # Use math.ceil to round up
                round_up_difference = rounded_up_amount - self.amount

                if round_up_difference > 0:
                    # Update the round-up pot of the from_account
                    self.from_account.round_up_pot += round_up_difference
                    self.from_account.current_balance -= round_up_difference
                    self.from_account.save()

                    # Create a collect round-up transaction
                    Transaction.objects.create(
                        transaction_type='collect_roundup',
                        amount=round_up_difference,
                        from_account=self.from_account,
                        to_account=None,  # No to_account for collect round-up
                        business=None  # No business for collect round-up
                    )
