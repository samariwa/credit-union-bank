import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [activeTab, setActiveTab] = useState("All Businesses");
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

  useEffect(() => {
    if (activeTab === "All Businesses") {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter((biz) => biz.category === activeTab);
      setFilteredBusinesses(filtered);
    }
  }, [activeTab, businesses]);

  const handleCardClick = (id) => {
    navigate(`/business/${id}`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "Businesses" }]} />
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-4">{activeTab}</h1>
          <div className="flex space-x-4 mb-4">
            {[
              "All Businesses",
              "Retail",
              "Finance",
              "Healthcare",
              "Technology",
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
                <th className="py-2 px-4 font-medium text-gray-700">ID</th>
                <th className="py-2 px-4 font-medium text-gray-700">Name</th>
                <th className="py-2 px-4 font-medium text-gray-700">Owner</th>
                <th className="py-2 px-4 font-medium text-gray-700">
                  Category
                </th>
                <th className="py-2 px-4 font-medium text-gray-700">Revenue</th>
                <th className="py-2 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((biz) => (
                <tr key={biz.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-700">{biz.id}</td>
                  <td className="py-2 px-4 text-gray-700">{biz.name}</td>
                  <td className="py-2 px-4 text-gray-700">{biz.owner_name}</td>
                  <td className="py-2 px-4 text-gray-700">{biz.category}</td>
                  <td className="py-2 px-4 text-gray-700">£{biz.revenue}</td>
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
    </div>
  );
};

export default BusinessList;
