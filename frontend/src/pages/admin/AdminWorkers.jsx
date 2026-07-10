import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ExternalLink, RefreshCw } from "lucide-react";
import { adminApi } from "../../api/admin.api.js";
import StarRating from "../../components/StarRating.jsx";

const FILTERS = [
  { key: "",         label: "All" },
  { key: "pending",  label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const badge = (status) => {
  const map = {
    pending:  "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return `text-xs px-2 py-0.5 rounded-full border ${map[status] || ""}`;
};

export default function AdminWorkers() {
  const [status, setStatus] = useState("pending");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.listWorkers({ status })
      .then((res) => setWorkers(res.data.workers))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  const act = async (id, newStatus) => {
    setBusyId(id);
    try {
      await adminApi.setVerification(id, newStatus);
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workers</h1>
          <p className="text-sm text-gray-600">Verify, approve or reject worker profiles</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1 text-sm border border-gray-300 hover:border-blue-500 px-3 py-1.5 rounded-lg"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key || "all"}
            onClick={() => setStatus(f.key)}
            className={`text-sm px-3 py-1.5 rounded-lg border ${
              status === f.key
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
      ) : workers.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl">
          <p className="text-gray-600">No workers in this bucket.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workers.map((w) => (
            <div key={w.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-gray-900">{w.name}</h3>
                  <p className="text-sm text-gray-600">{w.category_name}</p>
                </div>
                <span className={badge(w.verification_status)}>
                  {w.verification_status}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-700 space-y-0.5">
                <p>📧 {w.email} {w.phone && <>· 📞 {w.phone}</>}</p>
                <p>📍 {w.city || "—"}, {w.state || "—"} · {w.pincode}</p>
                <p>💼 {w.experience_years}y exp</p>
                <p className="flex items-center gap-2">
                  <StarRating value={Number(w.rating_avg) || 0} size={12} />
                  <span className="text-xs text-gray-500">
                    · {w.total_reviews} reviews · {w.jobs_completed} jobs
                  </span>
                </p>
                {w.bio && <p className="mt-1 text-gray-600 line-clamp-2">{w.bio}</p>}
                {w.id_proof_url && (
                  <a href={w.id_proof_url} target="_blank" rel="noreferrer"
                     className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm">
                    View ID proof <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <div className="mt-3 flex gap-2 flex-wrap">
                {w.verification_status !== "approved" && (
                  <button
                    onClick={() => act(w.id, "approved")}
                    disabled={busyId === w.id}
                    className="text-sm bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                )}
                {w.verification_status !== "rejected" && (
                  <button
                    onClick={() => act(w.id, "rejected")}
                    disabled={busyId === w.id}
                    className="text-sm border border-gray-300 hover:border-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}