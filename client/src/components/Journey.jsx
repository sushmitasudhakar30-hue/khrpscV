import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import Art from './Art.jsx';
import MaskLines from './Mask.jsx';
import { useContent } from '../lib/content.js';
import { ease } from '../lib/motion.js';

export default function Journey() {
  const { steps: STEPS } = useContent();
  const ref = useRef(null), list = useRef(null);
  const [h, setH] = useState(800), [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 65%', 'end 60%'] });
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.max(0, Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)))));
  useLayoutEffect(() => {
    const m = () => setH(list.current.offsetHeight); m();
    const ro = new ResizeObserver(m); ro.observe(list.current); return () => ro.disconnect();
  }, []);
  const s = STEPS[active];
  return (
    <section id="journey" ref={ref} className="bg-paper py-28 text-navy md:py-44">
      <div className="gutter shell">
        <h2 className="max-w-[16ch] text-h2"><MaskLines inView lines={['From the first call', 'to lasting support.']} /></h2>
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="sticky top-0 flex h-screen items-center">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0, filter: 'blur(16px)', scale: 1.08 }} animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }} exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.9, ease }}>
                    <Art kind={s.art} seed={active + 5} className="h-full w-full" />
                  </motion.div>
                </AnimatePresence>
                <p className="absolute bottom-5 left-6 font-display text-7xl text-white/90">0{active + 1}</p>
              </div>
            </div>
          </div>
          <div ref={list} className="relative pl-10 md:pl-14 lg:col-span-7">
            <svg className="absolute left-0 top-0" width="2" height={h} viewBox={`0 0 2 ${h}`} aria-hidden="true">
              <path d={`M1 0V${h}`} fill="none" strokeWidth="2" className="stroke-navy/15" />
              <motion.path d={`M1 0V${h}`} fill="none" strokeWidth="2" className="stroke-gold" style={{ pathLength: draw }} />
            </svg>
            {STEPS.map((st, i) => (
              <motion.article key={st.t} animate={{ opacity: i <= active ? 1 : 0.3 }} transition={{ duration: 0.6 }} className="relative flex min-h-[62vh] flex-col justify-center py-10">
                <span className={`absolute -left-10 top-1/2 h-3 w-3 -translate-x-[5px] rounded-full transition-all duration-500 md:-left-14 ${i <= active ? 'scale-125 bg-gold' : 'bg-navy/25'}`} />
                <Art kind={st.art} seed={i + 5} className="mb-8 aspect-[16/9] w-full lg:hidden" />
                <p className="text-sm text-navy/60">Step {i + 1}</p>
                <h3 className="mt-2 text-h3">{st.t}</h3>
                <p className="mt-4 max-w-[48ch] text-lead text-navy/75">{st.d}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
