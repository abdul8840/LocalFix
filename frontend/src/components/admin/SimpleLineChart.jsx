export default function SimpleLineChart({ data = [], height = 200 }) {
  if (!data.length) return <p className="text-sm text-gray-500">No data</p>;
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = 100 / Math.max(data.length - 1, 1);

  const points = data
    .map((d, i) => `${i * stepX},${height - (d.value / max) * (height - 30) - 15}`)
    .join(" ");

  return (
    <div className="w-full">
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <polyline
          points={points}
          fill="none"
          stroke="rgb(37 99 235)"
          strokeWidth="0.7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {data.map((d, i) => {
          const x = i * stepX;
          const y = height - (d.value / max) * (height - 30) - 15;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="1" className="fill-blue-600" />
              <text x={x} y={height - 3} textAnchor="middle" className="fill-gray-500"
                    style={{ fontSize: 3 }}>{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}