import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { requestApi } from "../../api/request.api.js";
import { reviewApi } from "../../api/review.api.js";
import StatusBadge from "../../components/StatusBadge.jsx";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewFor, setReviewFor] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    requestApi.mine()
      .then((res) => setRequests(res.data.requests))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    await requestApi.updateStatus(id, { status: "cancelled" });
    load();
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewApi.create({
        request_id: reviewFor.id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setMsg("✅ Review submitted");
      setReviewFor(null);
      setReviewForm({ rating: 5, comment: "" });
      load();
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600 text-sm">Track your service requests</p>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
        >
          <PlusCircle size={16} /> Book a new service
        </Link>
      </div>

      {msg && (
        <div className="mb-4 bg-gray-50 border border-gray-200 text-sm px-3 py-2 rounded-lg">{msg}</div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl">
          <p className="text-gray-600">You haven't booked any services yet.</p>
          <Link to="/services" className="text-blue-600 hover:underline text-sm">
            Browse workers →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {r.category_name} • {r.worker_name}
                  </h3>
                  <p className="text-sm text-gray-600">{r.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {r.address} • {r.pincode} •{" "}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="mt-3 flex gap-2 flex-wrap">
                {["pending", "accepted"].includes(r.status) && (
                  <button
                    onClick={() => cancel(r.id)}
                    className="text-sm border border-gray-300 hover:border-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
                {r.status === "completed" && !r.has_review && (
                  <button
                    onClick={() => setReviewFor(r)}
                    className="text-sm bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                  >
                    <Star size={14} /> Leave a review
                  </button>
                )}
                {r.status === "completed" && r.has_review && (
                  <span className="text-xs text-green-600">✅ Reviewed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review modal */}
      {reviewFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 mb-1">
              Review {reviewFor.worker_name}
            </h3>
            <p className="text-xs text-gray-500 mb-4">{reviewFor.category_name}</p>
            <form onSubmit={submitReview} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Rating</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Comment (optional)</label>
                <textarea rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setReviewFor(null)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}