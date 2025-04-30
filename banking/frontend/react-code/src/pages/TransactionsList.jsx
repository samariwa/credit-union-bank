import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("All Transactions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("payment");
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [business, setBusiness] = useState("");
  const [fromAccountSuggestions, setFromAccountSuggestions] = useState([]);
  const [toAccountSuggestions, setToAccountSuggestions] = useState([]);
  const [businessSuggestions, setBusinessSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/transactions/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (activeTab === "All Transactions") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (txn) => txn.transaction_type === activeTab.toLowerCase()
      );
      setFilteredTransactions(filtered);
    }
  }, [activeTab, transactions]);

  const fetchAccountSuggestions = async (query, type) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/accounts/?name__icontains=${query}&type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching account suggestions: ${response.status}`
        );
      }

      const data = await response.json();
      if (type === "from") {
        setFromAccountSuggestions(
          data.filter(
            (acc, index, self) =>
              index === self.findIndex((t) => t.name === acc.name)
          )
        ); // Remove duplicates
      } else if (type === "to") {
        setToAccountSuggestions(
          data.filter(
            (acc, index, self) =>
              index === self.findIndex((t) => t.name === acc.name)
          )
        ); // Remove duplicates
      }
    } catch (error) {
      console.error("Failed to fetch account suggestions:", error);
    }
  };

  const fetchBusinessSuggestions = async (query) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://127.0.0.1:8000/api/businesses/?name__icontains=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching business suggestions: ${response.status}`);
      }

      const data = await response.json();
      setBusinessSuggestions(data.filter((biz, index, self) =>
        index === self.findIndex((t) => t.name === biz.name)
      )); // Remove duplicates
    } catch (error) {
      console.error("Failed to fetch business suggestions:", error);
    }
  };

  const handleAccountInputChange = (e, setAccount, type) => {
    const query = e.target.value;
    setAccount(query);
    if (query.length > 1) {
      fetchAccountSuggestions(query, type);
    } else {
      if (type === "from") {
        setFromAccountSuggestions([]); // Clear suggestions if query is too short
      } else if (type === "to") {
        setToAccountSuggestions([]); // Clear suggestions if query is too short
      }
    }
  };

  const handleAccountSelect = (accountName, setAccount, type) => {
    const selectedAccount = (
      type === "from" ? fromAccountSuggestions : toAccountSuggestions
    ).find((acc) => acc.name === accountName);
    if (selectedAccount) {
      setAccount(`${selectedAccount.id} (${selectedAccount.name})`); // Set the account number with name in brackets
      if (type === "from") {
        setFromAccountSuggestions([]); // Clear suggestions
      } else if (type === "to") {
        setToAccountSuggestions([]); // Clear suggestions
      }
    }
  };

  const handleBusinessInputChange = (e) => {
    const query = e.target.value;
    setBusiness(query);
    if (query.length > 1) {
      fetchBusinessSuggestions(query);
    } else {
      setBusinessSuggestions([]); // Clear suggestions if query is too short
    }
  };

  const handleBusinessSelect = (businessName) => {
    const selectedBusiness = businessSuggestions.find((biz) => biz.name === businessName);
    if (selectedBusiness) {
      setBusiness(`${selectedBusiness.id} (${selectedBusiness.name})`); // Set the business ID with name in brackets
      setBusinessSuggestions([]); // Clear suggestions
    }
  };

  const handleCreateTransaction = async () => {
    try {
      const extractId = (value) => {
        const match = value.match(/^\S+/); // Extract the ID before the brackets
        return match ? match[0] : value;
      };

      const fromAccountId = extractId(fromAccount);
      const toAccountId = toAccount ? extractId(toAccount) : null;
      const businessId = business ? extractId(business) : null;

      if (!fromAccountId) {
        alert("Invalid 'From Account' name.");
        return;
      }

      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/transactions/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_type: transactionType,
          amount,
          from_account: fromAccountId,
          to_account: toAccountId,
          business: businessId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Close modal and refresh transactions
      setIsModalOpen(false);
      const data = await response.json();
      setTransactions((prev) => [...prev, data]);
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "Transactions" }]} />
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{activeTab}</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:text-gray-800"
            >
              <span className="mr-2 text-xl">+</span> New Transaction
            </button>
          </div>
          <div className="flex space-x-4 mb-4">
            {[
              "All Transactions",
              "Payment",
              "Withdrawal",
              "Deposit",
              "Collect Round_Up",
              "Transfer",
              "Roundup_Reclaim",
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
                <th className="py-2 px-4 font-medium text-gray-700">#</th>
                <th className="py-2 px-4 font-medium text-gray-700">Type</th>
                <th className="py-2 px-4 font-medium text-gray-700">Amount</th>
                <th className="py-2 px-4 font-medium text-gray-700">
                  Timestamp
                </th>
                <th className="py-2 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-700">{txn.id}</td>
                  <td className="py-2 px-4 text-gray-700">
                    {txn.transaction_type}
                  </td>
                  <td className="py-2 px-4 text-gray-700">£{txn.amount}</td>
                  <td className="py-2 px-4 text-gray-700">
                    {new Date(txn.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-gray-700">
                    <button
                      onClick={() => navigate(`/transaction/${txn.id}`)}
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full">
            <h2 className="text-xl font-semibold mb-4">
              Create New Transaction
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Transaction Type
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="payment">Payment</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="deposit">Deposit</option>
                <option value="collect_roundup">Collect Roundup</option>
                <option value="transfer">Transfer</option>
                <option value="roundup_reclaim">Round Up Reclaim</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="£"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center mb-4 relative">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  From Account
                </label>
                <input
                  type="text"
                  value={fromAccount}
                  onChange={(e) =>
                    handleAccountInputChange(e, setFromAccount, "from")
                  }
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                {fromAccountSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                    {fromAccountSuggestions.map((acc) => (
                      <li
                        key={acc.id}
                        onClick={() =>
                          handleAccountSelect(acc.name, setFromAccount, "from")
                        }
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {acc.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mx-2 text-gray-500">→</div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  To Account (Optional)
                </label>
                <input
                  type="text"
                  value={toAccount}
                  onChange={(e) => handleAccountInputChange(e, setToAccount, "to")}
                  className={`w-full mt-1 px-4 py-2 border rounded-md ${transactionType !== "transfer" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "border-gray-300"}`}
                  readOnly={transactionType !== "transfer"}
                />
                {toAccountSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                    {toAccountSuggestions.map((acc) => (
                      <li
                        key={acc.id}
                        onClick={() =>
                          handleAccountSelect(acc.name, setToAccount, "to")
                        }
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {acc.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">Business (Optional)</label>
              <input
                type="text"
                value={business}
                onChange={handleBusinessInputChange}
                className={`w-full mt-1 px-4 py-2 border rounded-md ${transactionType !== "transfer" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "border-gray-300"}`}
                readOnly={transactionType !== "transfer"}
              />
              {businessSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                  {businessSuggestions.map((biz) => (
                    <li
                      key={biz.id}
                      onClick={() => handleBusinessSelect(biz.name)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {biz.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTransaction}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
