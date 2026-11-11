import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import Art from './Art.jsx';
import MaskLines from './Mask.jsx';
import { useContent } from '../lib/content.js';
import { openContact, useIsMobile } from '../lib/motion.js';

const SPEED = 1.7; // horizontal slide moves this many times faster than the page scroll
const spot = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); };

function Card({ p, i, className = '' }) {
  return (
    <article onPointerMove={spot} data-cursor="Open" onClick={() => openContact(p.topic)}
      className={`group relative flex shrink-0 cursor-pointer flex-col overflow-hidden bg-navy ring-1 ring-inset ring-white/10 transition-[transform,box-shadow,--tw-ring-color] duration-700 ease-premium hover:-translate-y-2 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] hover:ring-gold/60 ${className}`}>
      <div className="relative min-h-0 flex-1 overflow-hidden"><Art kind={p.art} seed={i + 2} className="h-full w-full scale-100 transition-transform duration-[1600ms] ease-premium group-hover:scale-110" />
        <span className="absolute left-5 top-5 bg-ink/60 px-3 py-1 text-xs text-white/80 backdrop-blur">{p.category}</span></div>
      <div className="relative p-6 md:p-8">
        <div className="spot" />
        <div className="flex items-start justify-between gap-6">
          <h3 className="text-h3">{p.title}</h3>
          <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink" aria-hidden="true">
            <svg className="h-4 w-4 transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 12L12 4M5 4h7v7" /></svg></span>
        </div>
        <p className="mt-3 max-w-[46ch] text-mist">{p.text}</p>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-premium group-hover:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
          <div className="overflow-hidden"><p className="pt-4 text-sm text-gold-soft">{p.more}</p></div></div>
        <p className="mt-5 border-t border-white/10 pt-4 text-xs text-white/50">{p.indicator}</p>
      </div>
    </article>
  );
}

const Intro = () => (
  <div className="w-[min(88vw,520px)] shrink-0 pr-4">
    <h2 className="text-h2"><MaskLines inView lines={['Three ways', 'we help.']} /></h2>
    <p className="mt-6 max-w-[40ch] text-lead text-mist">Practical support, legal advocacy and community presence, always strictly non-political.</p>
  </div>
);

export default function Programs() {
  const { programs: PROGRAMS } = useContent();
  const mobile = useIsMobile();
  const ref = useRef(null), track = useRef(null);
  const dist = useMotionValue(0), [h, setH] = useState('300vh');
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform([p, dist], ([a, d]) => -a * d);
  useLayoutEffect(() => {
    if (mobile || !track.current) return;
    const m = () => { const d = Math.max(0, track.current.scrollWidth - window.innerWidth); dist.set(d); setH(`calc(100vh + ${d / SPEED}px)`); };
    m(); const ro = new ResizeObserver(m); ro.observe(track.current); addEventListener('resize', m);
    return () => { ro.disconnect(); removeEventListener('resize', m); };
  }, [mobile, dist]);

  if (mobile) return (
    <section id="work" className="gutter bg-ink py-24 text-white"><Intro />
      <div className="mt-12 grid gap-6">{PROGRAMS.map((pr, i) => <Card key={pr.title} p={pr} i={i} className="h-[30rem]" />)}</div></section>
  );
  return (
    <section id="work" ref={ref} className="relative bg-ink text-white" style={{ height: h }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x, willChange: 'transform' }} className="flex w-max items-stretch gap-8 px-[6vw] pt-10">
          <Intro />
          {PROGRAMS.map((pr, i) => <Card key={pr.title} p={pr} i={i} className="h-[68vh] w-[min(46vw,620px)]" />)}
        </motion.div>
        <div className="absolute inset-x-[6vw] bottom-10 h-px bg-white/15"><motion.div style={{ scaleX: p }} className="h-full origin-left bg-gold" /></div>
      </div>
    </section>
  );
}