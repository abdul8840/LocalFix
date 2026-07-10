import { useEffect, useState } from "react";
import { Flag, Trash2, ShieldCheck } from "lucide-react";
import { adminApi } from "../../api/admin.api.js";
import StarRating from "../../components/StarRating.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

const FILTERS = [
  { key: "",      label: "All" },
  { key: "true",  label: "Flagged" },
  { key: "false", label: "Unflagged" },
];

export default function AdminReviews() {
  const [flagged, setFlagged] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.listReviews({ flagged: flagged || undefined })
      .then((res) => setReviews(res.data.reviews))
      .finally(() => setLoading(false));
  };

  useEffect(load, [flagged]);

  const toggleFlag = async (r) => {
    await adminApi.flagReview(r.id, !r.is_flagged);
    load();
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    await adminApi.deleteReview(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-600">Moderate customer reviews</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key || "all"}
            onClick={() => setFlagged(f.key)}
            className={`text-sm px-3 py-1.5 rounded-lg border ${
              flagged === f.key
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
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl">
          <p className="text-gray-600">No reviews to show.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className={`bg-white border rounded-2xl p-4 ${
              r.is_flagged ? "border-red-200" : "border-gray-200"
            }`}>
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <StarRating value={r.rating} size={14} showValue={false} />
                    {r.is_flagged && (
                      <span className="text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                        Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 mt-1">
                    <span className="font-medium">{r.customer_name}</span> →{" "}
                    <span className="font-medium">{r.worker_name}</span>
                  </p>
                  {r.comment && (
                    <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFlag(r)}
                    className={`text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
                      r.is_flagged
                        ? "border-green-300 text-green-700 hover:bg-green-50"
                        : "border-amber-300 text-amber-700 hover:bg-amber-50"
                    }`}
                  >
                    {r.is_flagged
                      ? <><ShieldCheck size={14} /> Unflag</>
                      : <><Flag size={14} /> Flag</>}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(r)}
                    className="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this review?"
        message="This action is permanent and cannot be undone."
        confirmLabel="Delete"
        danger
        onClose={() => setDeleteTarget(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}