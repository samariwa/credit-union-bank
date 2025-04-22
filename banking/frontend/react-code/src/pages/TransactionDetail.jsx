import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import BackButton from "../components/BackButton";

const TransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFromAccount, setEditFromAccount] = useState("");
  const [editToAccount, setEditToAccount] = useState("");
  const [editBusiness, setEditBusiness] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
        setEditFromAccount(data.from_account);
        setEditToAccount(data.to_account);
        setEditBusiness(data.business);
      } catch (error) {
        console.error("Failed to fetch transaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://127.0.0.1:8000/api/transactions/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_account: editFromAccount,
          to_account: editToAccount,
          business: editBusiness,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.from_account) {
          setErrorMessage(`The From Account ID '${editFromAccount}' does not exist. Please provide a valid account ID.`);
        } else if (errorData.to_account) {
          setErrorMessage(`The To Account ID '${editToAccount}' does not exist. Please provide a valid account ID.`);
        } else if (errorData.business) {
          setErrorMessage(`The Business ID '${editBusiness}' does not exist. Please provide a valid business ID.`);
        } else {
          setErrorMessage(errorData.detail || "An error occurred");
        }
        return;
      }

      const updatedTransaction = await response.json();
      setTransaction(updatedTransaction);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update transaction details:", error);
      setErrorMessage("Failed to update transaction details");
    }
  };

  if (loading || !transaction)
    return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 max-w-4xl mx-auto relative">
        <Breadcrumb
          items={[
            { label: "Transactions", to: "/transactions" },
            { label: "Transaction Details" },
          ]}
        />
        <div className="flex items-center justify-between mb-4">
          <BackButton to="/transactions" />
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:text-gray-800"
          >
            Edit
          </button>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Edit Transaction Details</h2>
              {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">From Account</label>
                <input
                  type="text"
                  value={editFromAccount}
                  onChange={(e) => setEditFromAccount(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">To Account</label>
                <input
                  type="text"
                  value={editToAccount}
                  onChange={(e) => setEditToAccount(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Business</label>
                <input
                  type="text"
                  value={editBusiness}
                  onChange={(e) => setEditBusiness(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

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