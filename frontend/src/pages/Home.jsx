import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, ShieldCheck } from "lucide-react";
import { api } from "../api/client.js";

export default function Home() {
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);
  const [pincode, setPincode] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/health").then(res => setHealth(res.data)).catch(() => setHealth({ status: "unreachable" }));
  }, []);

  const goSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pincode) params.set("pincode", pincode);
    navigate(`/services${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find Trusted Local Workers Near You
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Electricians, plumbers, painters and more — verified workers in your town or village, just a click away.
          </p>
          <form onSubmit={goSearch} className="bg-white rounded-xl p-3 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-lg">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="text-gray-400" size={20} />
              <input type="text" placeholder="What service do you need?"
                value={query} onChange={(e) => setQuery(e.target.value)}
                className="w-full py-2 text-gray-800 outline-none" />
            </div>
            <div className="flex items-center gap-2 flex-1 px-3 border-l border-gray-200">
              <MapPin className="text-gray-400" size={20} />
              <input type="text" placeholder="Enter your pincode"
                value={pincode} onChange={(e) => setPincode(e.target.value)}
                className="w-full py-2 text-gray-800 outline-none" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why choose LocalFix?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon={<ShieldCheck className="text-blue-600" size={28} />}
            title="Verified Workers" text="Every worker is manually approved by admins with valid ID proof." />
          <FeatureCard icon={<MapPin className="text-blue-600" size={28} />}
            title="Nearby First" text="Smart location-based ranking shows you the closest available workers." />
          <FeatureCard icon={<Star className="text-blue-600" size={28} />}
            title="Real Reviews" text="Ratings and reviews from real customers help you choose confidently." />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
          <span className="font-semibold text-gray-700">Backend status:</span>{" "}
          {health ? (
            <span className={health.db === "connected" ? "text-green-600" : "text-red-600"}>
              {health.db === "connected"
                ? `✅ Connected — server time ${new Date(health.server_time).toLocaleString()}`
                : "❌ Backend unreachable"}
            </span>
          ) : <span className="text-gray-500">Checking...</span>}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
      <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}