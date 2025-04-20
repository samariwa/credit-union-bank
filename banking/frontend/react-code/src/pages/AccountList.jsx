import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
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
  }, []);

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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Accounts</h1>
      <div className="grid gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="flex justify-between items-center bg-white p-4 shadow rounded-xl hover:bg-gray-50 cursor-pointer relative"
            onClick={() => handleCardClick(acc.id)}
          >
            <div>
              <h2 className="text-lg font-semibold">
                {acc.user.first_name} {acc.user.last_name}
              </h2>
              <p className="text-gray-600">Username: {acc.user.username}</p>
              <p className="text-gray-600">
                Account: {acc.name} ({acc.account_type_display})
              </p>
              <p className="text-gray-600">Balance: £{acc.starting_balance}</p>
            </div>
            <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setMenuOpenId(acc.id)}>
                <MoreVertical className="text-gray-500 hover:text-gray-800" />
              </button>
              {menuOpenId === acc.id && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow rounded p-2 text-sm">
                  <button
                    className="block w-full text-left hover:bg-gray-100 px-2 py-1"
                    onClick={() => handleActionClick(acc.user, "edit")}
                  >
                    Edit
                  </button>
                  <button
                    className="block w-full text-left text-red-600 hover:bg-red-50 px-2 py-1"
                    onClick={() => handleActionClick(acc.user, "delete")}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
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
    </div>
  );
};

export default AccountList;
