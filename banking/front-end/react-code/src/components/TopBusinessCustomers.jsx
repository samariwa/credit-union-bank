import React from "react";

const customers = [
  {
    name: "Yuli Enterprises",
    amount: "£120,0000",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Yuli",
  },
  {
    name: "Euro Web Services",
    amount: "£990,0000",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=EuroWeb",
  },
];

export default function TopBusinessCustomers() {
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
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-white font-medium">{customer.name}</span>
            </div>
            <span className="text-white text-lg font-semibold">
              {customer.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
