# Deploying Virava Chemicals to Render

The project is already Render-ready: a single Node web service builds the React
client and serves it with the API, backed by a Render PostgreSQL database. The
database schema + seed data are applied automatically on the first deploy.

## Steps

### 1. Put the code on GitHub
Create a new **empty** repo on GitHub (e.g. `virava-chemicals`), then from the
project folder:

```bash
git remote add origin https://github.com/<your-username>/virava-chemicals.git
git push -u origin main
```

### 2. Deploy on Render
1. Go to <https://dashboard.render.com> → **New +** → **Blueprint**.
2. Connect your GitHub and select the `virava-chemicals` repo.
3. Render reads `render.yaml` and shows a PostgreSQL DB + a web service. Click **Apply**.
4. Wait for the build (~3-5 min). The first boot creates the tables and seeds data.
5. Open the service URL — the live site. Admin panel at `/admin`.

### Default admin login
- Email: `admin@viravachemicals.com`
- Password: `Virava@2026`  → **change this** in Render → service → Environment.

## Notes / free tier
- Free web service **sleeps after ~15 min** of inactivity; the next visit takes
  ~50s to wake (cold start). Upgrade to a paid instance to keep it always on.
- Free PostgreSQL is time-limited by Render; for a long-lived client site use a
  paid database plan so data is not deleted.
- `VITE_HOME_ONLY` env var: `false` = full site, `true` = home page only
  (change in `render.yaml` or the Render dashboard, then redeploy).
- Uploaded images (admin) are stored on the service disk, which is ephemeral on
  free plans — attach a Render Disk or use external storage for persistence.
