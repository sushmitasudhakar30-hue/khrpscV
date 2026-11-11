import { useCallback, useEffect, useState } from 'react';

const input = 'w-full rounded border border-navy/25 bg-white px-3 py-2 text-navy focus:border-gold';
const btn = 'rounded px-4 py-2 text-sm font-semibold disabled:opacity-40';
const card = 'rounded border border-navy/15 bg-paper-2/60 p-5';
const toLocal = (iso) => { const d = new Date(iso); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const when = (iso) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

function useList(call, path) {
  const [list, setList] = useState(null), [err, setErr] = useState('');
  const reload = useCallback(() => call(path).then((j) => { setList(j); setErr(''); }).catch((e) => setErr(e.message)), [call, path]);
  useEffect(() => { reload(); }, [reload]);
  return { list, err, setErr, reload };
}
const Status = ({ err }) => <p role="alert" className="mt-4 text-sm text-red-800">{err}</p>;

/* ---------- Events ---------- */
function EventRow({ ev, call, reload }) {
  const base = { title: ev.title, date: toLocal(ev.date), location: ev.location || '', summary: ev.summary || '' };
  const [d, setD] = useState(base), [msg, setMsg] = useState('');
  const dirty = JSON.stringify(d) !== JSON.stringify(base), past = new Date(ev.date) < new Date();
  const set = (k) => (e) => setD((p) => ({ ...p, [k]: e.target.value }));
  const run = async (fn, ok) => { setMsg('Working…'); try { await fn(); setMsg(ok); } catch (e) { setMsg(e.message); } };
  const save = () => run(async () => { await call(`/api/admin/events/${ev._id}`, { method: 'PUT', body: JSON.stringify({ ...d, date: new Date(d.date).toISOString() }) }); await reload(); }, 'Saved');
  const del = () => window.confirm(`Delete "${d.title}"?`) && run(async () => { await call(`/api/admin/events/${ev._id}`, { method: 'DELETE' }); await reload(); }, '');
  return (
    <li className={card}>
      <p className="mb-3 text-sm text-navy/60">{past ? 'Past event, no longer shown on the site' : 'Upcoming, shown on the site'}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="mb-1 block text-sm text-navy/70" htmlFor={`t-${ev._id}`}>Title</label><input id={`t-${ev._id}`} className={input} value={d.title} onChange={set('title')} /></div>
        <div><label className="mb-1 block text-sm text-navy/70" htmlFor={`d-${ev._id}`}>Date and time</label><input id={`d-${ev._id}`} type="datetime-local" className={input} value={d.date} onChange={set('date')} /></div>
        <div><label className="mb-1 block text-sm text-navy/70" htmlFor={`l-${ev._id}`}>Location</label><input id={`l-${ev._id}`} className={input} value={d.location} onChange={set('location')} /></div>
        <div><label className="mb-1 block text-sm text-navy/70" htmlFor={`s-${ev._id}`}>Summary</label><input id={`s-${ev._id}`} className={input} value={d.summary} onChange={set('summary')} /></div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button className={`${btn} bg-navy text-white`} disabled={!dirty || !d.date} onClick={save}>Save</button>
        <button className={`${btn} border border-red-700/40 text-red-800`} onClick={del}>Delete</button>
        <p role="status" className="text-sm text-navy/70">{dirty && !msg ? 'Unsaved changes' : msg}</p>
      </div>
    </li>
  );
}
export function EventsPanel({ call }) {
  const { list, err, setErr, reload } = useList(call, '/api/admin/events');
  const add = async () => {
    const t = new Date(Date.now() + 7 * 864e5); t.setHours(10, 0, 0, 0);
    try { await call('/api/admin/events', { method: 'POST', body: JSON.stringify({ title: 'New event', date: t.toISOString(), location: '', summary: '' }) }); await reload(); } catch (e) { setErr(e.message); }
  };
  return (<>
    <p className="mt-5 text-sm text-navy/70">Only upcoming events appear on the site, soonest first.</p><Status err={err} />
    {!list ? <p className="mt-8">Loading…</p> : <ul className="mt-6 space-y-5">{list.length === 0 && <li className="text-navy/60">No events yet.</li>}{list.map((e) => <EventRow key={e._id} ev={e} call={call} reload={reload} />)}</ul>}
    <button onClick={add} className={`${btn} mt-6 bg-gold text-ink`}>Add event</button>
  </>);
}

/* ---------- Messages ---------- */
const TOPIC = { legal: 'Legal support', aid: 'Financial or welfare aid', donate: 'Donate', volunteer: 'Volunteer', other: 'Something else' };
export function MessagesPanel({ call }) {
  const { list, err, setErr, reload } = useList(call, '/api/admin/messages');
  const [hide, setHide] = useState(false);
  const act = async (fn) => { try { await fn(); await reload(); } catch (e) { setErr(e.message); } };
  const shown = (list || []).filter((m) => !(hide && m.handled));
  return (<>
    <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-navy/70">
      <p>{list ? `${list.filter((m) => !m.handled).length} to handle, ${list.length} in total (latest 200)` : ''}</p>
      <label className="flex items-center gap-2"><input type="checkbox" checked={hide} onChange={(e) => setHide(e.target.checked)} /> Hide handled</label>
    </div><Status err={err} />
    {!list ? <p className="mt-8">Loading…</p> : <ul className="mt-6 space-y-5">
      {shown.length === 0 && <li className="text-navy/60">No messages.</li>}
      {shown.map((m) => (
        <li key={m._id} className={`${card} ${m.handled ? 'opacity-60' : ''}`}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-sans text-lg font-semibold">{m.name}</h3>
            {!m.handled && <span className="rounded bg-gold px-2 py-0.5 text-xs font-semibold text-ink">New</span>}
            <span className="text-sm text-navy/60">{TOPIC[m.topic] || m.topic}</span>
            <span className="ml-auto text-sm text-navy/60">{when(m.createdAt)}</span>
          </div>
          <p className="mt-2 flex flex-wrap gap-x-5 text-sm">
            {m.phone && <a className="underline" href={`tel:${m.phone}`}>{m.phone}</a>}
            {m.email && <a className="underline" href={`mailto:${m.email}`}>{m.email}</a>}
          </p>
          <p className="mt-3 whitespace-pre-wrap">{m.message}</p>
          <div className="mt-4 flex gap-3">
            <button className={`${btn} bg-navy text-white`} onClick={() => act(() => call(`/api/admin/messages/${m._id}`, { method: 'PUT', body: JSON.stringify({ handled: !m.handled }) }))}>{m.handled ? 'Mark as new' : 'Mark as handled'}</button>
            <button className={`${btn} border border-red-700/40 text-red-800`} onClick={() => window.confirm(`Delete the message from ${m.name}?`) && act(() => call(`/api/admin/messages/${m._id}`, { method: 'DELETE' }))}>Delete</button>
          </div>
        </li>))}
    </ul>}
  </>);
}

/* ---------- Subscribers ---------- */
export function SubscribersPanel({ call }) {
  const { list, err, setErr, reload } = useList(call, '/api/admin/subscribers');
  const [note, setNote] = useState('');
  const csv = () => {
    const blob = new Blob([['email,subscribed', ...list.map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`)].join('\n')], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'khrpsc-subscribers.csv' }); a.click(); URL.revokeObjectURL(a.href);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(list.map((s) => s.email).join(', ')); setNote('Copied'); } catch { setNote('Could not copy'); } };
  return (<>
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <p className="mr-auto text-sm text-navy/70">{list ? `${list.length} subscriber${list.length === 1 ? '' : 's'}` : ''}</p>
      <button className={`${btn} border border-navy/25`} disabled={!list?.length} onClick={copy}>Copy emails</button>
      <button className={`${btn} bg-navy text-white`} disabled={!list?.length} onClick={csv}>Download CSV</button>
      <span role="status" className="text-sm text-navy/70">{note}</span>
    </div><Status err={err} />
    {!list ? <p className="mt-8">Loading…</p> : <ul className="mt-6 divide-y divide-navy/15 border-y border-navy/15">
      {list.length === 0 && <li className="py-4 text-navy/60">No subscribers yet.</li>}
      {list.map((s) => (
        <li key={s._id} className="flex items-center gap-4 py-3">
          <span className="mr-auto break-all">{s.email}</span><span className="text-sm text-navy/60">{when(s.createdAt)}</span>
          <button className="text-sm text-red-800 underline" onClick={async () => { if (window.confirm(`Remove ${s.email}?`)) try { await call(`/api/admin/subscribers/${s._id}`, { method: 'DELETE' }); await reload(); } catch (e) { setErr(e.message); } }}>Remove</button>
        </li>))}
    </ul>}
  </>);
}
