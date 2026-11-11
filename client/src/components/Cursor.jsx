import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
export default function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.3 }), sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.3 });
  const [mode, setMode] = useState(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const mv = (e) => { x.set(e.clientX); y.set(e.clientY); setSeen(true); };
    const over = (e) => { const t = e.target.closest?.('[data-cursor],a,button,input,select,textarea'); setMode(t ? t.dataset.cursor || 'link' : null); };
    addEventListener('pointermove', mv); addEventListener('pointerover', over);
    return () => { removeEventListener('pointermove', mv); removeEventListener('pointerover', over); };
  }, [x, y]);
  const size = !mode ? 10 : mode === 'link' ? 48 : 84;
  return (
    <motion.div aria-hidden style={{ x: sx, y: sy, opacity: seen ? 1 : 0 }} className="pointer-events-none fixed left-0 top-0 z-[200] hidden md:block">
      <motion.div animate={{ width: size, height: size, backgroundColor: mode ? 'rgba(226,176,74,.16)' : 'rgba(226,176,74,1)' }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="-ml-[var(--h)] -mt-[var(--h)] flex items-center justify-center rounded-full border border-gold/80 text-[11px] font-semibold text-gold-soft backdrop-blur-[2px]" style={{ '--h': `${size / 2}px` }}>
        {mode && mode !== 'link' ? mode : ''}
      </motion.div>
    </motion.div>
  );
}
