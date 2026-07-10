export default function SimpleBarChart({ data = [], height = 200 }) {
  if (!data.length) return <p className="text-sm text-gray-500">No data</p>;
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 30);
          const x = i * barWidth + barWidth * 0.15;
          const w = barWidth * 0.7;
          const y = height - h - 20;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={w} height={h} rx="1" className="fill-blue-500" />
              <text x={x + w / 2} y={y - 4} textAnchor="middle" className="fill-gray-700"
                    style={{ fontSize: 4 }}>{d.value}</text>
              <text x={x + w / 2} y={height - 5} textAnchor="middle" className="fill-gray-500"
                    style={{ fontSize: 3.5 }}>{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}