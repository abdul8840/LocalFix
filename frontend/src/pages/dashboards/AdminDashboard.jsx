import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Panel — {user?.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Manage users, verify workers, review reports.
        </p>
        <p className="mt-6 text-sm text-gray-500">
          Full analytics and controls — coming in Step 4.
        </p>
      </div>
    </div>
  );
}