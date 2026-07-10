import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Filter } from "lucide-react";
import { categoryApi } from "../api/category.api.js";
import { workerApi } from "../api/worker.api.js";
import WorkerCard from "../components/WorkerCard.jsx";

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    category_id: searchParams.get("category_id") || "",
    pincode: searchParams.get("pincode") || "",
  });

  useEffect(() => {
    categoryApi.list().then((res) => setCategories(res.data.categories));
  }, []);

  const runSearch = async (params) => {
    setLoading(true);
    setError("");
    try {
      const res = await workerApi.discover(params);
      setWorkers(res.data.workers);
    } catch (err) {
      setError(err.message || "Failed to load workers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch(filters);
     
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    );
    runSearch(filters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Find a local worker
        </h1>
        <p className="text-gray-600 mt-1">
          Verified workers ranked by nearness, rating, and reliability.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-6"
      >
        <div className="flex items-center gap-2 flex-1 px-3 border border-gray-200 rounded-lg">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filters.category_id}
            onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
            className="w-full py-2 outline-none bg-transparent"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1 px-3 border border-gray-200 rounded-lg">
          <MapPin size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Pincode"
            value={filters.pincode}
            onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
            className="w-full py-2 outline-none bg-transparent"
          />
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition flex items-center justify-center gap-2">
          <Search size={16} /> Search
        </button>
      </form>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading workers...</div>
      ) : workers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-600">No workers found in this area yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Try a different pincode or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
        </div>
      )}
    </div>
  );
}