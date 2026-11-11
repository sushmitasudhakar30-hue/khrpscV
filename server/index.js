// Local / Render entry point. On Vercel the app is served through api/index.js.
import app, { connectDb } from './app.js';
await connectDb();
app.listen(process.env.PORT || 5000, () => console.log('API running'));
