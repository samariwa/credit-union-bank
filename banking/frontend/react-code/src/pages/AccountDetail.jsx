import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton"; // Import BackButton component
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import Breadcrumb from "../components/Breadcrumb"; // Import Breadcrumb component

const AccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:8000/api/accounts/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setAccount(data);
      } catch (error) {
        console.error("Failed to fetch account details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [id]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:8000/api/transactions/account/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [id]);

  if (loading || !account)
    return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Accounts", to: "/accounts" },
            { label: "Account Details" },
          ]}
        />
        <BackButton to="/accounts" />
        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Account Details</h1>
          <table className="table-auto w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Name</th>
                <td className="py-2 px-4 text-gray-700">{account.name}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Type</th>
                <td className="py-2 px-4 text-gray-700">{account.account_type_display}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Starting Balance</th>
                <td className="py-2 px-4 text-gray-700">£{account.starting_balance}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Round-Up Pot</th>
                <td className="py-2 px-4 text-gray-700">£{account.round_up_pot}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Postcode</th>
                <td className="py-2 px-4 text-gray-700">{account.postcode}</td>
              </tr>
              <tr>
                <th className="py-2 px-4 font-medium text-gray-700">User</th>
                <td className="py-2 px-4 text-gray-700">{account.user_details?.username}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions found.</p>
          ) : (
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 font-medium text-gray-700">Type</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Amount</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Timestamp</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-gray-700">{txn.transaction_type}</td>
                    <td className="py-2 px-4 text-gray-700">£{txn.amount}</td>
                    <td className="py-2 px-4 text-gray-700">
                      {new Date(txn.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      <button
                        onClick={() => navigate(`/transaction/${txn.id}`)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:text-gray-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
