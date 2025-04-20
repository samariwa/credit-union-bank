import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const mockUsers = [
      {
        id: 101,
        first_name: "Jane",
        last_name: "Doe",
        username: "janedoe",
        email: "jane@example.com",
        is_staff: true,
      },
      {
        id: 102,
        first_name: "John",
        last_name: "Smith",
        username: "jsmith",
        email: "john@example.com",
        is_staff: false,
      },
    ];

    const foundUser = mockUsers.find((u) => u.id === Number(id));
    setUser(foundUser);
  }, [id]);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Edit User: {user.first_name} {user.last_name}
      </h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            defaultValue={user.first_name}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            defaultValue={user.last_name}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            defaultValue={user.username}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            defaultValue={user.email}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            defaultValue={user.is_staff ? "admin" : "user"}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            console.log("Saving changes for:", user);
            navigate("/accounts");
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserManagement;
