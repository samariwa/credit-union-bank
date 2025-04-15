import React, { useState, useEffect } from "react";

// InfoCard component is used to display each card's content
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
  // Retrieve user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  // State to hold the username fetched from localStorage
  const [username, setUsername] = useState("");
  // State to hold card data
  const [cards, setCards] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for error message
  const [error, setError] = useState(null);

  // Function to fetch the username from localStorage
  const fetchUsername = () => {
    const storedUsername = userInfo.username; // Get the username stored in localStorage
    if (storedUsername) {
      setUsername(storedUsername); // Set the username to state if it exists
    }
  };

  // Function to fetch transaction data (example using an API)
  const fetchData = async () => {
    try {
      const accountId = "123e4567-e89b-12d3-a456-426614174000"; // Example account_id for testing
      const response = await fetch(
        `/api/transactions/spending-summary/${accountId}/`
      );

      // Log the raw response text for debugging
      const responseText = await response.text(); // Get the response as text
      console.log("Raw response:", responseText); // Log raw response to check if it's HTML (e.g., error page)

      if (!response.ok) {
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }

      // Try to parse the response as JSON if it's valid JSON
      const data = JSON.parse(responseText);

      // Assuming the API returns a totalSpending field
      if (data.totalSpending) {
        setCards([
          {
            title: "Total Spending",
            value: `${data.totalSpending}`,
            gradient: "from-teal-400 to-emerald-500",
          },
        ]);
      } else {
        setError("No spending data found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message); // Set the error state with the error message
    } finally {
      setLoading(false); // Set loading to false after data fetch completes
    }
  };

  // useEffect hook to call fetchUsername and fetchData when the component mounts
  useEffect(() => {
    fetchUsername(); // Fetch username when the component mounts
    fetchData(); // Fetch data when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component is mounted

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Display the dynamic username, or 'Guest' if no username is found */}
      <h1 className="text-3xl font-bold text-white">
        Hello, {username || "Guest"}!
      </h1>

      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold text-white">Your Cards</h2>
        <button className="text-base text-white hover:underline">
          Add More+
        </button>
      </div>

      <div className="flex gap-6 justify-start flex-wrap w-full">
        {/* Display error message if there's an error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display loading message if data is still being fetched */}
        {loading && !error && <p className="text-white">Loading data...</p>}

        {/* Render cards if data is available */}
        {cards.length > 0 &&
          cards.map((card, index) => (
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
