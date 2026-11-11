import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Art from './Art.jsx';
import MaskLines from './Mask.jsx';
import { COMMITMENTS } from '../data/content.js';
import { useContent } from '../lib/content.js';
import { ease } from '../lib/motion.js';

export default function Stories() {
  const { stories } = useContent();
  const real = stories.length > 0, items = real ? stories : COMMITMENTS;
  const [[i, dir], set] = useState([0, 1]);
  const go = (d) => set([(i + d + items.length) % items.length, d]);
  const it = items[i] || items[0];
  return (
    <section id="stories" className="relative overflow-hidden bg-ink py-28 text-white md:py-44" onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); }}>
      <div className="gutter shell">
        <h2 className="text-h2"><MaskLines inView lines={real ? ['In their own words.'] : ['What we stand for.']} /></h2>
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
          <motion.div initial={{ clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0% 0 0)' }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.5, ease }} className="relative aspect-[5/4] overflow-hidden lg:col-span-6">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, filter: 'blur(14px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 1, ease }}>
                <motion.div className="h-full w-full" animate={{ scale: [1, 1.08] }} transition={{ duration: 14, ease: 'linear' }}>
                  {it.image ? <img src={it.image} alt="" className="h-full w-full object-cover" loading="lazy" /> : <Art kind={['rings', 'columns', 'nodes'][i % 3]} seed={i + 9} className="h-full w-full" />}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <div className="lg:col-span-6 lg:pl-8">
            <div aria-live="polite" className="min-h-[18rem]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.figure key={i} custom={dir} initial={{ opacity: 0, x: 60 * dir, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -60 * dir }} transition={{ duration: 0.8, ease }}>
                  <svg className="h-8 w-8 text-gold" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M4 20c0-7 4-12 10-14l1 2c-3 1.5-5 4-5 7h5v9H4zm14 0c0-7 4-12 10-14l1 2c-3 1.5-5 4-5 7h5v9h-11z" /></svg>
                  <blockquote className="mt-6 font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.15]">{it.quote}</blockquote>
                  <figcaption className="mt-6 text-mist"><b className="font-semibold text-white">{it.name}</b>{it.role && `, ${it.role}`}</figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex gap-2" role="tablist" aria-label="Choose a story">{items.map((_, n) => <button key={n} role="tab" aria-selected={n === i} aria-label={`Story ${n + 1}`} onClick={() => set([n, n > i ? 1 : -1])} className="group py-3"><span className={`block h-px transition-all duration-700 ease-premium ${n === i ? 'w-14 bg-gold' : 'w-6 bg-white/30 group-hover:bg-white/60'}`} /></button>)}</div>
              <div className="ml-auto flex gap-3">
                {[[-1, 'Previous story', 'M10 3L4 8l6 5'], [1, 'Next story', 'M6 3l6 5-6 5']].map(([d, l, path]) => <button key={d} onClick={() => go(d)} aria-label={l} className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-ink"><svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d={path} /></svg></button>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
