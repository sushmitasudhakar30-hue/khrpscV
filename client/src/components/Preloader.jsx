import { motion } from 'framer-motion';
import Logo from './Logo.jsx';
export default function Preloader() {
  return (
    <motion.div className="fixed inset-0 z-[300] grid place-items-center bg-ink text-gold" exit={{ y: '-100%' }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }}><Logo className="h-28 w-28" /></motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }} className="font-display text-2xl text-white/80">Karnataka Human Rights Public Service Committee</motion.p>
        <motion.span className="h-px w-40 origin-left bg-gold/70" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </motion.div>
  );
}