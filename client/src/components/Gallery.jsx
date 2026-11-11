import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MaskLines from './Mask.jsx';
import { ease } from '../lib/motion.js';

const files = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
const photos = Object.values(files);

function Shot({ src, i, onOpen }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.button data-cursor="View" onClick={() => onOpen(src)} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 1, ease }}
      className="group mb-4 block w-full overflow-hidden" aria-label={`Open photo ${i + 1}`}>
      <img src={src} alt={`KHRPSC gallery ${i + 1}`} loading="lazy" decoding="async" onLoad={() => setLoaded(true)}
        className={`w-full transition-[filter,transform] duration-[1400ms] ease-premium group-hover:scale-105 ${loaded ? 'blur-0' : 'blur-xl'}`} />
    </motion.button>
  );
}

export default function Gallery() {
  const [open, setOpen] = useState(null);
  useEffect(() => { if (!open) return; const k = (e) => e.key === 'Escape' && setOpen(null); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [open]);
  if (!photos.length) return null;
  return (
    <section id="gallery" className="bg-paper pb-28 text-navy md:pb-40">
      <div className="gutter shell">
        <h2 className="mb-12 text-h2"><MaskLines inView lines={['Moments of impact.']} /></h2>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">{photos.map((s, i) => <Shot key={s} src={s} i={i} onOpen={setOpen} />)}</div>
      </div>
      <AnimatePresence>{open && (
        <motion.div role="dialog" aria-modal="true" aria-label="Photo" className="fixed inset-0 z-[150] grid cursor-zoom-out place-items-center bg-ink/90 backdrop-blur-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
          <motion.img src={open} alt="" className="max-h-[88vh] max-w-[92vw]" initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} transition={{ duration: 0.6, ease }} />
        </motion.div>)}</AnimatePresence>
    </section>
  );
}
