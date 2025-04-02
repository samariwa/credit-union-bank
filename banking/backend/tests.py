#TASK3 tests implementation
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Account, Transaction, Business
from django.contrib.auth.models import User
from decimal import Decimal
import uuid


class BankingAPITestCase(APITestCase):
    def setUp(self):
        # Create a test user and get a JWT token for authentication
        self.user = User.objects.create_user(username="testuser", password="password")
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Set up test data
        self.account = Account.objects.create(
            id="3ac94f73-ee6a-473a-ad35-c36164229144",
            name="Test User",
            starting_balance=Decimal('1000.00'),
            round_up_enabled=True
        )

        self.business = Business.objects.create(
            id="kfc",
            name="KFC",
            category="Food",
            sanctioned=False
        )

        self.transaction = Transaction.objects.create(
            transaction_type="payment",
            amount=Decimal('25.50'),
            from_account=self.account,
            to_account=self.account
        )

    def test_get_account_list(self):
        # Test retrieving the list of accounts
        url = reverse('account-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_account_detail(self):
        # Test retrieving a specific account
        url = reverse('account-detail', args=[self.account.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Test User")

    def test_create_transaction(self):
        # Test creating a transaction
        url = reverse('transaction-list')
        data = {
            "transaction_type": "withdrawal",
            "amount": "100.00",
            "from_account": str(self.account.id),
            "to_account": None
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transaction.objects.count(), 2)

    def test_get_business_list(self):
        # Test retrieving the list of businesses
        url = reverse('business-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_roundup_feature(self):
        # Test the RoundUp feature for an account
        url = reverse('account-roundups', args=[self.account.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('savings', response.data)
        # Assuming one transaction of 25.50, round up amount would be 0.50

    def test_spending_trends(self):
        # Test the Spending Trends feature
        url = reverse('account-spending-trends', args=[self.account.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['total'],Decimal('25.5'))

    def test_update_business_sanction_status(self):
        # Test updating the sanction status of a business
        url = reverse('business-detail', args=[self.business.id])
        data = {
            "sanctioned": True
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.business.refresh_from_db()
        self.assertTrue(self.business.sanctioned)

#TASK4 Add manager_list and user_account actions

class BankingAPIManagerTestCase(APITestCase):
    def setUp(self):
        # Create test user and token
        self.user = User.objects.create_user(username="testuser", password="password")
        self.manager = User.objects.create_user(username="manager", password="password", is_staff=True)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(RefreshToken.for_user(self.user).access_token))

        # Create account and business with valid UUID for account id
        self.account = Account.objects.create(id=uuid.uuid4(), name="User Account", starting_balance=Decimal('1000.00'), round_up_enabled=True)
        self.business = Business.objects.create(id="kfc", name="KFC", category="Food", sanctioned=False)
        self.transaction = Transaction.objects.create(transaction_type="payment", amount=Decimal('50.00'), from_account=self.account, to_account=self.account)

    def test_get_account_list_as_manager(self):
        self.client.force_authenticate(user=self.manager)
        url = reverse('account-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_account(self):
        url = reverse('account-user-account', args=[self.account.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.account.name)

    def test_transactions_for_account(self):
        url = reverse('transaction-account-transactions', args=[self.account.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_spending_summary(self):
        url = reverse('transaction-spending-summary', args=[self.account.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_current_balance(self):
        url = reverse('account-current-balance', args=[self.account.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('current_balance', response.data)        


#TASK5 "Round Up," "Round Up Reclamation," "Top 10 Spenders,"
 
class BankingAPITestCase3(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(RefreshToken.for_user(self.user).access_token))

        self.account = Account.objects.create(id=uuid.uuid4(), name="User Account", starting_balance=Decimal('1000.00'), round_up_enabled=True)
        self.business = Business.objects.create(id="kfc", name="KFC", category="Food", sanctioned=True)
        self.transaction = Transaction.objects.create(transaction_type="payment", amount=Decimal('50.00'), from_account=self.account, to_account=self.account)
    def test_enable_roundup(self):
        url = reverse('account-enable-roundup', args=[self.account.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.account.round_up_enabled=True
        self.account.save()
        self.account.refresh_from_db()
        self.assertTrue(self.account.round_up_enabled)
    def test_reclaim_roundup(self):
        url = reverse('account-reclaim-roundup', args=[self.account.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_top_10_spenders(self):
        url = reverse('transaction-top-10-spenders')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)     

#
#ENDTASK5        