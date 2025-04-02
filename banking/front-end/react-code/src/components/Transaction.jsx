import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import React from "react";

const data = [
  { name: "Mon", value: 2200 },
  { name: "Tue", value: 1200 },
  { name: "Wed", value: 2300 },
  { name: "Thu", value: 4500 },
  { name: "Fri", value: 3450 },
  { name: "Sat", value: 4100 },
  { name: "Sun", value: 2800 },
];

// 彩色渐变
const colorStops = [
  { id: "grad-0", from: "#A855F7", to: "#6366F1" },
  { id: "grad-1", from: "#2DD4BF", to: "#10B981" },
  { id: "grad-2", from: "#EC4899", to: "#9333EA" },
  { id: "grad-3", from: "#22D3EE", to: "#14B8A6" },
  { id: "grad-4", from: "#3B82F6", to: "#6366F1" },
  { id: "grad-5", from: "#8B5CF6", to: "#4F46E5" },
  { id: "grad-6", from: "#06B6D4", to: "#0EA5E9" },
];

export default function TransactionsChart() {
  return (
    <div className="bg-[#111111] rounded-xl p-6 shadow-lg w-full h-[300px]">
      <h1 className="text-white text-[50px] font-semibold mb-4">
        Transactions
      </h1>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#222", border: "none" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
            ))}
          </Bar>
          <defs>
            {colorStops.map((grad, index) => (
              <linearGradient
                key={grad.id}
                id={`grad-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={grad.from} />
                <stop offset="100%" stopColor={grad.to} />
              </linearGradient>
            ))}
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
