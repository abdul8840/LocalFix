export default function ConfirmDialog({
  open, title, message, confirmLabel = "Confirm",
  cancelLabel = "Cancel", danger = false, onConfirm, onClose,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded-lg text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white py-2 rounded-lg text-sm ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}