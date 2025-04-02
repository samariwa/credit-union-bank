import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto grid grid-cols-2 gap-6">
        {/* Left Column: 3 rows */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg">Left Row 1</div>
          <div className="bg-gray-800 p-4 rounded-lg">Left Row 2</div>
          <div className="bg-gray-800 p-4 rounded-lg">Left Row 3</div>
        </div>

        {/* Right Column: 2 rows */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg">Right Row 1</div>
          <div className="bg-gray-800 p-4 rounded-lg">Right Row 2</div>
        </div>
      </main>
    </div>
  );
}
