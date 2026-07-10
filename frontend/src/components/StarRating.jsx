import { Star } from "lucide-react";

export default function StarRating({ value = 0, size = 16, showValue = true }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex items-center gap-1 text-amber-500">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= rounded ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
      {showValue && (
        <span className="text-sm text-gray-700 ml-1">
          {Number(value).toFixed(1)}
        </span>
      )}
    </span>
  );
}