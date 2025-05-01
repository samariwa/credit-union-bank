import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
        setEditFirstName(data.user.first_name);
        setEditLastName(data.user.last_name);
        setEditEmail(data.user.email);
        setEditUsername(data.user.username);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/user/update/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: editFirstName,
          last_name: editLastName,
          username: editUsername,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile((prevProfile) => ({
        ...prevProfile,
        user: {
          ...prevProfile.user,
          first_name: updatedProfile.first_name,
          last_name: updatedProfile.last_name,
          username: updatedProfile.username,
        },
      }));

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen text-white bg-[#0f0f0f]">
      <Sidebar />
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "Profile" }]} />
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-black relative">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:text-gray-800 absolute top-4 right-4"
          >
            <span className="mr-2 text-xl">✎</span> Edit
          </button>

          <div className="flex items-center mb-4">
            <img
              src="https://cdn-icons-png.freepik.com/512/6596/6596121.png"
              alt="User Avatar"
              className="w-40 h-40 rounded-full mr-6"
            />
            <div>
              <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
              <p>
                <strong>First Name:</strong> {profile.user.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {profile.user.last_name}
              </p>
              <p>
                <strong>Email:</strong> {profile.user.email}
              </p>
              <p>
                <strong>Username:</strong> {profile.user.username}
              </p>
            </div>
          </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFirstName} // Ensure this is bound to the state
                    onChange={(e) => setEditFirstName(e.target.value)} // Update state on change
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-black" // Ensure text is black
                    readOnly={false} // Ensure field is editable
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-black"
                    readOnly={false}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-black"
                    readOnly={false}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
