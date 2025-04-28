import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("All Transactions");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/transactions/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (activeTab === "All Transactions") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (txn) => txn.transaction_type === activeTab.toLowerCase()
      );
      setFilteredTransactions(filtered);
    }
  }, [activeTab, transactions]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "Transactions" }]} />
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-4">{activeTab}</h1>
          <div className="flex space-x-4 mb-4">
            {[
              "All Transactions",
              "Payment",
              "Withdrawal",
              "Deposit",
              "Collect Round_Up",
              "Transfer",
              "Roundup_Reclaim",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-gray-700 hover:text-white`}
              >
                {tab}
              </button>
            ))}
          </div>
          <table className="table-auto w-[95%] text-left border-collapse mx-auto">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Type</th>
                <th className="py-2 px-4 font-medium text-gray-700">Amount</th>
                <th className="py-2 px-4 font-medium text-gray-700">
                  Timestamp
                </th>
                <th className="py-2 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-700">
                    {txn.transaction_type}
                  </td>
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
        </div>
      </main>
    </div>
  );
};

export default TransactionsList;
