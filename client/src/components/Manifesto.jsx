import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Art from './Art.jsx';
import { MANIFESTO } from '../data/content.js';
import { photo } from '../lib/photos.js';
import { useIsMobile } from '../lib/motion.js';

function Word({ w, i, n, p, to }) {
  const s = 0.08 + 0.72 * (i / n), e = Math.min(1, s + 0.1);
  const o = useTransform(p, [s, e], [0.12, to]);
  return <motion.span style={{ opacity: o }} className="mr-[0.26em] inline-block">{w}</motion.span>;
}

export default function Manifesto() {
  const ref = useRef(null), mobile = useIsMobile();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const words = MANIFESTO.flatMap((s) => s.text.split(' ').map((w) => ({ w, to: s.to })));
  const clip = useTransform(p, [0.05, 0.6], ['inset(38% 28% 38% 28%)', 'inset(0% 0% 0% 0%)']);
  const iy = useTransform(p, [0, 1], ['8%', '-8%']);
  const img = photo('mission');
  return (
    <section id="mission" ref={ref} className="relative bg-paper text-navy" style={{ height: mobile ? 'auto' : '260vh' }}>
      <div className="gutter shell py-28 md:sticky md:top-0 md:flex md:h-screen md:items-center md:py-0">
        <div className="grid w-full items-center gap-14 lg:grid-cols-12">
          <p className="font-display text-[clamp(2rem,4.9vw,4.6rem)] leading-[1.08] tracking-[-0.02em] lg:col-span-8">
            {words.map((x, i) => mobile ? <span key={i} className="mr-[0.26em] inline-block" style={{ opacity: x.to }}>{x.w}</span> : <Word key={i} i={i} n={words.length} p={p} w={x.w} to={x.to} />)}
          </p>
          <motion.figure style={mobile ? undefined : { clipPath: clip }} className="relative aspect-[4/5] overflow-hidden lg:col-span-4">
            <motion.div style={mobile ? undefined : { y: iy, scale: 1.18 }} className="absolute inset-0">
              {img ? <img src={img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" /> : <Art kind="rings" seed={3} className="h-full w-full" />}
            </motion.div>
            <figcaption className="absolute bottom-4 left-4 text-xs text-white/70">Bengaluru, Karnataka</figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
