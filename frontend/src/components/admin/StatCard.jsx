export default function StatCard({ icon: Icon, label, value, tone = "blue", hint }) {
  const tones = {
    blue:   "bg-blue-50 text-blue-700",
    green:  "bg-green-50 text-green-700",
    amber:  "bg-amber-50 text-amber-700",
    red:    "bg-red-50 text-red-700",
    purple: "bg-purple-50 text-purple-700",
    gray:   "bg-gray-100 text-gray-700",
  };
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tones[tone]}`}>
          {Icon && <Icon size={18} />}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        </div>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-2">{hint}</p>}
    </div>
  );
}