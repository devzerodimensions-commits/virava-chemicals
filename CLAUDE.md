# Virava Chemicals — working notes

React (Vite) + Express + PostgreSQL. Public site plus an admin panel at `/admin`.
Live: https://virava-chemicals.onrender.com

**The client's own domain, viravachemicals.com, still serves the OLD pre-rebuild
jQuery site.** It has never pointed at this project. This is deliberate, not an
oversight — the client wants the old site to stay up and will cut over later. So
when checking whether a change went live, always use the onrender.com URL;
viravachemicals.com will not reflect this codebase until DNS is repointed. Don't
raise it as a bug, and don't change it without being asked.

## Layout

```
client/src/pages/      public pages
client/src/admin/      admin panel (CrudManager drives most CRUD screens)
server/src/routes/     public.js (open) + admin.js (JWT-guarded)
server/db/schema.sql   tables
server/db/seed.js      seed data for a fresh database
server/db/godrej-catalogue.js   the client's product sheet — authoritative
server/db/ensure.js    runs on boot: schema+seed if empty, then migrations
```

## Deployment — read before pushing

- **Auto-deploy is OFF.** A push does nothing on its own. Trigger the Render
  deploy hook, or the live site silently sits behind GitHub. This has caused
  confusion twice.
- **Do not fire the hook several times in quick succession.** Overlapping builds
  get superseded and one silently never runs.
- Free instance sleeps after ~15 min; first request takes ~50s.
- **Database is Neon** (free tier), not Render. `DATABASE_URL` is set in the
  Render dashboard (`sync: false` in render.yaml). The original Render Postgres
  expired on the free plan and took the whole site down — see below.
- Verify a deploy by fetching `/` and matching the bundle hash against the local
  `client/dist` build. Do not trust a 200 from an asset path: unmatched paths
  return `index.html`, so any URL "succeeds".

## Migrations — the trap

`ensure.js` migrations are one-shot, gated on a marker row in `site_settings`.
**Every new batch of changes needs its own key.** Reusing a spent key means the
migration silently never runs — caught this twice. Pattern:

```js
const KEY = 'migration_<thing>_v1';
if ((await query('SELECT 1 FROM site_settings WHERE key=$1',[KEY])).rowCount) return;
// ... work ...
await query(`INSERT INTO site_settings ... ON CONFLICT (key) DO UPDATE ...`, [KEY, ...]);
```

Migrations retire superseded rows with `is_active=false` rather than deleting, so
nothing is lost and an admin can switch things back on. When matching existing
rows, key on **category + name**, not name alone — several products share a name
across categories and matching on name alone left duplicates.

`ensure.js` must never `process.exit(1)`. Boot is `ensure.js && app.js`, so
exiting takes the whole site down instead of degrading it.

## Data

`Godrej Products.xlsx` and `Virava Chemicals.docx` sit in the project root,
gitignored (the xlsx carries per-kg rates — keep it out of the repo). The sheet
is transcribed into `godrej-catalogue.js`: 21 categories, 99 products under four
solutions. It supersedes an earlier catalogue scraped from godrejchemicals.com,
which listed grades Virava does not sell.

Suspected typos, transcribed as written rather than guessed — confirm with the
client: `Ginsaul 68N` (elsewhere Ginasul), `Ginonioc L2…` ×6 (elsewhere
Ginonic), `Ginamde 22CP` (likely Ginamide).

## CSS trap seen three times

A bare descendant selector on a generic element reaches into child components:

- `.highlight span` hit the icon `<span>` and stripped its colour and grid
- `.stat span` hit `Counter`'s inner `<span>` and rendered the figures at label
  size — they had never displayed at their intended size
- same shape in the product card markup

Scope to `.parent > span`, or give the element its own class.

Related: entrance animations must not depend on `animation-fill-mode` or an
opacity keyframe at `t=0`. A started-but-frozen animation (background tab,
crawler, headless renderer) paints frame 0 — an `opacity: 0` there renders the
H1 invisible. Stagger by *duration*, animate transform only. `theme.css` carries
the same warning on `.reveal`.

## Outstanding

1. **Client's About/Mission copy is not applied.** `Virava Chemicals.docx` says
   founded **1996** (site says 1997, incl. the hardcoded `<title>` in
   `client/index.html`), **2500+** customers (site says 3,000), **Gujarat** (site
   says India). The mission statement and four "core values" on the About page
   were written by Claude, not the client — replace with their five guiding
   principles. Their origin story (Rollwalla group split, 30% CAGR, staff
   retention) is unused.
2. **No enquiries backup.** Customer leads exist only in the database. Add an
   admin export plus a scheduled dump.
3. **Seeded admin password** `Virava@2026` is committed in plain text in
   render.yaml, .env.example, README.md, DEPLOY.md. Fix via Admin → Users: add a
   real account, sign in as it, delete the seeded one. Changing `ADMIN_PASSWORD`
   does **not** work — it is only read when the admin row is first created.
4. Turn on auto-deploy; rotate the Render deploy hook.
5. Uploaded media does not survive deploys (Render disk is ephemeral). The Media
   tab is for browsing/reusing committed images, not storing new ones. Fix with
   Cloudinary/S3.
6. HPL, OCCL and Standard Chemicals still use the old tabbed `PrincipalDetail`
   with product modals — the last place the modal survives.
7. `occl-products.jpg` is 440 KB, ~3× the other category images.

## Verifying

There is a local Postgres under `database/` (`start.bat` / `stop.bat`, port
5433). Preview via `.claude/launch.json`. Screenshots often hang on pages with
the sticky hero — measure with `preview_eval` (computed styles, bounding boxes)
instead, which is more reliable anyway. The preview renders in a hidden tab, so
`requestAnimationFrame` and IntersectionObserver do not fire; anything depending
on them appears frozen and needs a fallback path rather than a fix to the test.
