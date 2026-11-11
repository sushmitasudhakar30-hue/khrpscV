import { useState } from 'react';
import Mark from './Mark.jsx';
import Button from './Button.jsx';
import { LEGAL, NAV, ORG, SOCIALS } from '../data/content.js';
import { goTo } from '../lib/motion.js';

const L = ({ children, ...p }) => <a {...p} className="group relative inline-block text-white/70 transition-colors duration-500 hover:text-white">{children}<span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-premium group-hover:scale-x-100" /></a>;

function Newsletter() {
  const [s, setS] = useState({ k: 'idle', m: '' });
  const submit = async (e) => {
    e.preventDefault(); const form = e.target; setS({ k: 'sending', m: '' });
    try {
      const r = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email.value }) });
      const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Could not subscribe. Please try again.');
      setS({ k: 'done', m: 'Subscribed. Thank you.' }); form.reset();
    } catch (err) { setS({ k: 'error', m: err.message === 'Failed to fetch' ? 'Could not subscribe. Please try again.' : err.message }); }
  };
  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="nl" className="text-sm text-white/60">News and event updates by email</label>
      <div className="relative mt-3 flex items-end gap-4">
        <input id="nl" name="email" type="email" required placeholder="you@example.com" autoComplete="email" className="peer w-full border-0 border-b border-white/25 bg-transparent pb-3 text-lg outline-none placeholder:text-white/30" />
        <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-premium peer-focus:scale-x-100" />
        <Button type="submit" variant="ghost" arrow={false} disabled={s.k === 'sending'} className="!px-5 !py-3 text-sm">{s.k === 'sending' ? 'Sending' : 'Subscribe'}</Button>
      </div>
      <p role="status" className={`mt-3 min-h-5 text-sm ${s.k === 'error' ? 'text-[#ff9a9a]' : 'text-gold-soft'}`}>{s.m}</p>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 text-white">
      <div className="gutter shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5"><div className="flex items-center gap-3 text-gold"><Mark className="h-10 w-10" /><span className="font-display text-2xl text-white">{ORG.name}</span></div>
          <p className="mt-6 max-w-[40ch] text-lead text-white/60">{ORG.mission}</p></div>
        <nav aria-label="Footer" className="lg:col-span-2"><ul className="space-y-3">{NAV.map(([l, id]) => <li key={id}><L href={`#${id}`} onClick={(e) => { e.preventDefault(); goTo(id); }}>{l}</L></li>)}</ul></nav>
        <div className="space-y-3 text-white/70 lg:col-span-2"><p className="text-white">{ORG.person}</p><p><L href={`tel:+91${ORG.phone}`}>+91 {ORG.phone}</L></p><p><L href={`mailto:${ORG.email}`}>{ORG.email}</L></p>
          {SOCIALS.length > 0 && <ul className="flex gap-5 pt-3">{SOCIALS.map((s) => <li key={s.label}><L href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</L></li>)}</ul>}</div>
        <div className="lg:col-span-3"><Newsletter /></div>
      </div>
      <div className="gutter shell mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/50">
        <p>© {new Date().getFullYear()} {ORG.name}. All rights reserved.</p>
        <ul className="flex gap-6">{LEGAL.map((l) => <li key={l.label}><L href={l.href}>{l.label}</L></li>)}</ul>
      </div>
      <p aria-hidden="true" className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[clamp(6rem,27vw,30rem)] leading-[.75] tracking-[-0.04em] text-white/[.04]">KHRPSC</p>
    </footer>
  );
}
