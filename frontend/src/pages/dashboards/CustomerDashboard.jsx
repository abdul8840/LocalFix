import { useAuth } from "../../context/AuthContext.jsx";

export default function CustomerDashboard() {
  const { user } = useAuth();
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-gray-600 mt-1">Customer Dashboard</p>
        <p className="mt-6 text-sm text-gray-500">
          Browse services, send requests, and track jobs — coming in Step 3.
        </p>
      </div>
    </div>
  );
}