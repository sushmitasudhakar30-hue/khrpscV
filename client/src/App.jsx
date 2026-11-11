import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Cursor from './components/Cursor.jsx';
import Preloader from './components/Preloader.jsx';
import Footer from './components/Footer.jsx';
import { lenisRef } from './lib/motion.js';

// Below-the-fold sections are code-split.
const Manifesto = lazy(() => import('./components/Manifesto.jsx'));
const Impact = lazy(() => import('./components/Impact.jsx'));
const Programs = lazy(() => import('./components/Programs.jsx'));
const Journey = lazy(() => import('./components/Journey.jsx'));
const Stories = lazy(() => import('./components/Stories.jsx'));
const Events = lazy(() => import('./components/Events.jsx'));
const Gallery = lazy(() => import('./components/Gallery.jsx'));
const CallToAction = lazy(() => import('./components/CallToAction.jsx'));
const Contact = lazy(() => import('./components/Contact.jsx'));

const seen = () => { try { return sessionStorage.getItem('khrpsc-intro') === '1'; } catch { return false; } };

export default function App() {
  const [loading, setLoading] = useState(() => !seen());
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => { // smooth scrolling, skipped when the visitor prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 }); lenisRef.current = l;
    let id; const raf = (t) => { l.raf(t); id = requestAnimationFrame(raf); }; id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); l.destroy(); lenisRef.current = null; };
  }, []);

  useEffect(() => {
    if (!loading) return;
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => { setLoading(false); try { sessionStorage.setItem('khrpsc-intro', '1'); } catch {} }, 1900);
    return () => { clearTimeout(t); document.documentElement.style.overflow = ''; };
  }, [loading]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip">Skip to content</a>
      <Cursor />
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>
      <motion.div aria-hidden style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold" />
      <Nav ready={!loading} />
      <main id="main">
        <Hero ready={!loading} />
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Manifesto /><Impact /><Programs /><Journey /><Stories /><Events /><Gallery /><CallToAction /><Contact />
        </Suspense>
      </main>
      <Footer />
    </MotionConfig>
  );
}
