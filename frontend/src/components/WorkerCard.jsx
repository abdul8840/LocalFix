import { Link } from "react-router-dom";
import { MapPin, Briefcase, Sparkles, AlertTriangle } from "lucide-react";
import StarRating from "./StarRating.jsx";

export default function WorkerCard({ worker }) {
  const lowRated = worker.total_reviews >= 3 && worker.rating_avg < 2.5;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{worker.name}</h3>
          <p className="text-sm text-gray-500">{worker.category_name}</p>
        </div>
        {worker.match_score !== undefined && (
          <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">
            <Sparkles size={12} /> {Math.round(worker.match_score * 100)}% match
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <StarRating value={Number(worker.rating_avg) || 0} />
        <span className="text-xs text-gray-500">
          ({worker.total_reviews} reviews)
        </span>
      </div>

      {lowRated && (
        <div className="mt-2 inline-flex items-center gap-1 text-xs text-red-600">
          <AlertTriangle size={12} /> Low rated — read reviews carefully
        </div>
      )}

      <div className="mt-3 text-sm text-gray-600 flex items-center gap-4">
        <span className="inline-flex items-center gap-1">
          <Briefcase size={14} /> {worker.experience_years}y exp
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} />
          {worker.city ? `${worker.city} • ` : ""}{worker.pincode}
        </span>
      </div>

      {worker.distance_km !== null && worker.distance_km !== undefined && (
        <p className="text-xs text-gray-500 mt-1">
          ~{worker.distance_km} km away
        </p>
      )}

      {worker.bio && (
        <p className="mt-3 text-sm text-gray-700 line-clamp-2">{worker.bio}</p>
      )}

      <div className="mt-4 flex gap-2">
        <Link
          to={`/workers/${worker.id}`}
          className="flex-1 text-center text-sm font-medium border border-gray-300 hover:border-blue-500 hover:text-blue-600 py-2 rounded-lg transition"
        >
          View
        </Link>
        <Link
          to={`/book/${worker.id}`}
          className="flex-1 text-center text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          Book
        </Link>
      </div>
    </div>
  );
}