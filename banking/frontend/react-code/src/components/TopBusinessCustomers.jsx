import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";

export default function TopBusinessCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const response = await apiClient.get("/transactions/top-10-spenders");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching top business customers:", error);
      }
    };

    fetchTopCustomers();
  }, []);

  return (
    <div className="bg-[#111111] rounded-xl p-6 shadow-lg w-full">
      <h2 className="text-white text-lg text-[40px] font-semibold mb-4">
        Top Business Customers
      </h2>

      <div className="flex flex-col gap-4">
        {customers.map((customer, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#1a1a1a] rounded-lg p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-500"></div>{" "}
              {/* Grey background for avatar */}
              <span className="text-white font-medium">
                {customer.from_account__name}
              </span>
            </div>
            <span className="text-white text-lg font-semibold">
              £{customer.total_spent.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
