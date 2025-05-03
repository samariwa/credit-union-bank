import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";

// InfoCard component: Renders a single information card with title, value, and gradient background
const InfoCard = ({ title, value, gradient }) => {
  return (
    <div
      className={`rounded-2xl h-[220px] p-4 flex flex-col justify-between text-white shadow-md bg-gradient-to-br ${gradient} flex-1 min-w-[170px] max-w-[calc(25%-1.5rem)]`}
    >
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="text-6xl font-bold text-center">{value}</p>
    </div>
  );
};

export default function CardRow() {
  const userInfo = JSON.parse(localStorage.getItem("user_info"));

  // State variables for dynamic values
  const [accountCount, setAccountCount] = useState("...");
  const [transactionCount, setTransactionCount] = useState("...");
  const [flaggedCount, setFlaggedCount] = useState("...");
  const [successRate, setSuccessRate] = useState("...");
  const [sanctionedBusinesses, setSanctionedBusinesses] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    // Fetch the number of accounts from the API
    const fetchAccountCount = async () => {
      try {
        const response = await apiClient.get("/accounts");
        if (Array.isArray(response.data)) {
          setAccountCount(response.data.length);
        } else {
          console.error("Unexpected API response format:", response.data);
          setAccountCount("Error");
        }
      } catch (error) {
        console.error("Error fetching account count:", error);
        setAccountCount("Error");
      }
    };

    // Fetch the number of transactions from the API
    const fetchTransactionCount = async () => {
      try {
        const response = await apiClient.get("/transactions");
        if (Array.isArray(response.data)) {
          setTransactionCount(response.data.length);
        } else {
          console.error("Unexpected API response format:", response.data);
          setTransactionCount("Error");
        }
      } catch (error) {
        console.error("Error fetching transaction count:", error);
        setTransactionCount("Error");
      }
    };

    // Fetch flagged transactions count (you need to implement this endpoint)
    const fetchFlaggedTransactions = async () => {
      try {
        const response = await apiClient.get("/transactions/flagged"); // Example endpoint
        if (Array.isArray(response.data)) {
          setFlaggedCount(response.data.length);
        } else {
          setFlaggedCount("Error");
        }
      } catch (error) {
        console.error("Error fetching flagged transactions:", error);
        setFlaggedCount("Error");
      }
    };

    // Fetch transaction success rate (you need to implement this logic)
    const fetchTransactionSuccessRate = async () => {
      try {
        const response = await apiClient.get("/transactions/success-rate"); // Example endpoint
        if (typeof response.data.success_rate === "number") {
          setSuccessRate(`${response.data.success_rate.toFixed(2)}%`);
        } else {
          setSuccessRate("Error");
        }
      } catch (error) {
        console.error("Error fetching success rate:", error);
        setSuccessRate("Error");
      }
    };

    // Fetch sanctioned businesses (you need to implement this endpoint)
    const fetchSanctionedBusinesses = async () => {
      try {
        const response = await apiClient.get("/businesses");
        if (Array.isArray(response.data)) {
          const sanctioned = response.data.filter(
            (business) => business.sanctioned === true
          );
          setSanctionedBusinesses(sanctioned);
        } else {
          console.error("Unexpected API response format:", response.data);
          setSanctionedBusinesses([]);
        }
      } catch (error) {
        console.error("Error fetching sanctioned businesses:", error);
        setSanctionedBusinesses([]);
      }
    };

    // Fetch businesses (you need to implement this endpoint)
    const fetchBusinesses = async () => {
      try {
        const response = await apiClient.get("/businesses"); // Example endpoint
        if (Array.isArray(response.data)) {
          setBusinesses(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setBusinesses([]);
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
        setBusinesses([]);
      }
    };

    // Run all data fetches
    fetchAccountCount();
    fetchTransactionCount();
    fetchFlaggedTransactions();
    fetchTransactionSuccessRate();
    fetchSanctionedBusinesses();
    fetchBusinesses();
  }, []);

  // Define the cards with title, value, and gradient background
  const cards = [
    {
      title: "Accounts",
      value: accountCount,
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      title: "Transactions",
      value: transactionCount,
      gradient: "from-yellow-400 to-orange-500", // Updated color gradient
    },
    {
      title: "Businesses",
      value: businesses.length,
      gradient: "from-green-400 to-blue-600", // Updated color gradient
    },
    {
      title: "Sanctioned Businesses",
      value: sanctionedBusinesses.length,
      gradient: "from-red-500 to-yellow-600",
    },
  ];

  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-3xl font-bold text-white">Hello, {userInfo.username}!</h1>

      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold text-white">Summary</h2>
        <button className="text-base text-white hover:underline">
          Add More+
        </button>
      </div>

      <div className="flex gap-6 justify-start flex-wrap w-full">
        {cards.map((card, index) => (
          <InfoCard
            key={index}
            title={card.title}
            value={card.value}
            gradient={card.gradient}
          />
        ))}
      </div>
    </div>
  );
}
