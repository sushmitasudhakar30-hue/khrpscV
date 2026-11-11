import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MaskLines from './Mask.jsx';
import Button from './Button.jsx';
import { ORG } from '../data/content.js';
import { ease } from '../lib/motion.js';

const TOPICS = [['legal', 'Legal support'], ['aid', 'Financial or welfare aid'], ['donate', 'Donate'], ['volunteer', 'Volunteer'], ['other', 'Something else']];
const line = 'peer w-full border-0 border-b border-white/25 bg-transparent pb-3 pt-6 text-lg text-white outline-none placeholder-transparent';
const lab = 'pointer-events-none absolute left-0 top-6 origin-left text-mist transition-all duration-500 ease-premium peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gold peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75';
const bar = 'absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-premium peer-focus:scale-x-100';

export default function Contact() {
  const [state, setState] = useState({ s: 'idle', msg: '' });
  const [topic, setTopic] = useState('legal');
  useEffect(() => { const f = (e) => TOPICS.some(([v]) => v === e.detail) && setTopic(e.detail); addEventListener('khrpsc:topic', f); return () => removeEventListener('khrpsc:topic', f); }, []);
  const submit = async (e) => {
    e.preventDefault();
    const form = e.target, data = Object.fromEntries(new FormData(form));
    if (!data.email && !data.phone) return setState({ s: 'error', msg: 'Please add a phone number or an email so we can reach you.' });
    setState({ s: 'sending', msg: '' });
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'failed');
      setState({ s: 'done', msg: '' }); form.reset();
    } catch (err) { setState({ s: 'error', msg: err.message === 'failed' || err.message === 'Failed to fetch' ? `We could not send your message. Please call +91 ${ORG.phone}.` : err.message }); }
  };
  const A = ({ href, children }) => <a href={href} className="group relative inline-block text-xl text-gold-soft">{children}<span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-soft transition-transform duration-500 ease-premium group-hover:scale-x-100" /></a>;
  return (
    <section id="contact" className="relative bg-navy py-28 text-white md:py-44">
      <div className="gutter shell grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-h2"><MaskLines inView lines={['Need help?', { t: 'Reach out.', className: 'italic text-gold-soft' }]} /></h2>
          <address className="mt-10 space-y-3 not-italic text-mist">
            <p><b className="font-semibold text-white">{ORG.person}</b>, contact person</p>
            <p><A href={`tel:+91${ORG.phone}`}>+91 {ORG.phone}</A></p><p><A href={`mailto:${ORG.email}`}>{ORG.email}</A></p>
            <p className="max-w-[34ch] pt-4">{ORG.address}</p>
          </address>
        </div>
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {state.s === 'done' ? (
              <motion.div key="ok" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="border-t border-gold py-12" role="status">
                <h3 className="text-h3">Thank you. We have your message.</h3><p className="mt-3 text-mist">We will get back to you as soon as we can.</p>
                <button onClick={() => setState({ s: 'idle', msg: '' })} className="mt-6 border-b border-white/40 pb-1 text-sm">Send another message</button></motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} className="grid gap-8 md:grid-cols-2" noValidate>
                <div className="relative"><input id="c-name" name="name" required maxLength={80} placeholder=" " autoComplete="name" className={line} /><label htmlFor="c-name" className={lab}>Your name</label><span className={bar} /></div>
                <div className="relative"><input id="c-phone" name="phone" type="tel" placeholder=" " autoComplete="tel" className={line} /><label htmlFor="c-phone" className={lab}>Phone</label><span className={bar} /></div>
                <div className="relative"><input id="c-email" name="email" type="email" placeholder=" " autoComplete="email" className={line} /><label htmlFor="c-email" className={lab}>Email</label><span className={bar} /></div>
                <div className="relative"><select id="c-topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={`${line} text-white`}>{TOPICS.map(([v, l]) => <option key={v} value={v} className="bg-navy">{l}</option>)}</select>
                  <label htmlFor="c-topic" className="pointer-events-none absolute left-0 top-0 origin-left scale-75 text-mist">I would like to</label><span className={bar} /></div>
                <div className="relative md:col-span-2"><textarea id="c-msg" name="message" required rows={4} maxLength={2000} placeholder=" " className={`${line} resize-none`} /><label htmlFor="c-msg" className={lab}>How can we help?</label><span className={bar} /></div>
                <div className="flex flex-wrap items-center gap-6 md:col-span-2">
                  <Button type="submit" disabled={state.s === 'sending'}>{state.s === 'sending' ? 'Sending' : 'Send message'}</Button>
                  <p role="alert" className="text-sm text-[#ff9a9a]">{state.s === 'error' && state.msg}</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
