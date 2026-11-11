import { motion } from 'framer-motion';
import Counter from './Counter.jsx';
import MaskLines from './Mask.jsx';
import { useContent } from '../lib/content.js';
import { ease } from '../lib/motion.js';

const span = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];
const spot = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); };

export default function Impact() {
  const { impact: IMPACT } = useContent();
  return (
    <section id="impact" className="relative bg-ink py-28 text-white md:py-44">
      <div className="gutter shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className="text-h2 lg:col-span-8"><MaskLines inView lines={['What steady work', 'adds up to.']} /></h2>
          <p className="max-w-[42ch] text-lead text-mist lg:col-span-4 lg:self-end">Behind every number is a person who was heard, and a family that was not left to manage alone.</p>
        </div>
        <div className="mt-16 grid gap-px bg-white/10 lg:grid-cols-12">
          {IMPACT.map((s, i) => (
            <motion.article key={s.label} onPointerMove={spot} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.2, ease, delay: (i % 2) * 0.15 }}
              className={`group relative overflow-hidden bg-ink p-8 md:p-12 ${span[i]}`}>
              <div className="spot" />
              <p className="font-display text-[clamp(4rem,11vw,10rem)] leading-none tracking-[-0.04em] text-white transition-colors duration-700 group-hover:text-gold-soft"><Counter to={s.to} suffix={s.suffix} /></p>
              <div className="mt-6 h-px w-12 bg-gold transition-all duration-700 ease-premium group-hover:w-full" />
              <h3 className="mt-5 text-2xl">{s.label}</h3>
              <p className="mt-2 max-w-[38ch] text-mist">{s.note}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
