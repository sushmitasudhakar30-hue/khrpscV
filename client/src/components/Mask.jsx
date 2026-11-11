import { motion } from 'framer-motion';
import { ease } from '../lib/motion';
// Text-mask reveal: each line rises out of an overflow-hidden slot.
export default function MaskLines({ lines, ready = true, inView = false, delay = 0, stagger = 0.12, className = '', lineClass = '', as: Tag = 'span' }) {
  return (
    <Tag className={`block ${className}`}>
      {lines.map((l, i) => {
        const txt = typeof l === 'string' ? l : l.t;
        const cls = typeof l === 'string' ? '' : l.className || '';
        const t = { duration: 1.25, ease, delay: delay + i * stagger };
        const motionProps = inView
          ? { initial: { y: '112%', rotate: 2 }, whileInView: { y: 0, rotate: 0 }, viewport: { once: true, amount: 0.8 }, transition: t }
          : { initial: { y: '112%', rotate: 2 }, animate: ready ? { y: 0, rotate: 0 } : { y: '112%', rotate: 2 }, transition: t };
        return (
          <span key={i} className={`block overflow-hidden pb-[0.14em] -mb-[0.14em] ${lineClass}`}>
            <motion.span className={`block origin-left ${cls}`} {...motionProps}>{txt}</motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
