import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { workerApi } from "../api/worker.api.js";
import { requestApi } from "../api/request.api.js";

export default function BookService() {
  const { workerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [form, setForm] = useState({
    description: "",
    address: "",
    pincode: "",
    scheduled_date: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    workerApi.getById(workerId).then((res) => setWorker(res.data.worker));
  }, [workerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setSubmitting(true);
    setError("");
    try {
      await requestApi.create({
        worker_id: worker.user_id,
        category_id: worker.category_id,
        description: form.description,
        address: form.address,
        pincode: form.pincode,
        scheduled_date: form.scheduled_date
          ? new Date(form.scheduled_date).toISOString()
          : undefined,
      });
      navigate("/customer");
    } catch (err) {
      setError(err.message || "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  if (!worker) return <div className="text-center py-16 text-gray-500">Loading...</div>;

  const input = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-gray-900">Book {worker.name}</h1>
        <p className="text-sm text-gray-500">{worker.category_name}</p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Describe the job</label>
            <textarea required rows={3} className={input}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Kitchen sink is leaking" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
              <input required className={`${input} pl-9`}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Pincode</label>
              <input required className={input}
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Preferred date</label>
              <div className="relative">
                <CalendarDays size={16} className="absolute left-3 top-3 text-gray-400" />
                <input type="datetime-local" className={`${input} pl-9`}
                  value={form.scheduled_date}
                  onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg">
            💡 Payment is handled offline directly with the worker after the job.
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg">
            {submitting ? "Sending request..." : "Send request"}
          </button>
        </form>
      </div>
    </div>
  );
}