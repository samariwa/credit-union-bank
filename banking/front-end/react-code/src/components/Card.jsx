import React from "react";

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
  const username = "Lora";

  const cards = [
    {
      title: "Accounts",
      value: "143",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      title: "Transactions",
      value: "3,450",
      gradient: "from-teal-400 to-emerald-500",
    },
    {
      title: "Flagged Transactions",
      value: "13",
      gradient: "from-pink-500 to-purple-600",
    },
    {
      title: "Transaction Success Rate",
      value: "97%",
      gradient: "from-cyan-400 to-teal-500",
    },
  ];

  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-3xl font-bold text-white">Hello, {username}!</h1>

      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold text-white">Your Cards</h2>
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
