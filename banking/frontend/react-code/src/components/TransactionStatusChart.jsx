import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function TransactionStatusChart({ data }) {
  const COLORS = ["#2DD4BF", "#D8B4FE", "#F87171", "#60A5FA", "#FBBF24"];

  return (
    <div className="bg-[#111111] rounded-xl p-4 shadow-lg w-full h-[800px]">
      {/* Reduced padding and increased height */}
      <h2 className="text-white text-2xl font-semibold mb-4">Top Spenders</h2>

      <ResponsiveContainer width="100%" height="90%">
        {/* Increased chart size */}
        <PieChart>
          <Pie
            data={data}
            dataKey="total_spent"
            nameKey="from_account__name"
            cx="50%"
            cy="50%"
            outerRadius={200} // Increased radius
            fill="#8884d8"
            label={(entry) =>
              `${entry.from_account__name}: £${entry.total_spent}`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#222", border: "none" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
