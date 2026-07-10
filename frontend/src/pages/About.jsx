import { Link } from "react-router-dom";
import { Users, MapPin, ShieldCheck, HandHeart } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">About LocalFix</h1>
      <p className="text-gray-700 leading-relaxed">
        LocalFix is built for small towns and rural areas — where finding a
        trustworthy electrician, plumber or painter can be surprisingly hard.
        We connect local customers with verified workers in their own pincode,
        without middlemen or heavy commissions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {[
          { icon: ShieldCheck, title: "Trust first",
            text: "Every worker is manually verified by our admin team before appearing in search." },
          { icon: MapPin,      title: "Truly local",
            text: "Location-based ranking prioritizes workers in your pincode or nearby areas." },
          { icon: Users,       title: "Community driven",
            text: "Ratings and reviews come from real customers in your community." },
          { icon: HandHeart,   title: "Offline friendly",
            text: "Pay workers directly — no gateway fees, no online payment required." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
              <Icon className="text-blue-600" size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-blue-600 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Are you a skilled worker?</h3>
          <p className="text-blue-100 text-sm">
            Join LocalFix and reach more customers in your area.
          </p>
        </div>
        <Link
          to="/register/worker"
          className="bg-white text-blue-700 font-medium px-5 py-2 rounded-lg hover:bg-blue-50"
        >
          Register as worker
        </Link>
      </div>
    </div>
  );
}