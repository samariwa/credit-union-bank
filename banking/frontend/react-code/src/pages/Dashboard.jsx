import Sidebar from "../components/Sidebar";
import CardRow from "../components/Card"; // renamed from Card to CardRow
import Transaction from "../components/Transaction";
import TopBusinessCustomers from "../components/TopBusinessCustomers";
import TransactionStatusChart from "../components/TransactionStatusChart";
import FlaggedTransactions from "../components/FlaggedTransactions";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen text-white bg-[#0f0f0f]">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto grid grid-cols-[2fr_1.2fr] gap-6 ml-[300px]">
        {/* Left Column */}
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-6">
            <CardRow />
          </div>
          <div>
            <Transaction />
          </div>
          <TopBusinessCustomers />
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-between h-[1100px]">
          <div className="mt-6">
            <TransactionStatusChart />
          </div>
          <div>
            <FlaggedTransactions />
          </div>
        </div>
      </main>
    </div>
  );
}
