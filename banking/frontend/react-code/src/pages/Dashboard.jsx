import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CardRow from "../components/Card"; // renamed from Card to CardRow
import Transaction from "../components/Transaction";
import TopBusinessCustomers from "../components/TopBusinessCustomers";
import TransactionStatusChart from "../components/TransactionStatusChart";
import FlaggedTransactions from "../components/FlaggedTransactions";

export default function DashboardLayout() {
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const isAdmin = userInfo.is_staff;
  const [spendingSummary, setSpendingSummary] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [topBusinessCustomers, setTopBusinessCustomers] = useState([]);
  const [sanctionedBusinessReport, setSanctionedBusinessReport] = useState([]);
  const [topSpenders, setTopSpenders] = useState([]); // State for top spenders

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

  return (
    <div className="flex min-h-screen text-white bg-[#0f0f0f]">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto grid grid-cols-[2fr_1.2fr] gap-6 ml-[300px]">
        {/* Left Column */}
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-6">
            <CardRow />
            {!isAdmin ? null : (
              <div className="bg-[#111111] rounded-xl p-6 shadow-lg w-full">
                <TransactionStatusChart data={topSpenders} />
              </div>
            )}
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
                      <tr
                        key={account.id}
                        className="border-b hover:bg-gray-800"
                      >
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
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-between h-[1100px]">
          {!isAdmin && (
            <div className="bg-[#111111] rounded-xl p-6 shadow-lg w-full">
              <h2 className="text-white text-4xl font-semibold mb-4">
                Spending Summary
              </h2>
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 font-medium text-gray-400">
                      Account Name
                    </th>
                    <th className="py-2 px-4 font-medium text-gray-400">
                      Business Category
                    </th>
                    <th className="py-2 px-4 font-medium text-gray-400">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {spendingSummary.map((item) =>
                    item.summary.map((summaryItem, index) => (
                      <tr
                        key={`${item.accountId}-${index}`}
                        className="border-b hover:bg-gray-800"
                      >
                        <td className="py-2 px-4 text-gray-300">
                          {accounts.find((acc) => acc.id === item.accountId)
                            ?.name || "Unknown Account"}
                        </td>
                        <td className="py-2 px-4 text-gray-300">
                          {summaryItem.business__category || "Uncategorized"}
                        </td>
                        <td className="py-2 px-4 text-gray-300">
                          £{summaryItem.total}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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
