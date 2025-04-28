import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import BackButton from "../components/BackButton";

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinessAndTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Fetch business details
        const businessResponse = await fetch(
          `http://127.0.0.1:8000/api/businesses/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!businessResponse.ok) {
          throw new Error(`Error fetching business: ${businessResponse.status}`);
        }

        const businessData = await businessResponse.json();

        // Fetch transactions
        const transactionsResponse = await fetch(
          `http://127.0.0.1:8000/api/transactions/?business=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!transactionsResponse.ok) {
          throw new Error(`Error fetching transactions: ${transactionsResponse.status}`);
        }

        const transactionsData = await transactionsResponse.json();

        // Combine business and transactions data
        setBusiness({ ...businessData, transactions: transactionsData });
      } catch (error) {
        console.error("Failed to fetch business or transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessAndTransactions();
  }, [id]);

  if (loading || !business)
    return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 max-w-4xl mx-auto relative">
        <Breadcrumb
          items={[
            { label: "Businesses", to: "/businesses" },
            { label: "Business Details" },
          ]}
        />
        <div className="flex items-center justify-between mb-4">
          <BackButton to="/businesses" />
        </div>

        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Business Details</h1>
          <table className="table-auto w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Name</th>
                <td className="py-2 px-4 text-gray-700">{business.name}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">
                  Category
                </th>
                <td className="py-2 px-4 text-gray-700">{business.category}</td>
              </tr>
              <tr>
                <th className="py-2 px-4 font-medium text-gray-700">
                  Sanctioned
                </th>
                <td className="py-2 px-4 text-gray-700">
                  {business.sanctioned ? "Yes" : "No"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          {business.transactions.length === 0 ? (
            <p className="text-gray-500">No transactions found.</p>
          ) : (
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 font-medium text-gray-700">Type</th>
                  <th className="py-2 px-4 font-medium text-gray-700">
                    Amount
                  </th>
                  <th className="py-2 px-4 font-medium text-gray-700">
                    Timestamp
                  </th>
                  <th className="py-2 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {business.transactions.map((txn) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
