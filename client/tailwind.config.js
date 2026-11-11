const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: c('ink'), navy: { DEFAULT: c('navy'), 600: c('navy-600') }, paper: { DEFAULT: c('paper'), 2: c('paper-2') }, gold: { DEFAULT: c('gold'), soft: c('gold-soft') }, mist: c('mist') },
      fontFamily: { display: ['"Instrument Serif"', 'Georgia', 'serif'], sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'] },
      fontSize: {
        display: ['clamp(2.6rem,min(8.6vw,14vh),8.8rem)', { lineHeight: '.94', letterSpacing: '-0.03em' }],
        h2: ['clamp(2.4rem,6vw,5.6rem)', { lineHeight: '.98', letterSpacing: '-0.025em' }],
        h3: ['clamp(1.7rem,3vw,2.6rem)', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        lead: ['clamp(1.05rem,1.3vw,1.22rem)', { lineHeight: '1.65' }],
      },
      transitionTimingFunction: { premium: 'cubic-bezier(.22,1,.36,1)' },
    },
  },
};