import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Briefcase, Phone, Mail, ArrowLeft } from "lucide-react";
import { workerApi } from "../api/worker.api.js";
import StarRating from "../components/StarRating.jsx";

export default function WorkerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    workerApi
      .getById(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>;
  if (!data) return null;

  const { worker, reviews } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/services" className="inline-flex items-center gap-1 text-sm text-blue-600 mb-4">
        <ArrowLeft size={16} /> Back to search
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{worker.name}</h1>
            <p className="text-gray-600">{worker.category_name}</p>
            <div className="mt-2">
              <StarRating value={Number(worker.rating_avg) || 0} />
              <span className="text-xs text-gray-500 ml-2">
                ({worker.total_reviews} reviews • {worker.jobs_completed} jobs completed)
              </span>
            </div>
          </div>
          <Link
            to={`/book/${worker.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg"
          >
            Book this worker
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2"><Briefcase size={16} /> {worker.experience_years} years experience</div>
          <div className="flex items-center gap-2"><MapPin size={16} /> {worker.city || "—"}, {worker.pincode}</div>
          <div className="flex items-center gap-2"><Phone size={16} /> {worker.phone || "—"}</div>
          <div className="flex items-center gap-2"><Mail size={16} /> {worker.email}</div>
        </div>

        {worker.bio && (
          <div className="mt-5">
            <h3 className="font-semibold text-gray-900 mb-1">About</h3>
            <p className="text-gray-700 text-sm">{worker.bio}</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold text-gray-900 mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{r.customer_name}</span>
                  <StarRating value={r.rating} size={14} showValue={false} />
                </div>
                {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}