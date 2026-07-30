# Virava Chemicals — Website + Admin Dashboard

Modern redesign of viravachemicals.com. **React** (frontend) + **Node.js/Express** (API) + **PostgreSQL** (database).
Brand palette (navy + red + white) and all imagery are taken from the original Virava site.

## Quick start

Double‑click **`start-all.bat`** (starts DB + API + website), then open:

- Website: <http://localhost:5190>
- Admin panel: <http://localhost:5190/admin>
- Admin login: `admin@viravachemicals.com` / `Virava@2026`

To stop: close the two console windows, then run `database\stop.bat`.

## Manual start (3 terminals)

```bat
:: 1) Database (portable PostgreSQL, port 5433)
database\start.bat

:: 2) API server (port 5000)
cd server && node src/app.js

:: 3) Website (Vite dev server, port 5190)
cd client && npm run dev -- --port 5190
```

## Project structure

```
Virava Chemicals/
  client/      React app — public site + /admin dashboard (Vite)
  server/      Express API (node-postgres, JWT auth, image uploads)
    db/schema.sql   database tables
    db/seed.js      seed real Virava data + default admin
  database/    portable PostgreSQL binaries + data + start/stop scripts
  assets/      original images downloaded from viravachemicals.com
```

## What the admin can manage

Dashboard overview · Enquiries inbox (from contact form) · Products · Categories ·
Industries · Principals · Hero slides · Site settings (contact info, about text, stats).

## Re-seed the database (resets all content)

```bat
:: recreate tables
database\pgsql\bin\psql -h 127.0.0.1 -p 5433 -U postgres -d virava -f server\db\schema.sql
:: (password: virava)
cd server && node db/seed.js
```

## Configuration

Server settings live in `server/.env` (DB connection, JWT secret, default admin credentials).
Change `ADMIN_PASSWORD` and `JWT_SECRET` before going live.

## Notes on deployment

This is a Node.js + PostgreSQL app, so it needs a host that runs Node and PostgreSQL
(a VPS, or a platform like Render/Railway) — not a plain PHP/MySQL shared host.
Build the frontend with `cd client && npm run build` (outputs `client/dist`).
