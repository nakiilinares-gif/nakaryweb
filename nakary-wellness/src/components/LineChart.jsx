// Gráfica de línea simple en SVG (sin librerías externas)
export default function LineChart({ points, unit = '' }) {
  if (!points.length) return null;
  const W = 340, H = 180;
  const P = { l: 40, r: 16, t: 18, b: 30 };

  const ys = points.map((p) => p.y);
  let min = Math.min(...ys);
  let max = Math.max(...ys);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.18;
  min -= pad; max += pad;

  const x = (i) => (points.length === 1 ? P.l + (W - P.l - P.r) / 2 : P.l + (i * (W - P.l - P.r)) / (points.length - 1));
  const y = (v) => P.t + (1 - (v - min) / (max - min)) * (H - P.t - P.b);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.y).toFixed(1)}`).join(' ');
  const ticks = [0, 0.5, 1].map((t) => min + (max - min) * t);
  const fmt = (v) => (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1)).replace(/\.0$/, '');

  const labelIdx = points.length <= 4 ? points.map((_, i) => i) : [0, Math.floor((points.length - 1) / 2), points.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Evolución ${unit}`}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="#E8E6E1" strokeDasharray="3 4" />
          <text x={P.l - 6} y={y(t) + 3.5} textAnchor="end" fontSize="9" fill="#5C664A">{fmt(t)}</text>
        </g>
      ))}
      {points.length > 1 && <path d={path} fill="none" stroke="#808B6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.y)} r="4.5" fill="#fff" stroke="#3A4333" strokeWidth="2" />
          {(i === points.length - 1 || i === 0) && (
            <text x={x(i)} y={y(p.y) - 10} textAnchor="middle" fontSize="10" fontWeight="600" fill="#3A4333">
              {fmt(p.y)}
            </text>
          )}
        </g>
      ))}
      {labelIdx.map((i) => (
        <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 && points.length > 1 ? 'start' : i === points.length - 1 && points.length > 1 ? 'end' : 'middle'} fontSize="9" fill="#5C664A">
          {points[i].x}
        </text>
      ))}
    </svg>
  );
}
