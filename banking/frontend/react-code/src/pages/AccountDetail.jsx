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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPostcode, setEditPostcode] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Initialize current page state
  const [roundUpEnabled, setRoundUpEnabled] = useState(false); // Add state for round-up toggle
  const itemsPerPage = 10; // Define items per page

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/accounts/${id}/`,
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
        setAccount(data);
        setEditName(data.name);
        setEditPostcode(data.postcode);
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
        const response = await fetch(
          `http://127.0.0.1:8000/api/transactions/account/${id}/`,
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
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [id]);

  useEffect(() => {
    if (account) {
      setRoundUpEnabled(account.round_up_enabled); // Set initial state from account data
    }
  }, [account]);

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/accounts/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName,
            postcode: editPostcode,
            round_up_enabled: roundUpEnabled,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedAccount = await response.json();
      setAccount(updatedAccount);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update account details:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this account? This action cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/accounts/${id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        alert("Account deleted successfully.");
        navigate("/accounts");
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleRoundUpToggle = async (checked) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/accounts/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            round_up_enabled: checked,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedAccount = await response.json();
      setAccount(updatedAccount);
      setRoundUpEnabled(updatedAccount.round_up_enabled);
    } catch (error) {
      console.error("Failed to update round-up setting:", error);
    }
  };

  // Function to handle next page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(transactions.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Paginate transactions
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading || !account)
    return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 max-w-5xl mx-auto relative ml-[400px]">
        <Breadcrumb
          items={[
            { label: "Accounts", to: "/accounts" },
            { label: "Account Details" },
          ]}
        />
        <div className="flex items-center justify-between mb-4">
          <BackButton to="/accounts" />
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:text-gray-800"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">
                Edit Account Details
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  value={editPostcode}
                  onChange={(e) => setEditPostcode(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Round-Up Enabled
                </label>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roundUpEnabled}
                      onChange={(e) => setRoundUpEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 dark:bg-gray-700 peer-checked:bg-green-600"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
                  </label>
                </div>
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
                <td className="py-2 px-4 text-gray-700">
                  {account.account_type_display}
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">
                  Starting Balance
                </th>
                <td className="py-2 px-4 text-gray-700">
                  £{account.starting_balance}
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">
                  Current Balance
                </th>
                <td className="py-2 px-4 text-gray-700">
                  £{account.current_balance}
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">
                  Round-Up Pot
                </th>
                <td className="py-2 px-4 text-gray-700">
                  £{account.round_up_pot}
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">
                  Postcode
                </th>
                <td className="py-2 px-4 text-gray-700">{account.postcode}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">User</th>
                <td className="py-2 px-4 text-gray-700">
                  {account.user_details?.username}
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">
                  Round-Up Enabled
                </th>
                <td className="py-2 px-4 text-gray-700">
                  {account.round_up_enabled ? "Enabled" : "Disabled"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions found.</p>
          ) : (
            <>
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 font-medium text-gray-700">
                      Type
                    </th>
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
                  {paginatedTransactions.map((txn) => (
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
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:text-gray-800 disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of{" "}
                  {Math.ceil(transactions.length / itemsPerPage)}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage ===
                    Math.ceil(transactions.length / itemsPerPage)
                  }
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:text-gray-800 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
