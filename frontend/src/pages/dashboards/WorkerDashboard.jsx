import { useAuth } from "../../context/AuthContext.jsx";

export default function WorkerDashboard() {
  const { user } = useAuth();
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hello, {user?.name} 🛠️
        </h1>
        <p className="text-gray-600 mt-1">Worker Dashboard</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-sm px-3 py-1 rounded-full">
          Pending admin verification
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Manage jobs and availability — coming in Step 3.
        </p>
      </div>
    </div>
  );
}