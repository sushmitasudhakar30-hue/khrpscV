import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MaskLines from './Mask.jsx';
import Button from './Button.jsx';
import Magnetic from './Magnetic.jsx';
import { ease, goTo } from '../lib/motion.js';
import { photo } from '../lib/photos.js';

const SCALES = ['M300 40v420', 'M190 470h220', 'M60 130h480', 'M60 130L10 270q50 50 100 0z', 'M540 130l-50 140q50 50 100 0z'];

export default function Hero({ ready }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(p, [0, 1], ['0%', '20%']), fgY = useTransform(p, [0, 1], ['0%', '-16%']);
  const textY = useTransform(p, [0, 1], ['0%', '14%']), fade = useTransform(p, [0, 0.7], [1, 0]);
  const img = photo('hero'), vid = photo('hero-video');
  const up = (delay) => ({ initial: { opacity: 0, y: 28 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { duration: 1.2, ease, delay } });

  return (
    <header ref={ref} id="top" className="relative h-[100svh] min-h-[660px] overflow-hidden bg-ink text-white">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 1.18 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 2.6, ease }}>
          {vid ? <video className="h-full w-full object-cover" src={vid} autoPlay muted loop playsInline poster={img || undefined} />
            : img ? <img className="h-full w-full object-cover" src={img} alt="" fetchpriority="high" />
            : <div className="atmos h-full w-full">
                <motion.div className="absolute -left-[12%] bottom-[-25%] h-[60vw] w-[60vw] rounded-full bg-gold/[.09] blur-[130px]" animate={{ x: [0, 70, 0], y: [0, -50, 0] }} transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }} />
                <motion.div className="absolute right-[-10%] top-[-20%] h-[50vw] w-[50vw] rounded-full bg-navy-600/50 blur-[120px]" animate={{ x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }} />
              </div>}
        </motion.div>
      </motion.div>
      <motion.div className="veil absolute inset-0" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ duration: 2, delay: 0.5 }} />

      <motion.svg style={{ y: fgY }} viewBox="0 0 600 500" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true"
        className="pointer-events-none absolute -right-[6vw] top-[10vh] hidden w-[min(54vw,760px)] text-gold/40 md:block">
        {SCALES.map((d, i) => <motion.path key={d} d={d} initial={{ pathLength: 0 }} animate={ready ? { pathLength: 1 } : {}} transition={{ duration: 3, delay: 0.8 + i * 0.2, ease }} />)}
      </motion.svg>
      <div className="grain" />

      <motion.div style={{ y: textY, opacity: fade }} className="gutter shell relative z-10 flex h-full flex-col justify-end pb-8 pt-28 md:pb-10">
        <h1 className="text-display text-white">
          <MaskLines ready={ready} delay={0.9} stagger={0.14} lines={['No one should', 'stand alone against', { t: 'a false charge.', className: 'italic text-gold-soft' }]} />
        </h1>
        <motion.p {...up(1.9)} className="mt-7 max-w-[52ch] text-lead text-white/75">
          Humanitarian aid for families in need, and legal advocacy for innocent people who have been falsely accused. Strictly non-political.
        </motion.p>
        <div className="mt-9 flex flex-wrap gap-4">
          <motion.div {...up(2.1)}><Magnetic><Button onClick={() => goTo('act')}>Take Action</Button></Magnetic></motion.div>
          <motion.div {...up(2.25)}><Magnetic><Button variant="ghost" onClick={() => goTo('impact')}>Explore Our Impact</Button></Magnetic></motion.div>
        </div>
        <motion.div {...up(2.5)} className="mt-12 hidden items-end justify-between border-t border-white/15 pt-5 md:flex">
          <ul className="grid grid-cols-3 gap-10 text-sm text-white/60">
            {['Humanitarian assistance', 'Legal and advocacy support', 'Community outreach'].map((t) => <li key={t}><button onClick={() => goTo('work')} className="transition-colors hover:text-gold-soft">{t}</button></li>)}
          </ul>
          <div className="flex items-center gap-4 text-xs text-white/50" aria-hidden="true">Scroll
            <span className="relative block h-14 w-px overflow-hidden bg-white/20"><motion.span className="absolute inset-x-0 top-0 h-5 bg-gold" animate={{ y: [-20, 60] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} /></span></div>
        </motion.div>
      </motion.div>
    </header>
  );
}
