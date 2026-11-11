import { motion } from 'framer-motion';
const D = ['M24 6v34', 'M14 41h20', 'M7 14h34', 'M7 14L1.5 27h11z', 'M41 14l-5.5 13h11z'];
export default function Mark({ className = 'h-8 w-8', draw = false, delay = 0 }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {D.map((d, i) => draw
        ? <motion.path key={d} d={d} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }} />
        : <path key={d} d={d} />)}
    </svg>
  );
}
