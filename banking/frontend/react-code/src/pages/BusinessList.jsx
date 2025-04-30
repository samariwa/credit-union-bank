import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [activeTab, setActiveTab] = useState("All Businesses");
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/businesses/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setBusinesses(data);
        setFilteredBusinesses(data);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      }
    };

    fetchBusinesses();
  }, []);

  const categories = [
    "All Businesses",
    "Retail",
    "Food",
    "Technology",
    "Finance",
  ];

  useEffect(() => {
    if (activeTab === "All Businesses") {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter((biz) => biz.category === activeTab);
      setFilteredBusinesses(filtered);
    }
  }, [activeTab, businesses]);

  const handleCardClick = (id) => {
    navigate(`/businesses/${id}`);
  };

  const handleCreateBusiness = async () => {
    try {
      const token = localStorage.getItem("access_token");

      // Fetch the latest business ID
      const latestResponse = await fetch(
        "http://127.0.0.1:8000/api/businesses/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!latestResponse.ok) {
        throw new Error(
          `Error fetching latest business: ${latestResponse.status}`
        );
      }

      const businesses = await latestResponse.json();
      const latestId =
        businesses.length > 0
          ? Math.max(...businesses.map((biz) => parseInt(biz.id, 10)))
          : 0;
      const nextId = (latestId + 1).toString();

      // Create the new business
      const response = await fetch("http://127.0.0.1:8000/api/businesses/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: nextId, // Use the next ID
          name: businessName,
          category: businessCategory,
          sanctioned: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Close modal and reset fields
      setIsBusinessModalOpen(false);
      setBusinessName("");
      setBusinessCategory("");

      // Refresh businesses list
      const data = await response.json();
      setBusinesses((prev) => [...prev, data]);
    } catch (error) {
      console.error("Failed to create business:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "Businesses" }]} />
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{activeTab}</h1>
            <button
              onClick={() => setIsBusinessModalOpen(true)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:text-gray-800"
            >
              <span className="mr-2 text-xl">+</span> New Business
            </button>
          </div>
          <div className="flex space-x-4 mb-4">
            {categories.map((tab) => (
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
                <th className="py-2 px-4 font-medium text-gray-700">ID</th>
                <th className="py-2 px-4 font-medium text-gray-700">Name</th>
                <th className="py-2 px-4 font-medium text-gray-700">
                  Category
                </th>
                <th className="py-2 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((biz) => (
                <tr key={biz.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-700">{biz.id}</td>
                  <td className="py-2 px-4 text-gray-700">{biz.name}</td>
                  <td className="py-2 px-4 text-gray-700">{biz.category}</td>
                  <td className="py-2 px-4 text-gray-700">
                    <button
                      onClick={() => handleCardClick(biz.id)}
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

      {isBusinessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Create New Business</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsBusinessModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBusiness}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessList;
