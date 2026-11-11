import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MaskLines from './Mask.jsx';
import Button from './Button.jsx';
import Magnetic from './Magnetic.jsx';
import { openContact } from '../lib/motion.js';

export default function CallToAction() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(p, [0, 1], ['-12%', '12%']);
  return (
    <section id="act" ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink py-28 text-white">
      <motion.div style={{ y }} className="absolute inset-0" aria-hidden="true">
        <motion.div className="absolute left-[10%] top-[15%] h-[55vw] w-[55vw] rounded-full bg-gold/[.13] blur-[140px]" animate={{ x: [0, 90, 0], y: [0, 60, 0], scale: [1, 1.12, 1] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute -right-[10%] bottom-[-20%] h-[50vw] w-[50vw] rounded-full bg-navy-600/60 blur-[120px]" animate={{ x: [0, -70, 0], y: [0, -50, 0] }} transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
      <div className="grain" />
      <div className="gutter shell relative">
        <h2 className="text-[clamp(3rem,10.5vw,10.5rem)] leading-[.92] tracking-[-0.035em]"><MaskLines inView stagger={0.15} lines={['Be part of', { t: 'the change.', className: 'italic text-gold-soft' }]} /></h2>
        <p className="mt-8 max-w-[46ch] text-lead text-white/75">Give, volunteer or simply reach out. Every form of support reaches someone who needs it.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Magnetic><Button onClick={() => openContact('donate')}>Donate</Button></Magnetic>
          <Magnetic><Button variant="ghost" onClick={() => openContact('volunteer')}>Volunteer</Button></Magnetic>
          <Magnetic><Button variant="ghost" onClick={() => openContact('other')}>Get Involved</Button></Magnetic>
        </div>
        <p className="mt-8 max-w-[52ch] text-sm text-white/50">Online donations are being set up. Until then, write to us and we will reply personally.</p>
      </div>
    </section>
  );
}
