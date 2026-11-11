import { useEffect, useState } from 'react';
import { IMPACT, PROGRAMS, STEPS } from '../data/content.js';
import { reviews } from '../reviews.js';

// Built-in copy shows instantly and is used if the API is unreachable or a collection is empty.
const defaults = { impact: IMPACT, programs: PROGRAMS, steps: STEPS, stories: reviews };
let cache = null, pending = null;
const load = () => (pending ||= fetch('/api/content')
  .then((r) => (r.ok ? r.json() : Promise.reject()))
  .then((d) => { cache = { ...defaults }; for (const k of Object.keys(defaults)) if (Array.isArray(d[k]) && d[k].length) cache[k] = d[k]; return cache; })
  .catch(() => defaults));

export function useContent() {
  const [c, setC] = useState(cache || defaults);
  useEffect(() => { let on = true; load().then((d) => on && setC(d)); return () => { on = false; }; }, []);
  return c;
}
