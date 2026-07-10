const STYLES = {
  pending:     "bg-yellow-50 text-yellow-700 border-yellow-200",
  accepted:    "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-indigo-50 text-indigo-700 border-indigo-200",
  completed:   "bg-green-50 text-green-700 border-green-200",
  cancelled:   "bg-gray-100 text-gray-600 border-gray-200",
  rejected:    "bg-red-50 text-red-700 border-red-200",
};

const LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}>
      {LABELS[status] || status}
    </span>
  );
}