import { useEffect, useState } from "react";
import { Ban, CheckCircle2, Search } from "lucide-react";
import { adminApi } from "../../api/admin.api.js";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

const ROLES = [
  { key: "",         label: "All" },
  { key: "customer", label: "Customers" },
  { key: "worker",   label: "Workers" },
];

export default function AdminUsers() {
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.listUsers({ role, search })
      .then((res) => setUsers(res.data.users))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load();  }, [role]);

  const submitSearch = (e) => { e.preventDefault(); load(); };

  const doBlock = async () => {
    if (!target) return;
    await adminApi.setBlocked(target.id, !target.is_blocked);
    setTarget(null);
    load();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-600">Manage customers and workers</p>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-2">
          {ROLES.map((r) => (
            <button
              key={r.key || "all"}
              onClick={() => setRole(r.key)}
              className={`text-sm px-3 py-1.5 rounded-lg border ${
                role === r.key
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <form onSubmit={submitSearch} className="flex items-center gap-2 flex-1 min-w-[220px] bg-white border border-gray-300 rounded-lg px-3">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone"
            className="w-full py-2 outline-none text-sm"
          />
        </form>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr className="text-left">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          u.role === "worker"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {u.is_blocked ? (
                          <span className="text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                            Blocked
                          </span>
                        ) : (
                          <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setTarget(u)}
                          className={`text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
                            u.is_blocked
                              ? "border-green-300 text-green-700 hover:bg-green-50"
                              : "border-red-300 text-red-700 hover:bg-red-50"
                          }`}
                        >
                          {u.is_blocked
                            ? <><CheckCircle2 size={14} /> Unblock</>
                            : <><Ban size={14} /> Block</>}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        title={target?.is_blocked ? "Unblock this user?" : "Block this user?"}
        message={target?.is_blocked
          ? `${target?.name} will regain access to their account.`
          : `${target?.name} will no longer be able to log in or use the platform.`}
        confirmLabel={target?.is_blocked ? "Unblock" : "Block"}
        danger={!target?.is_blocked}
        onClose={() => setTarget(null)}
        onConfirm={doBlock}
      />
    </div>
  );
}