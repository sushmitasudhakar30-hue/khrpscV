import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
export default function Counter({ to, suffix = '' }) {
  const ref = useRef(null), inView = useInView(ref, { once: true, margin: '-12% 0px' }), reduce = useReducedMotion();
  useEffect(() => {
    const fmt = (v) => Math.round(v).toLocaleString('en-IN') + suffix;
    if (reduce) { ref.current.textContent = fmt(to); return; }
    if (!inView) return;
    const c = animate(0, to, { duration: 2.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { ref.current.textContent = fmt(v); } });
    return () => c.stop();
  }, [inView, to, suffix, reduce]);
  return <span ref={ref} className="tabular-nums">0{suffix}</span>;
}
