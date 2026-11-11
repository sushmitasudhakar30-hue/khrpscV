import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MaskLines from './Mask.jsx';
import { ease, openContact } from '../lib/motion.js';

export default function Events() {
  const [events, setEvents] = useState([]);
  useEffect(() => { fetch('/api/events').then((r) => r.json()).then((d) => Array.isArray(d) && setEvents(d)).catch(() => {}); }, []);
  return (
    <section id="events" className="bg-paper py-28 text-navy md:py-40">
      <div className="gutter shell grid gap-12 lg:grid-cols-12">
        <h2 className="text-h2 lg:col-span-5"><MaskLines inView lines={['Come and', 'meet us.']} /></h2>
        <div className="lg:col-span-7">
          {events.length === 0 ? (
            <div className="border-y border-navy/15 py-10"><p className="max-w-[40ch] text-lead text-navy/70">New outreach and support events will be announced here. If you would like to volunteer at one, tell us.</p>
              <button onClick={() => openContact('volunteer')} className="mt-5 border-b border-navy pb-1 font-semibold">Offer to volunteer</button></div>
          ) : events.map((e, i) => { const d = new Date(e.date); return (
            <motion.article key={e._id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: i * 0.08 }}
              className="group grid grid-cols-[5.5rem_1fr_auto] items-center gap-6 border-t border-navy/15 py-7 transition-[padding] duration-500 ease-premium last:border-b hover:pl-4">
              <p className="font-display text-6xl leading-none">{d.getDate()}<span className="block text-base text-navy/60">{d.toLocaleString('en', { month: 'short' })}</span></p>
              <div><h3 className="text-h3">{e.title}</h3><p className="mt-1 text-navy/65">{e.location}</p></div>
              <svg className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" /></svg>
            </motion.article>); })}
        </div>
      </div>
    </section>
  );
}
