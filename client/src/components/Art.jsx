// Abstract, art-directed placeholders for photography: geometric line compositions in gold on navy.
const rnd = (s) => { const x = Math.sin(s * 9999) * 10000; return x - Math.floor(x); };
export default function Art({ kind = 'arcs', seed = 1, className = '' }) {
  let g;
  if (kind === 'arcs') g = [...Array(10)].map((_, i) => <circle key={i} cx="30" cy="310" r={40 + i * 32} strokeOpacity={1 - i * 0.07} />);
  else if (kind === 'columns') g = <>{[...Array(15)].map((_, i) => { const h = 60 + rnd(seed * 13 + i) * 170; return <line key={i} x1={26 + i * 25} x2={26 + i * 25} y1={290 - h} y2="290" />; })}<line x1="10" x2="390" y1="290" y2="290" /></>;
  else if (kind === 'nodes') {
    const p = [...Array(18)].map((_, i) => [30 + rnd(seed + i) * 340, 25 + rnd(seed * 3 + i * 7) * 250]);
    g = <>{p.map((a, i) => <g key={i}><line x1={a[0]} y1={a[1]} x2={p[(i + 1) % 18][0]} y2={p[(i + 1) % 18][1]} strokeOpacity=".5" /><line x1={a[0]} y1={a[1]} x2={p[(i + 5) % 18][0]} y2={p[(i + 5) % 18][1]} strokeOpacity=".25" /><circle cx={a[0]} cy={a[1]} r="3.5" fill="currentColor" /></g>)}</>;
  } else g = <><circle cx="150" cy="160" r="95" /><circle cx="240" cy="160" r="95" /><circle cx="195" cy="100" r="95" /></>;
  return (
    <div className={`art relative overflow-hidden bg-gradient-to-br from-navy-600/70 via-navy to-ink ${className}`}>
      <div className="absolute -right-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-gold/10 blur-[90px]" />
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-gold/70" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">{g}</svg>
    </div>
  );
}
