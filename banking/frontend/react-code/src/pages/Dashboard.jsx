import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CardRow from "../components/Card"; // renamed from Card to CardRow
import Transaction from "../components/Transaction";
import TopBusinessCustomers from "../components/TopBusinessCustomers";
import TransactionStatusChart from "../components/TransactionStatusChart";
import FlaggedTransactions from "../components/FlaggedTransactions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardLayout() {
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const isAdmin = userInfo.is_staff;
  const [spendingSummary, setSpendingSummary] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [topBusinessCustomers, setTopBusinessCustomers] = useState([]);
  const [sanctionedBusinessReport, setSanctionedBusinessReport] = useState([]);
  const [topSpenders, setTopSpenders] = useState([]); // State for top spenders
  const [totalSpent, setTotalSpent] = useState(0); // State for total spent

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!isAdmin) {
          // Fetch accounts for non-admin users
          const accountsResponse = await fetch(
            "http://127.0.0.1:8000/api/accounts/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!accountsResponse.ok) {
            throw new Error("Failed to fetch accounts");
          }

          const accountsData = await accountsResponse.json();
          const userAccounts = accountsData.filter(
            (account) => account.user_details?.id === userInfo.id
          );
          setAccounts(userAccounts);

          // Fetch spending summaries for each account
          const summaries = [];
          for (const account of userAccounts) {
            const summaryResponse = await fetch(
              `http://127.0.0.1:8000/api/transactions/spending-summary/${account.id}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!summaryResponse.ok) {
              throw new Error(
                `Failed to fetch spending summary for account ${account.id}`
              );
            }

            const summaryData = await summaryResponse.json();
            summaries.push({ accountId: account.id, summary: summaryData });
          }

          setSpendingSummary(summaries);
        } else {
          // Fetch sanctioned business report for admin users
          const reportResponse = await fetch(
            "http://127.0.0.1:8000/api/transactions/sanctioned-business-report/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!reportResponse.ok) {
            throw new Error("Failed to fetch sanctioned business report");
          }

          const reportData = await reportResponse.json();
          setSanctionedBusinessReport(reportData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isAdmin, userInfo.id]);

  useEffect(() => {
    const fetchTopSpenders = async () => {
      try {
        if (isAdmin) {
          const token = localStorage.getItem("access_token");
          const response = await fetch(
            "http://127.0.0.1:8000/api/transactions/top-10-spenders/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch top spenders");
          }

          const data = await response.json();
          setTopSpenders(data);
        }
      } catch (error) {
        console.error("Error fetching top spenders:", error);
      }
    };

    fetchTopSpenders();
  }, [isAdmin]);

  useEffect(() => {
    const fetchTotalSpent = async () => {
      try {
        if (!isAdmin) {
          const token = localStorage.getItem("access_token");
          let total = 0;

          for (const account of accounts) {
            const response = await fetch(
              `http://127.0.0.1:8000/api/transactions/spending-summary/${account.id}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch spending summary");
            }

            const data = await response.json();
            total += data.reduce((sum, item) => sum + item.total, 0);
          }

          setTotalSpent(total);
        }
      } catch (error) {
        console.error("Error fetching total spent:", error);
      }
    };

    if (!isAdmin && accounts.length > 0) {
      fetchTotalSpent();
    }
  }, [isAdmin, accounts]);

  const transformSpendingSummaryToChartData = (spendingSummary) => {
    return spendingSummary.map((item) => {
      const account = accounts.find((acc) => acc.id === item.accountId);
      const transformed = {
        accountName: account ? account.name : item.accountId,
      };
      item.summary.forEach((s) => {
        transformed[s.business__category] = s.total;
      });
      return transformed;
    });
  };

  return (
    <div className="flex min-h-screen text-white bg-[#0f0f0f]">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto grid grid-cols-[2fr_1.2fr] gap-6 ml-[300px]">
        {/* Left Column */}
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-6">
            <CardRow totalSpent={totalSpent} />
            {!isAdmin ? null : (
              <div className="bg-[#111111] rounded-xl p-6 shadow-lg w-full">
                <h2 className="text-white text-4xl font-semibold mb-4">
                  Top Spenders Pie Chart
                </h2>
                <TransactionStatusChart data={topSpenders} />
              </div>
            )}
            {!isAdmin && (
              <div className="bg-[#111111] rounded-xl p-6 shadow-lg w-full">
                <h2 className="text-white text-4xl font-semibold mb-4">
                  Spending Summary
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={transformSpendingSummaryToChartData(spendingSummary)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="accountName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Array.from(
                      new Set(
                        spendingSummary.flatMap((item) =>
                          item.summary.map((s) => s.business__category)
                        )
                      )
                    ).map((category, index) => (
                      <Bar
                        key={category}
                        dataKey={category}
                        stackId="a"
                        fill={`#${Math.floor(Math.random() * 16777215).toString(
                          16
                        )}`}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-between h-[1100px]">
          {!isAdmin ? (
            <div className="bg-[#111111] rounded-xl p-6 shadow-lg w-full">
              <h2 className="text-white text-4xl font-semibold mb-4">
                Accounts
              </h2>
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 font-medium text-gray-400">
                      Account
                    </th>
                    <th className="py-2 px-4 font-medium text-gray-400">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id} className="border-b hover:bg-gray-800">
                      <td className="py-2 px-4 text-gray-300">
                        <div>{account.name}</div>
                        <div className="text-sm text-gray-500">
                          {account.id}
                        </div>
                      </td>
                      <td className="py-2 px-4 text-gray-300">
                        £{account.current_balance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          <div>
            {/* <FlaggedTransactions /> */}
            {isAdmin && (
              <div className="bg-[#111111] rounded-xl p-6 shadow-lg w-full">
                <h2 className="text-white text-4xl font-semibold mb-4">
                  Sanctioned Business Report
                </h2>
                <table className="table-auto w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 font-medium text-gray-400">
                        Business Name
                      </th>
                      <th className="py-2 px-4 font-medium text-gray-400">
                        Total Spent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sanctionedBusinessReport.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-800">
                        <td className="py-2 px-4 text-gray-300">
                          {item.business__name}
                        </td>
                        <td className="py-2 px-4 text-gray-300">
                          £{item.total_spent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
