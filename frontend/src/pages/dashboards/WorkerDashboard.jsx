import { useEffect, useState } from "react";
import { Briefcase, CheckCircle2, XCircle, Play, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { workerApi } from "../../api/worker.api.js";
import { requestApi } from "../../api/request.api.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import StarRating from "../../components/StarRating.jsx";

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAvail, setSavingAvail] = useState(false);
  const [pricingFor, setPricingFor] = useState(null);
  const [priceInput, setPriceInput] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, j] = await Promise.all([workerApi.me(), requestApi.assigned()]);
      setProfile(p.data.profile);
      setReviews(p.data.reviews);
      setJobs(j.data.requests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const toggleAvailability = async () => {
    setSavingAvail(true);
    try {
      const res = await workerApi.updateMe({ availability: !profile.availability });
      setProfile(res.data.profile);
    } finally {
      setSavingAvail(false);
    }
  };

  const setStatus = async (job, status, extras) => {
    await requestApi.updateStatus(job.id, { status, ...extras });
    setPricingFor(null);
    setPriceInput("");
    loadAll();
  };

  const complete = (job) => {
    setPricingFor(job);
    setPriceInput("");
  };

  const confirmComplete = () => {
    setStatus(pricingFor, "completed", {
      price: priceInput ? Number(priceInput) : undefined,
      payment_status: "paid_offline",
    });
  };

  if (loading) return <div className="text-center py-16 text-gray-500">Loading...</div>;
  if (!profile) return <div className="text-center py-16 text-gray-500">No profile found.</div>;

  const verification = profile.verification_status;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hi, {user?.name} 🛠️</h1>
            <p className="text-gray-600">{profile.category_name} • {profile.pincode}</p>
            <div className="mt-2 flex items-center gap-3">
              <StarRating value={Number(profile.rating_avg) || 0} />
              <span className="text-xs text-gray-500">
                {profile.total_reviews} reviews • {profile.jobs_completed} jobs
              </span>
            </div>
          </div>

          <div className="text-right">
            {verification === "approved" && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">
                <CheckCircle2 size={12} /> Verified
              </span>
            )}
            {verification === "pending" && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full">
                ⏳ Pending verification
              </span>
            )}
            {verification === "rejected" && (
              <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-full">
                <XCircle size={12} /> Rejected
              </span>
            )}

            <div className="mt-3">
              <button
                onClick={toggleAvailability}
                disabled={savingAvail}
                className={`text-sm px-3 py-1.5 rounded-lg border transition ${
                  profile.availability
                    ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {profile.availability ? "🟢 Available" : "⚪ Unavailable"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase size={18} /> Your jobs
        </h2>

        {jobs.length === 0 ? (
          <p className="text-sm text-gray-500">No jobs yet. New requests will show up here.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {j.category_name} • {j.customer_name}
                    </h3>
                    <p className="text-sm text-gray-600">{j.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      📍 {j.address}, {j.pincode} • 📞 {j.customer_phone || "—"}
                    </p>
                  </div>
                  <StatusBadge status={j.status} />
                </div>

                <div className="mt-3 flex gap-2 flex-wrap">
                  {j.status === "pending" && (
                    <>
                      <button onClick={() => setStatus(j, "accepted")}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                        <CheckCircle2 size={14} /> Accept
                      </button>
                      <button onClick={() => setStatus(j, "rejected")}
                        className="text-sm border border-gray-300 hover:border-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                        <XCircle size={14} /> Reject
                      </button>
                    </>
                  )}
                  {j.status === "accepted" && (
                    <button onClick={() => setStatus(j, "in_progress")}
                      className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                      <Play size={14} /> Start job
                    </button>
                  )}
                  {j.status === "in_progress" && (
                    <button onClick={() => complete(j)}
                      className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                      <CheckCircle2 size={14} /> Mark complete
                    </button>
                  )}
                  {j.price && (
                    <span className="text-sm text-gray-700 font-medium">
                      ₹{j.price} • {j.payment_status === "paid_offline" ? "Paid" : "Unpaid"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star size={18} /> Customer reviews
        </h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{r.customer_name}</span>
                  <StarRating value={r.rating} size={14} showValue={false} />
                </div>
                {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price modal */}
      {pricingFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-1">Mark job complete</h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter the amount the customer paid (offline).
            </p>
            <input type="number" min={0} placeholder="Amount in ₹"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={() => setPricingFor(null)}
                className="flex-1 border border-gray-300 py-2 rounded-lg">
                Cancel
              </button>
              <button onClick={confirmComplete}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}