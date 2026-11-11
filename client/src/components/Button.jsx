import { motion } from 'framer-motion';
const V = {
  solid: ['bg-gold text-ink', 'bg-gold-soft'],
  ghost: ['border border-white/25 text-white group-hover:text-ink', 'bg-gold'],
  ink: ['bg-ink text-white', 'bg-navy-600'],
};
export default function Button({ as = 'button', variant = 'solid', arrow = true, className = '', children, ...p }) {
  const M = motion[as]; const [skin, sweep] = V[variant];
  return (
    <M whileTap={{ scale: 0.97 }} className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-[15px] font-semibold tracking-tight transition-colors duration-500 ${skin} ${className}`} {...p}>
      <span aria-hidden className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-premium group-hover:scale-x-100 ${sweep}`} />
      <span className="relative">{children}</span>
      {arrow && <svg className="relative h-4 w-4 transition-transform duration-500 ease-premium group-hover:translate-x-1.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" /></svg>}
    </M>
  );
}
