import { useEffect, useState } from "react";
import {
  Users, UserCheck, Briefcase, Star, ShieldAlert,
  Ban, CheckCircle2, Clock,
} from "lucide-react";
import { adminApi } from "../../api/admin.api.js";
import StatCard from "../../components/admin/StatCard.jsx";
import SimpleLineChart from "../../components/admin/SimpleLineChart.jsx";
import SimpleBarChart from "../../components/admin/SimpleBarChart.jsx";
import StarRating from "../../components/StarRating.jsx";

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.analytics()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading...</div>;
  if (!data) return <div className="text-center py-16 text-red-600">Failed to load analytics</div>;

  const { kpis, timeseries, categories, topWorkers } = data;

  const lineData = timeseries.map((t) => ({
    label: new Date(t.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: t.count,
  }));

  const barData = categories.slice(0, 8).map((c) => ({
    label: c.category.length > 8 ? c.category.slice(0, 7) + "…" : c.category,
    value: c.request_count,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-600 text-sm">Platform activity at a glance</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        <StatCard icon={Users}       label="Customers"          value={kpis.total_customers}   tone="blue" />
        <StatCard icon={UserCheck}   label="Approved Workers"   value={kpis.approved_workers}  tone="green" />
        <StatCard icon={Clock}       label="Pending Approval"   value={kpis.pending_workers}   tone="amber" />
        <StatCard icon={Briefcase}   label="Total Requests"     value={kpis.total_requests}    tone="purple" />
        <StatCard icon={CheckCircle2} label="Completed Jobs"    value={kpis.completed_requests} tone="green" />
        <StatCard icon={Briefcase}   label="Active Jobs"        value={kpis.active_requests}   tone="blue" />
        <StatCard icon={Star}        label="Avg Rating"
                  value={Number(kpis.avg_rating).toFixed(2)}    tone="amber" />
        <StatCard icon={ShieldAlert} label="Open Fraud Alerts"  value={kpis.open_alerts}       tone="red" />
        <StatCard icon={Ban}         label="Blocked Users"      value={kpis.blocked_users}     tone="gray" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Requests · last 14 days</h3>
          <SimpleLineChart data={lineData} />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Requests by category</h3>
          <SimpleBarChart data={barData} />
        </div>
      </div>

      {/* Top workers */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Top-rated workers</h3>
        {topWorkers.length === 0 ? (
          <p className="text-sm text-gray-500">No approved workers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-xs uppercase">
                <tr className="text-left">
                  <th className="py-2">Worker</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Rating</th>
                  <th>Jobs</th>
                </tr>
              </thead>
              <tbody>
                {topWorkers.map((w) => (
                  <tr key={w.id} className="border-t border-gray-100">
                    <td className="py-2 font-medium text-gray-800">{w.name}</td>
                    <td className="text-gray-600">{w.category}</td>
                    <td className="text-gray-600">{w.city || "—"} · {w.pincode}</td>
                    <td><StarRating value={Number(w.rating_avg)} size={12} /></td>
                    <td className="text-gray-600">{w.jobs_completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}