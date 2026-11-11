import { useEffect, useState } from 'react';

export const ease = [0.22, 1, 0.36, 1];
export const lenisRef = { current: null };

export function useMedia(query) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const f = () => setM(mq.matches);
    f(); mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, [query]);
  return m;
}
export const useIsMobile = () => useMedia('(max-width: 899px)');

export function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: 'smooth' });
}
// Pre-selects the topic in the contact form, then scrolls to it.
export function openContact(topic) {
  window.dispatchEvent(new CustomEvent('khrpsc:topic', { detail: topic }));
  goTo('contact');
}
