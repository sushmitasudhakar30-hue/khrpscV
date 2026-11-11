# KHRPSC website (MERN)
1. Install MongoDB locally or use Atlas.
2. `npm run install:all`
3. `cp server/.env.example server/.env` and set MONGO_URI
4. `npm run dev` -> client http://localhost:5173, API :5000
Messages go to the `messages` collection. Add events in MongoDB (`events`: title, date, location).

## Immersive front end
- Stack: React + Vite, Tailwind CSS, Framer Motion, Lenis (smooth scroll); Express + MongoDB API.
- Impact figures, programs, process steps and testimonials live in MongoDB (`contents` collection, types `impact`, `programs`, `steps`, `stories`). On first start the server seeds the first three from `client/src/data/content.js`; `npm --prefix server run seed -- --reset` re-seeds. The built-in copy is also the front-end fallback. Impact figures are placeholders: verify before launch.
- Admin screen: open `/admin` (e.g. http://localhost:5173/admin) and sign in with `ADMIN_KEY`. Edit, add, delete and reorder impact figures, programs, steps and testimonials; manage events; read and mark contact messages as handled; view, copy and export (CSV) newsletter subscribers.
- Admin API (used by the screen): set `ADMIN_KEY` in `server/.env`, then send `x-admin-key` with `POST /api/admin/content` (`{type, order, data}`), `PUT /api/admin/content/:id` or `DELETE /api/admin/content/:id`. Or edit documents directly in Atlas/Compass. Testimonials: add `{type:'stories', data:{quote,name,role}}` (only with the person's permission).
- Real photography: drop files in `client/src/assets/photos` (`hero`, `hero-video`, `mission`; see `lib/photos.js`) and `assets/gallery`. Without them the site uses art-directed graphics.
- Subscribers go to the `subscribers` collection.
