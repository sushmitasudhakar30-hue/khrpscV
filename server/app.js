import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import crypto from 'node:crypto';
import { Content, TYPES } from './content.js';
import { seedDefaults } from './seed.js';

const Message = mongoose.model('Message', new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  topic: { type: String, enum: ['legal', 'aid', 'donate', 'volunteer', 'other'], default: 'other' },
  message: { type: String, required: true, maxlength: 2000 },
  handled: { type: Boolean, default: false },
}, { timestamps: true }));

const Subscriber = mongoose.model('Subscriber', new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 120 },
}, { timestamps: true }));

const Event = mongoose.model('Event', new mongoose.Schema({
  title: String, date: Date, location: String, summary: String,
}));

const app = express();
app.set('trust proxy', 1); // correct client IPs for rate limiting behind Vercel/Render
app.use(helmet(), cors({ origin: process.env.CLIENT_ORIGIN }), express.json({ limit: '10kb' }));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use(async (_, res, next) => { try { await connectDb(); next(); } catch { res.status(503).json({ error: 'Database unavailable.' }); } });
app.get('/api/events', async (_, res) => {
  res.json(await Event.find({ date: { $gte: new Date() } }).sort('date').limit(6));
});
app.post('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), async (req, res) => {
  try {
    const { name, email, phone, topic, message } = req.body;
    if (!name || !message || (!email && !phone)) return res.status(400).json({ error: 'Name, message and email or phone are required.' });
    await Message.create({ name, email, phone, topic, message });
    res.status(201).json({ ok: true });
  } catch { res.status(400).json({ error: 'Could not save your message.' }); }
});

app.post('/api/subscribe', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  try { await Subscriber.updateOne({ email }, { email }, { upsert: true }); res.status(201).json({ ok: true }); }
  catch { res.status(500).json({ error: 'Could not subscribe. Please try again.' }); }
});

// ---- Site content (impact, programs, steps, stories) ----
app.get('/api/content', async (_, res) => {
  try {
    const out = Object.fromEntries(TYPES.map((t) => [t, []]));
    for (const r of await Content.find().sort('order')) out[r.type].push({ ...r.data, _id: r._id });
    res.json(out);
  } catch { res.status(500).json({ error: 'Could not load content.' }); }
});

// Editing needs the ADMIN_KEY from server/.env, sent as the x-admin-key header.
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const admin = [rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), (req, res, next) =>
  process.env.ADMIN_KEY && safeEq(req.get('x-admin-key') || '', process.env.ADMIN_KEY) ? next() : res.status(401).json({ error: 'Unauthorized.' })];
const clean = ({ _id, ...d }) => d;
const valid = (b) => b && typeof b.data === 'object' && b.data !== null && !Array.isArray(b.data);

// Sign-in check for the admin screen; only failed attempts count towards the limit.
app.get('/api/admin/check', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, skipSuccessfulRequests: true }), ...admin, (_, res) => res.json({ ok: true }));

app.post('/api/admin/content', admin, async (req, res) => {
  if (!TYPES.includes(req.body.type) || !valid(req.body)) return res.status(400).json({ error: `type must be one of ${TYPES.join(', ')} and data must be an object.` });
  const doc = await Content.create({ type: req.body.type, order: Number(req.body.order) || 0, data: clean(req.body.data) });
  res.status(201).json(doc);
});
app.put('/api/admin/content/:id', admin, async (req, res) => {
  const set = {}; if (valid(req.body)) set.data = clean(req.body.data); if (req.body.order !== undefined) set.order = Number(req.body.order) || 0;
  const doc = await Content.findByIdAndUpdate(req.params.id, set, { new: true }).catch(() => null);
  doc ? res.json(doc) : res.status(404).json({ error: 'Not found.' });
});
app.delete('/api/admin/content/:id', admin, async (req, res) => {
  const doc = await Content.findByIdAndDelete(req.params.id).catch(() => null);
  doc ? res.json({ ok: true }) : res.status(404).json({ error: 'Not found.' });
});

// ---- Admin: events, messages, subscribers ----
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(() => res.status(500).json({ error: 'Server error.' }));
const remove = (Model) => wrap(async (req, res) => { const d = await Model.findByIdAndDelete(req.params.id).catch(() => null); d ? res.json({ ok: true }) : res.status(404).json({ error: 'Not found.' }); });
const evData = (b = {}) => {
  const date = new Date(b.date);
  if (!b.title || Number.isNaN(date.getTime())) return null;
  return { title: String(b.title).slice(0, 120), date, location: String(b.location || '').slice(0, 160), summary: String(b.summary || '').slice(0, 500) };
};
app.get('/api/admin/events', admin, wrap(async (_, res) => res.json(await Event.find().sort('date'))));
app.post('/api/admin/events', admin, wrap(async (req, res) => {
  const d = evData(req.body); if (!d) return res.status(400).json({ error: 'A title and a valid date are required.' });
  res.status(201).json(await Event.create(d));
}));
app.put('/api/admin/events/:id', admin, wrap(async (req, res) => {
  const d = evData(req.body); if (!d) return res.status(400).json({ error: 'A title and a valid date are required.' });
  const doc = await Event.findByIdAndUpdate(req.params.id, d, { new: true }).catch(() => null);
  doc ? res.json(doc) : res.status(404).json({ error: 'Not found.' });
}));
app.delete('/api/admin/events/:id', admin, remove(Event));

app.get('/api/admin/messages', admin, wrap(async (_, res) => res.json(await Message.find().sort('-createdAt').limit(200))));
app.put('/api/admin/messages/:id', admin, wrap(async (req, res) => {
  const doc = await Message.findByIdAndUpdate(req.params.id, { handled: !!req.body.handled }, { new: true }).catch(() => null);
  doc ? res.json(doc) : res.status(404).json({ error: 'Not found.' });
}));
app.delete('/api/admin/messages/:id', admin, remove(Message));

app.get('/api/admin/subscribers', admin, wrap(async (_, res) => res.json(await Subscriber.find().sort('-createdAt').limit(5000))));
app.delete('/api/admin/subscribers/:id', admin, remove(Subscriber));

// One cached connection, reused across serverless invocations.
let ready;
export const connectDb = () => (ready ||= mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
  .then(() => seedDefaults())
  .catch((e) => { ready = null; throw e; }));

export default app;
