import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Mark from './Mark.jsx';
import Button from './Button.jsx';
import { NAV } from '../data/content.js';
import { ease, goTo, lenisRef, openContact } from '../lib/motion.js';

export default function Nav({ ready }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 60));
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = 'hidden'; lenisRef.current?.stop();
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', esc);
    return () => { document.documentElement.style.overflow = ''; lenisRef.current?.start(); removeEventListener('keydown', esc); };
  }, [open]);
  const go = (id) => (e) => { e.preventDefault(); setOpen(false); setTimeout(() => goTo(id), open ? 350 : 0); };

  return (
    <motion.header initial={{ y: -40, opacity: 0 }} animate={ready ? { y: 0, opacity: 1 } : {}} transition={{ duration: 1.1, ease, delay: 2.2 }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-700 ${scrolled ? 'border-white/10 bg-ink/70 backdrop-blur-xl' : 'border-transparent bg-transparent'}`}>
      <motion.nav aria-label="Primary" animate={{ height: scrolled ? 64 : 92 }} transition={{ duration: 0.6, ease }} className="gutter shell grid grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]">
        <a href="#top" onClick={go('top')} className="flex items-center gap-3 justify-self-start" aria-label="KHRPSC home">
          <motion.span animate={{ scale: scrolled ? 0.86 : 1 }} transition={{ duration: 0.6, ease }} className="flex origin-left items-center gap-3 text-gold">
            <Mark className="h-9 w-9" />
            <span className="hidden text-[11px] leading-tight text-white/70 sm:block"><b className="block text-[15px] font-semibold tracking-wide text-white">KHRPSC</b>Karnataka Human Rights<br />Public Service Committee</span>
          </motion.span>
        </a>
        <ul className="hidden items-center gap-9 lg:flex">
          {NAV.map(([l, id]) => (
            <li key={id}><a href={`#${id}`} onClick={go(id)} className="group relative py-2 text-sm text-white/80 transition-colors hover:text-white">{l}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-premium group-hover:scale-x-100" /></a></li>
          ))}
        </ul>
        <div className="flex items-center gap-3 justify-self-end">
          <Button variant="solid" onClick={() => openContact('legal')} className="hidden !px-5 !py-3 text-sm lg:inline-flex">Seek support</Button>
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="relative z-[60] flex h-12 w-12 items-center justify-center lg:hidden">
            <span className={`absolute h-px w-6 bg-white transition-transform duration-500 ease-premium ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-px w-6 bg-white transition-transform duration-500 ease-premium ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.8, ease }}
            className="gutter fixed inset-0 z-[55] flex flex-col justify-center bg-ink pt-24" role="dialog" aria-label="Menu">
            <ul className="space-y-2">
              {NAV.map(([l, id], i) => (
                <motion.li key={id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease }}>
                  <a href={`#${id}`} onClick={go(id)} className="block py-1 font-display text-5xl text-white">{l}</a></motion.li>
              ))}
            </ul>
            <div className="mt-10"><Button onClick={() => { setOpen(false); openContact('legal'); }}>Seek support</Button></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
