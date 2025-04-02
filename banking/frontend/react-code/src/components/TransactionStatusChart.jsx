import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import React from "react";

const data = [
  { month: "Jan", Completed: 60, Pending: 40 },
  { month: "Feb", Completed: 50, Pending: 40 },
  { month: "Mar", Completed: 65, Pending: 35 },
  { month: "Apr", Completed: 70, Pending: 30 },
  { month: "May", Completed: 75, Pending: 25 },
  { month: "Jun", Completed: 55, Pending: 45 },
  { month: "Jul", Completed: 50, Pending: 30 },
];

export default function TransactionStatusChart() {
  return (
    <div className="bg-[#111111] rounded-xl p-6 shadow-lg w-full h-[680px]">
      {/* Toggle buttons */}
      <div className="flex items-center gap-4 mb-4 text-white text-sm">
        <div className="flex gap-2">
          <span className="bg-teal-400 w-3 h-3 rounded-full"></span> Completed
          <span className="bg-purple-300 w-3 h-3 rounded-full ml-4"></span>{" "}
          Pending
        </div>
        <div className="ml-auto flex gap-2">
          {["D", "W", "M", "Y"].map((label, i) => (
            <button
              key={i}
              className={`w-7 h-7 rounded-md flex items-center justify-center ${
                label === "M"
                  ? "bg-white text-black"
                  : "bg-[#222] text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ left: 20, right: 10 }}
          barCategoryGap={12}
          barSize={20}
        >
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#aaa" }} />
          <YAxis type="category" dataKey="month" tick={{ fill: "#aaa" }} />
          <Tooltip
            contentStyle={{ background: "#222", border: "none" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Bar
            dataKey="Completed"
            stackId="a"
            fill="#2DD4BF"
            radius={[10, 10, 10, 10]}
          />
          <Bar
            dataKey="Pending"
            stackId="a"
            fill="#D8B4FE"
            radius={[10, 10, 10, 10]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
