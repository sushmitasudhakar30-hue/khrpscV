import 'dotenv/config';
import mongoose from 'mongoose';
import { Content } from './content.js';
import { IMPACT, PROGRAMS, STEPS } from '../client/src/data/content.js';

const DEFAULTS = { impact: IMPACT, programs: PROGRAMS, steps: STEPS };

// Fills any empty collection with the default copy. With reset=true, replaces everything.
export async function seedDefaults({ reset = false } = {}) {
  for (const [type, items] of Object.entries(DEFAULTS)) {
    if (reset) await Content.deleteMany({ type });
    else if (await Content.exists({ type })) continue;
    await Content.insertMany(items.map((data, order) => ({ type, order, data })));
    console.log(`Seeded ${items.length} ${type}`);
  }
}

// `npm run seed` (add -- --reset to overwrite existing content)
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).pop())) {
  await mongoose.connect(process.env.MONGO_URI);
  await seedDefaults({ reset: process.argv.includes('--reset') });
  await mongoose.disconnect();
}
