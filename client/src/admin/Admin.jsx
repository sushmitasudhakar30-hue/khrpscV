import { useCallback, useEffect, useState } from 'react';
import { EventsPanel, MessagesPanel, SubscribersPanel } from './Panels.jsx';

const ART = ['arcs', 'columns', 'nodes', 'rings'];
const TOPICS = ['legal', 'aid', 'donate', 'volunteer', 'other'];
const SCHEMA = {
  impact: { label: 'Impact figures', title: (d) => d.label, blank: { to: 0, suffix: '+', label: 'New figure', note: '' },
    fields: [['to', 'Number', 'number'], ['suffix', 'Suffix, e.g. +', 'text'], ['label', 'Label', 'text'], ['note', 'Description', 'textarea']] },
  programs: { label: 'Programs', title: (d) => d.title, blank: { category: '', title: 'New program', text: '', more: '', indicator: '', topic: 'other', art: 'arcs' },
    fields: [['title', 'Title', 'text'], ['category', 'Category', 'text'], ['text', 'Description', 'textarea'], ['more', 'Revealed on hover', 'textarea'], ['indicator', 'Indicator line', 'text'], ['topic', 'Contact form topic', 'select', TOPICS], ['art', 'Visual', 'select', ART]] },
  steps: { label: 'Process steps', title: (d) => d.t, blank: { t: 'New step', d: '', art: 'rings' },
    fields: [['t', 'Title', 'text'], ['d', 'Description', 'textarea'], ['art', 'Visual', 'select', ART]] },
  stories: { label: 'Testimonials', title: (d) => d.name, blank: { quote: '', name: '', role: '', image: '' },
    fields: [['quote', 'Quote', 'textarea'], ['name', 'Name or initials', 'text'], ['role', 'Role', 'text'], ['image', 'Photo URL (optional)', 'text']] },
};
const TABS = [...Object.entries(SCHEMA).map(([k, v]) => [k, v.label]), ['events', 'Events'], ['messages', 'Messages'], ['subscribers', 'Subscribers']];
const strip = ({ _id, ...d }) => d;
const input = 'w-full rounded border border-navy/25 bg-white px-3 py-2 text-navy focus:border-gold';
const btn = 'rounded px-4 py-2 text-sm font-semibold disabled:opacity-40';

function Field({ f, value, onChange }) {
  const [k, label, kind, opts] = f;
  const common = { id: `f-${k}`, className: input, value: value ?? '' };
  return (
    <div className={kind === 'textarea' ? 'md:col-span-2' : ''}>
      <label htmlFor={common.id} className="mb-1 block text-sm text-navy/70">{label}</label>
      {kind === 'textarea' ? <textarea {...common} rows={3} onChange={(e) => onChange(k, e.target.value)} />
        : kind === 'select' ? <select {...common} onChange={(e) => onChange(k, e.target.value)}>{opts.map((o) => <option key={o}>{o}</option>)}</select>
        : <input {...common} type={kind} onChange={(e) => onChange(k, kind === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)} />}
    </div>
  );
}

function Row({ type, item, index, count, call, reload, move }) {
  const S = SCHEMA[type];
  const [d, setD] = useState(strip(item)), [msg, setMsg] = useState('');
  const dirty = JSON.stringify(d) !== JSON.stringify(strip(item));
  const run = async (fn, ok) => { setMsg('Working…'); try { await fn(); setMsg(ok); } catch (e) { setMsg(e.message); } };
  const save = () => run(async () => { await call(`/api/admin/content/${item._id}`, { method: 'PUT', body: JSON.stringify({ data: { ...d, ...(type === 'impact' ? { to: d.to === '' ? 0 : d.to } : {}) } }) }); await reload(); }, 'Saved');
  const del = () => window.confirm(`Delete "${S.title(d) || 'this item'}"?`) && run(async () => { await call(`/api/admin/content/${item._id}`, { method: 'DELETE' }); await reload(); }, '');
  return (
    <li className="rounded border border-navy/15 bg-paper-2/60 p-5">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="mr-auto font-sans text-lg font-semibold">{S.title(d) || 'Untitled'}</h3>
        <button className={`${btn} border border-navy/25`} disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up">↑</button>
        <button className={`${btn} border border-navy/25`} disabled={index === count - 1} onClick={() => move(index, 1)} aria-label="Move down">↓</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{S.fields.map((f) => <Field key={f[0]} f={f} value={d[f[0]]} onChange={(k, v) => setD((p) => ({ ...p, [k]: v }))} />)}</div>
      <div className="mt-4 flex items-center gap-3">
        <button className={`${btn} bg-navy text-white`} disabled={!dirty} onClick={save}>Save</button>
        <button className={`${btn} border border-red-700/40 text-red-800`} onClick={del}>Delete</button>
        <p role="status" className="text-sm text-navy/70">{dirty && !msg ? 'Unsaved changes' : msg}</p>
      </div>
    </li>
  );
}

