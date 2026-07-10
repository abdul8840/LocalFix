import { Link } from "react-router-dom";
import { User, Wrench } from "lucide-react";

export default function RegisterChoice() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
        Join LocalFix
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Choose how you'd like to use LocalFix
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/register/customer"
          className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-lg transition group"
        >
          <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <User className="text-blue-600" size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">I need a service</h2>
          <p className="text-sm text-gray-600">
            Register as a customer to find and book trusted local workers.
          </p>
        </Link>

        <Link
          to="/register/worker"
          className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-lg transition group"
        >
          <div className="w-14 h-14 bg-amber-50 group-hover:bg-amber-100 rounded-xl flex items-center justify-center mb-4">
            <Wrench className="text-amber-600" size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a worker</h2>
          <p className="text-sm text-gray-600">
            Offer your services and get more customers in your area.
          </p>
        </Link>
      </div>
    </div>
  );
}