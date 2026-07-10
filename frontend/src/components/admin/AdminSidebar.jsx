import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, UserCheck, Users, Star, ShieldAlert, ArrowLeft,
} from "lucide-react";

const links = [
  { to: "/admin",         label: "Overview",     icon: LayoutDashboard, end: true },
  { to: "/admin/workers", label: "Workers",      icon: UserCheck },
  { to: "/admin/users",   label: "Users",        icon: Users },
  { to: "/admin/reviews", label: "Reviews",      icon: Star },
  { to: "/admin/fraud",   label: "Fraud Alerts", icon: ShieldAlert },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 border-r border-gray-200 bg-white sticky top-14 h-[calc(100vh-3.5rem)]">
      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
          Admin Panel
        </p>
        <p className="text-sm text-gray-800 font-bold">LocalFix Control</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>
      <NavLink
        to="/"
        className="m-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 border border-gray-200"
      >
        <ArrowLeft size={14} /> Back to site
      </NavLink>
    </aside>
  );
}