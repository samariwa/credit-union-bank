import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";

const ChevronIcon = ({ isExpanded }) => <span>{isExpanded ? "▼" : "▶"}</span>;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.user) {
          setUsers([{ user: data.user, accounts: data.accounts }]);
        } else {
          console.error("Unexpected API response format:", data);
          setUsers([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]); // Fallback to an empty array
      }
    };

    fetchUsers();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/user/${id}`);
  };

  const toggleAccordion = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  if (users.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">Loading users...</div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "Users" }]} />
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          <table className="table-auto w-[95%] text-left border-collapse mx-auto">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-700"></th>
                <th className="py-2 px-4 font-medium text-gray-700">User ID</th>
                <th className="py-2 px-4 font-medium text-gray-700">
                  First Name
                </th>
                <th className="py-2 px-4 font-medium text-gray-700">
                  Last Name
                </th>
                <th className="py-2 px-4 font-medium text-gray-700">
                  Username
                </th>
                <th className="py-2 px-4 font-medium text-gray-700">Email</th>
                <th className="py-2 px-4 font-medium text-gray-700">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <>
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50"
                    onClick={() => toggleAccordion(user.user.id)}
                  >
                    <td className="py-2 px-4 text-gray-700">
                      <ChevronIcon
                        isExpanded={expandedUserId === user.user.id}
                      />
                    </td>
                    <td className="py-2 px-4 text-gray-700">{user.user.id}</td>
                    <td className="py-2 px-4 text-gray-700">
                      {user.user.first_name || "N/A"}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {user.user.last_name || "N/A"}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {user.user.username || "N/A"}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {user.user.email || "N/A"}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {user.user.is_staff ? "Admin" : "User"}
                    </td>
                  </tr>
                  {expandedUserId === user.user.id && (
                    <tr>
                      <td colSpan="7" className="py-2 px-4">
                        <div className="bg-gray-100 p-4 rounded">
                          <h3 className="text-lg font-semibold mb-2">
                            Accounts
                          </h3>
                          {user.accounts.length > 0 ? (
                            <table className="table-auto w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b">
                                  <th className="py-2 px-4 font-medium text-gray-700">
                                    Account ID
                                  </th>
                                  <th className="py-2 px-4 font-medium text-gray-700">
                                    Name
                                  </th>
                                  <th className="py-2 px-4 font-medium text-gray-700">
                                    Balance
                                  </th>
                                  <th className="py-2 px-4 font-medium text-gray-700">
                                    Type
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {user.accounts.map((account) => (
                                  <tr
                                    key={account.id}
                                    className="border-b hover:bg-gray-50"
                                  >
                                    <td className="py-2 px-4 text-gray-700">
                                      {account.id}
                                    </td>
                                    <td className="py-2 px-4 text-gray-700">
                                      {account.name}
                                    </td>
                                    <td className="py-2 px-4 text-gray-700">
                                      £{account.starting_balance}
                                    </td>
                                    <td className="py-2 px-4 text-gray-700">
                                      {account.account_type_display}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-gray-500">
                              No accounts available for this user.
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
