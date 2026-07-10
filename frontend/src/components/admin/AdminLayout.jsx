import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, UserCheck, Users, Star, ShieldAlert } from "lucide-react";
import AdminSidebar from "./AdminSidebar.jsx";

const mobileLinks = [
  { to: "/admin",         label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/workers", label: "Workers",  icon: UserCheck },
  { to: "/admin/users",   label: "Users",    icon: Users },
  { to: "/admin/reviews", label: "Reviews",  icon: Star },
  { to: "/admin/fraud",   label: "Fraud",    icon: ShieldAlert },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        {/* Mobile tab bar */}
        <div className="lg:hidden bg-white border-b border-gray-200 overflow-x-auto">
          <nav className="flex gap-1 p-2 min-w-max">
            {mobileLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <Icon size={14} /> {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}