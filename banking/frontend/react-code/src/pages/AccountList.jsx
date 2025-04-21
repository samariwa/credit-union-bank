import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import Breadcrumb from "../components/Breadcrumb"; // Import Breadcrumb component

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState("All Accounts");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const mockAccounts = [
      {
        id: 1,
        name: "Personal Savings",
        account_type_display: "Savings",
        starting_balance: 1500.0,
        user: {
          id: 101,
          first_name: "Jane",
          last_name: "Doe",
          username: "janedoe",
        },
      },
      {
        id: 2,
        name: "Everyday Spending",
        account_type_display: "Checking",
        starting_balance: 230.45,
        user: {
          id: 102,
          first_name: "John",
          last_name: "Smith",
          username: "jsmith",
        },
      },
    ];
    setAccounts(mockAccounts);
    setFilteredAccounts(mockAccounts);
  }, []);

  useEffect(() => {
    if (activeTab === "All Accounts") {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter((acc) =>
        activeTab === "Savings Accounts"
          ? acc.account_type_display === "Savings"
          : activeTab === "Current Accounts"
          ? acc.account_type_display === "Checking"
          : activeTab === "Credit Accounts"
          ? acc.account_type_display === "Credit"
          : activeTab === "Other Accounts"
          ? !["Savings", "Checking", "Credit"].includes(acc.account_type_display)
          : true
      );
      setFilteredAccounts(filtered);
    }
  }, [activeTab, accounts]);

  const handleActionClick = (user, type) => {
    setSelectedUser(user);
    setActionType(type); // 'edit' or 'delete'
    setMenuOpenId(null);
    setShowAuthModal(true);
  };

  const handleConfirmAction = () => {
    setShowAuthModal(false);
    setPassword("");

    if (actionType === "edit") {
      navigate(`/users/${selectedUser.id}`);
    } else if (actionType === "delete") {
      setAccounts((prev) =>
        prev.filter((acc) => acc.user.id !== selectedUser.id)
      );
    }
  };

  const handleCardClick = (id) => {
    navigate(`/account/${id}`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: "Accounts" },
            ]}
          />
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-4">{activeTab}</h1> {/* Update title dynamically based on active tab */}
          <div className="flex space-x-4 mb-4">
            {['All Accounts', 'Savings Accounts', 'Current Accounts', 'Credit Accounts', 'Other Accounts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-gray-700 hover:text-white`}
              >
                {tab}
              </button>
            ))}
          </div>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700">Account Number</th>
                <th className="py-2 px-4 font-medium text-gray-700">Name</th>
                <th className="py-2 px-4 font-medium text-gray-700">Username</th>
                <th className="py-2 px-4 font-medium text-gray-700">Account</th>
                <th className="py-2 px-4 font-medium text-gray-700">Balance</th>
                <th className="py-2 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-700">{acc.id}</td>
                  <td className="py-2 px-4 text-gray-700">
                    {acc.user.first_name} {acc.user.last_name}
                  </td>
                  <td className="py-2 px-4 text-gray-700">{acc.user.username}</td>
                  <td className="py-2 px-4 text-gray-700">
                    {acc.name} ({acc.account_type_display})
                  </td>
                  <td className="py-2 px-4 text-gray-700">£{acc.starting_balance}</td>
                  <td className="py-2 px-4 text-gray-700">
                    <button
                      onClick={() => handleCardClick(acc.id)}
                      className="text-gray-800 hover:underline hover:text-gray-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAuthModal && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">
                Authenticate to Continue
              </h2>
              <p className="mb-4">
                Enter your password to {actionType}{" "}
                <strong>{selectedUser.first_name}</strong>'s account.
              </p>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccountList;
