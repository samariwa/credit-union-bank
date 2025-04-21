import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import BackButton from "../components/BackButton";

const TransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:8000/api/transactions/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTransaction(data);
      } catch (error) {
        console.error("Failed to fetch transaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  if (loading || !transaction)
    return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Transactions", to: "/transactions" },
            { label: "Transaction Details" },
          ]}
        />
        <BackButton to="/transactions" />
        <div className="bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
          <table className="table-auto w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Type</th>
                <td className="py-2 px-4 text-gray-700">{transaction.transaction_type}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Amount</th>
                <td className="py-2 px-4 text-gray-700">£{transaction.amount}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">From Account</th>
                <td className="py-2 px-4 text-gray-700">{transaction.from_account}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">To Account</th>
                <td className="py-2 px-4 text-gray-700">{transaction.to_account || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Business</th>
                <td className="py-2 px-4 text-gray-700">{transaction.business || "N/A"}</td>
              </tr>
              <tr>
                <th className="py-2 px-4 font-medium text-gray-700">Timestamp</th>
                <td className="py-2 px-4 text-gray-700">
                  {new Date(transaction.timestamp).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;