function Login({ onKey }) {
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); const key = e.target.key.value; setBusy(true); setErr('');
    try {
      const r = await fetch('/api/admin/check', { headers: { 'x-admin-key': key } });
      if (r.status === 429) throw new Error('Too many attempts. Try again in a few minutes.');
      if (!r.ok) throw new Error('That key is not correct.');
      sessionStorage.setItem('khrpsc-admin', key); onKey(key);
    } catch (x) { setErr(x.message === 'Failed to fetch' ? 'Cannot reach the server.' : x.message); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="mx-auto mt-28 max-w-sm rounded border border-navy/15 bg-white p-8">
      <h1 className="font-sans text-2xl font-semibold">Admin sign in</h1>
      <label htmlFor="key" className="mb-1 mt-6 block text-sm text-navy/70">Admin key</label>
      <input id="key" name="key" type="password" required autoFocus autoComplete="current-password" className={input} />
      <button className={`${btn} mt-5 w-full bg-navy text-white`} disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
      <p role="alert" className="mt-3 min-h-5 text-sm text-red-800">{err}</p>
    </form>
  );
}

function Dashboard({ adminKey, signOut }) {
  const [tab, setTab] = useState('impact'), [data, setData] = useState(null), [err, setErr] = useState('');
  const call = useCallback(async (path, opts = {}) => {
    const r = await fetch(path, { ...opts, headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey } });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401) { signOut(); throw new Error('Signed out.'); }
    if (!r.ok) throw new Error(j.error || 'Request failed.');
    return j;
  }, [adminKey, signOut]);
  const reload = useCallback(() => fetch('/api/content').then((r) => r.json()).then((j) => { setData(j); setErr(''); }).catch(() => setErr('Could not load content.')), []);
  useEffect(() => { reload(); }, [reload]);
  const list = data?.[tab] || [];
  const add = async () => { try { await call('/api/admin/content', { method: 'POST', body: JSON.stringify({ type: tab, order: list.length, data: SCHEMA[tab].blank }) }); await reload(); } catch (e) { setErr(e.message); } };
  const move = async (i, dir) => {
    const next = [...list]; [next[i], next[i + dir]] = [next[i + dir], next[i]];
    try { await Promise.all(next.map((it, n) => call(`/api/admin/content/${it._id}`, { method: 'PUT', body: JSON.stringify({ order: n }) }))); await reload(); } catch (e) { setErr(e.message); }
  };
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="flex flex-wrap items-center gap-4">
        <h1 className="mr-auto font-sans text-3xl font-semibold">Site content</h1>
        <a href="/" className="text-sm underline">View site</a>
        <button onClick={signOut} className={`${btn} border border-navy/25`}>Sign out</button>
      </header>
      <div role="tablist" className="mt-8 flex flex-wrap gap-2 border-b border-navy/15">
        {TABS.map(([k, label]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => { setTab(k); setErr(''); }} className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold ${tab === k ? 'border-gold text-navy' : 'border-transparent text-navy/55 hover:text-navy'}`}>{label}</button>)}
      </div>
      {tab === 'events' ? <EventsPanel call={call} /> : tab === 'messages' ? <MessagesPanel call={call} /> : tab === 'subscribers' ? <SubscribersPanel call={call} /> : (<>
        {tab === 'stories' && <p className="mt-5 text-sm text-navy/70">Add testimonials only with the person's permission. While this list is empty, the site shows the three default principles instead.</p>}
        {tab === 'impact' && <p className="mt-5 text-sm text-navy/70">These figures appear publicly on the site. Enter only verified numbers.</p>}
        <p role="alert" className="mt-4 text-sm text-red-800">{err}</p>
        {!data ? <p className="mt-8">Loading…</p> : (
          <ul className="mt-6 space-y-5">
            {list.length === 0 && <li className="text-navy/60">Nothing here yet.</li>}
            {list.map((it, i) => <Row key={it._id} type={tab} item={it} index={i} count={list.length} call={call} reload={reload} move={move} />)}
          </ul>)}
        <button onClick={add} className={`${btn} mt-6 bg-gold text-ink`}>Add {SCHEMA[tab].label.toLowerCase().replace(/s$/, '')}</button>
      </>)}
    </div>
  );
}

export default function Admin() {
  const [key, setKey] = useState(() => { try { return sessionStorage.getItem('khrpsc-admin'); } catch { return null; } });
  useEffect(() => { document.title = 'Admin | KHRPSC'; const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.append(m); return () => m.remove(); }, []);
  const signOut = useCallback(() => { try { sessionStorage.removeItem('khrpsc-admin'); } catch {} setKey(null); }, []);
  return <div className="min-h-screen bg-paper font-sans text-navy">{key ? <Dashboard adminKey={key} signOut={signOut} /> : <Login onKey={setKey} />}</div>;
}
