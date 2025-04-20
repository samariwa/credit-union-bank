import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AccountDetail = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Replace this mock data with real API call:
    // axios.get(`/api/accounts/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
    const mockAccount = {
      id: id,
      name: "Personal Savings",
      account_type_display: "Savings",
      starting_balance: 1500.0,
      round_up_pot: 35.4,
      postcode: "BH1 2AA",
      user_details: {
        username: "janedoe",
      },
    };

    const mockTransactions = [
      {
        id: 1,
        transaction_type: "Deposit",
        amount: 200,
        timestamp: "2024-04-10T14:23:00Z",
      },
      {
        id: 2,
        transaction_type: "Withdrawal",
        amount: 50,
        timestamp: "2024-04-12T09:10:00Z",
      },
      {
        id: 3,
        transaction_type: "Payment",
        amount: 120,
        timestamp: "2024-04-14T18:45:00Z",
      },
    ];

    setTimeout(() => {
      setAccount(mockAccount);
      setTransactions(mockTransactions);
      setLoading(false);
    }, 500); // simulate loading delay
  }, [id]);

  if (loading || !account)
    return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Account Details</h1>
        <p className="text-gray-700">
          <strong>Name:</strong> {account.name}
        </p>
        <p className="text-gray-700">
          <strong>Type:</strong> {account.account_type_display}
        </p>
        <p className="text-gray-700">
          <strong>Starting Balance:</strong> £{account.starting_balance}
        </p>
        <p className="text-gray-700">
          <strong>Round-Up Pot:</strong> £{account.round_up_pot}
        </p>
        <p className="text-gray-700">
          <strong>Postcode:</strong> {account.postcode}
        </p>
        <p className="text-gray-700">
          <strong>User:</strong> {account.user_details?.username}
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((txn) => (
              <li key={txn.id} className="border-b pb-2">
                <p className="font-medium">
                  {txn.transaction_type} - £{txn.amount}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(txn.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccountDetail;
