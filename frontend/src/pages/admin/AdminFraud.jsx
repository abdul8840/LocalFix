import { useEffect, useState } from "react";
import { ShieldAlert, Play, CheckCircle2, Ban } from "lucide-react";
import { fraudApi } from "../../api/fraud.api.js";
import { adminApi } from "../../api/admin.api.js";

const FILTERS = [
  { key: "false", label: "Open" },
  { key: "true",  label: "Resolved" },
  { key: "",      label: "All" },
];

const sevBadge = (s) => {
  const map = {
    high:   "bg-red-100 text-red-800 border-red-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low:    "bg-gray-100 text-gray-700 border-gray-200",
  };
  return `text-xs px-2 py-0.5 rounded-full border ${map[s] || map.low}`;
};

export default function AdminFraud() {
  const [resolved, setResolved] = useState("false");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    fraudApi.list(resolved || undefined)
      .then((res) => setAlerts(res.data.alerts))
      .finally(() => setLoading(false));
  };

  useEffect(load, [resolved]);

  const runScan = async () => {
    setScanning(true);
    setMsg("");
    try {
      const res = await fraudApi.scan();
      setMsg(`✅ Scan complete — ${res.data.new_alerts} new alert(s)`);
      load();
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setScanning(false);
    }
  };

  const resolve = async (id) => { await fraudApi.resolve(id); load(); };
  const block   = async (userId) => {
    await adminApi.setBlocked(userId, true);
    setMsg("🚫 Worker account blocked");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert size={22} className="text-red-600" /> Fraud Alerts
          </h1>
          <p className="text-sm text-gray-600">
            Automated detection based on ratings, cancellations & inactivity
          </p>
        </div>
        <button
          onClick={runScan}
          disabled={scanning}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2"
        >
          <Play size={14} /> {scanning ? "Scanning..." : "Run scan"}
        </button>
      </div>

      {msg && (
        <div className="bg-gray-50 border border-gray-200 text-sm px-3 py-2 rounded-lg">
          {msg}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setResolved(f.key)}
            className={`text-sm px-3 py-1.5 rounded-lg border ${
              resolved === f.key
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl">
          <p className="text-gray-600">No alerts. Run a scan to check the platform.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a.id} className={`bg-white border rounded-2xl p-4 ${
              a.resolved ? "border-gray-200 opacity-70" : "border-red-100"
            }`}>
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={sevBadge(a.severity)}>{a.severity}</span>
                    {a.resolved && (
                      <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                        resolved
                      </span>
                    )}
                    {a.is_blocked && (
                      <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
                        blocked
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-semibold text-gray-900">{a.worker_name}</p>
                  <p className="text-xs text-gray-500">{a.worker_email}</p>
                  <p className="mt-2 text-sm text-gray-800">{a.reason}</p>
                  {a.rating_avg !== null && (
                    <p className="text-xs text-gray-500 mt-1">
                      Rating: {Number(a.rating_avg).toFixed(2)} · {a.total_reviews} reviews
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>

                {!a.resolved && (
                  <div className="flex gap-2 flex-wrap">
                    {!a.is_blocked && (
                      <button
                        onClick={() => block(a.worker_id)}
                        className="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Ban size={14} /> Block worker
                      </button>
                    )}
                    <button
                      onClick={() => resolve(a.id)}
                      className="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 size={14} /> Resolve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}