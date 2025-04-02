import React from "react";

const flagged = [
  {
    id: "#238d-232-24623d-2342",
    date: "09 Sep 2022 at 02:35",
    amount: "£700",
  },
  {
    id: "#212d-232-24878c-2372",
    date: "10 Sep 2022 at 06:35",
    amount: "£90",
  },
  {
    id: "#245d-234-24223e-2942",
    date: "11 Sep 2022 at 18:35",
    amount: "£12000",
  },
  {
    id: "#223d-232-24623d-2342",
    date: "11 Sep 2022 at 23:35",
    amount: "£9000",
  },
  {
    id: "#218d-212-23423f-9342",
    date: "12 Sep 2022 at 07:35",
    amount: "£10",
  },
];

export default function FlaggedTransactions() {
  return (
    <div className="bg-[#111111] rounded-xl p-6 shadow-lg w-full h-[500px]">
      <div className="flex justify-between mb-4">
        <h2 className="text-white text-4xl font-semibold">
          Flagged Transactions
        </h2>
        <a href="#" className="text-sm text-indigo-300 hover:underline">
          See All
        </a>
      </div>

      <div className="flex flex-col gap-4">
        {flagged.map((item, i) => (
          <div
            key={i}
            className="flex items-start justify-between text-white text-sm border-b border-[#222] pb-2"
          >
            <div>
              <p className="font-medium">{item.id}</p>
              <p className="text-xs text-gray-400 mt-1">{item.date}</p>
            </div>
            <p className="font-semibold">{item.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
