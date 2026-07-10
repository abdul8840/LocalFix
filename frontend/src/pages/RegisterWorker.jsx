import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";

export default function RegisterWorker() {
  const { registerWorker } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    category_id: "", experience_years: 0, bio: "",
    pincode: "", city: "", state: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Categories are seeded in schema.sql; we'll expose an endpoint in Step 3.
  // Until then, we hardcode the common categories to keep the form working.
  useEffect(() => {
    setCategories([
      { id: 1, name: "Electrician" },
      { id: 2, name: "Plumber" },
      { id: 3, name: "Painter" },
      { id: 4, name: "Carpenter" },
      { id: 5, name: "AC Repair" },
      { id: 6, name: "Home Cleaning" },
      { id: 7, name: "Mechanic" },
      { id: 8, name: "Mason" },
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerWorker({
        ...form,
        category_id: Number(form.category_id),
        experience_years: Number(form.experience_years),
      });
      navigate("/worker");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500 text-white rounded-xl mb-3">
            <Wrench size={22} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Register as a Worker</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your profile will need admin approval before you appear in searches.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full name</label>
              <input required className={input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input className={input}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" required className={input}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" required minLength={6} className={input}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Service category</label>
              <select required className={input}
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Years of experience</label>
              <input type="number" min={0} max={60} className={input}
                value={form.experience_years}
                onChange={(e) => setForm({ ...form, experience_years: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Pincode</label>
              <input required className={input}
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <input className={input}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">State</label>
              <input className={input}
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Short bio</label>
              <textarea rows={3} className={input}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell customers about your skills and experience..." />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
          >
            {loading ? "Submitting..." : "Register as Worker"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}