import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
export default function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 }), sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const move = (e) => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - (r.left + r.width / 2)) * strength); y.set((e.clientY - (r.top + r.height / 2)) * strength); };
  const leave = () => { x.set(0); y.set(0); };
  return <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>{children}</motion.div>;
}
