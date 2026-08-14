// Runs on server start. Fresh DB -> apply schema + seed. Existing DB -> run
// idempotent migrations (so schema changes reach an already-deployed database).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from '../src/db.js';
import { run as seed, categories as seedCategories, products as seedProducts, slug } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  // categories.principal_id (added later) — add if missing, then backfill mapping
  await query('ALTER TABLE categories ADD COLUMN IF NOT EXISTS principal_id INT');
  const c = await query('SELECT count(*)::int AS n FROM categories WHERE principal_id IS NOT NULL');
  if (c.rows[0].n === 0) {
    const pr = await query('SELECT id, name FROM principals');
    const key = {};
    for (const p of pr.rows) {
      const n = p.name.toLowerCase();
      if (n.includes('godrej')) key.godrej = p.id;
      else if (n.includes('hpl')) key.hpl = p.id;
      else if (n.includes('oriental')) key.occl = p.id;
      else if (n.includes('standard')) key.std = p.id;
    }
    const cats = await query('SELECT id, name FROM categories');
    for (const cat of cats.rows) {
      const n = cat.name.toLowerCase();
      const pid = n.includes('hpl') ? key.hpl : n.includes('occl') ? key.occl
        : n.includes('std') ? key.std : key.godrej;
      if (pid) await query('UPDATE categories SET principal_id = $1 WHERE id = $2', [pid, cat.id]);
    }
    console.log('Migration: backfilled category -> principal mapping.');
  }

  await syncGodrejCatalogue();
}

// The Godrej trade-name catalogue (Ginol / Lubolic / Hystric / Textric / Distric /
// pharmacopoeial glycerin) plus the Stearic Acids and Oleic Acids categories were
// added after the first deploy. Insert whatever is missing so an already-seeded
// database picks them up.
//
// Gated on a one-shot marker rather than running every boot: without it, anything
// an admin deliberately deletes in the panel would silently reappear on restart.
async function syncGodrejCatalogue() {
  const KEY = 'migration_godrej_catalogue';
  const done = await query('SELECT 1 FROM site_settings WHERE key = $1', [KEY]);
  if (done.rowCount) return;

  const pr = await query('SELECT id, name FROM principals');
  const principalFor = (name) => {
    const n = name.toLowerCase();
    const find = (m) => pr.rows.find((p) => p.name.toLowerCase().includes(m))?.id ?? null;
    if (n.includes('hpl')) return find('hpl');
    if (n.includes('occl')) return find('oriental');
    if (n.includes('std')) return find('standard');
    return find('godrej');
  };

  const catBySlug = new Map(
    (await query('SELECT id, slug, image_url FROM categories')).rows.map((c) => [c.slug, c])
  );

  let addedCats = 0;
  for (const c of seedCategories) {
    const s = slug(c.name);
    if (catBySlug.has(s)) continue;
    const { rows } = await query(
      `INSERT INTO categories (slug, name, principal_id, tagline, description, image_url, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,(SELECT COALESCE(MAX(sort_order),0)+1 FROM categories))
       RETURNING id, slug, image_url`,
      [s, c.name, principalFor(c.name), c.tagline, c.description, c.image]
    );
    catBySlug.set(s, rows[0]);
    addedCats++;
  }

  const taken = new Set((await query('SELECT slug FROM products')).rows.map((r) => r.slug));
  let addedProds = 0;
  for (const p of seedProducts) {
    const cat = catBySlug.get(slug(p.c));
    if (!cat) continue;
    const exists = await query(
      'SELECT 1 FROM products WHERE category_id = $1 AND name = $2', [cat.id, p.n]
    );
    if (exists.rowCount) continue;

    // seed.js builds product slugs from a running index, which shifts whenever a
    // product is inserted mid-array — derive a stable one from the name instead
    let s = slug(p.n), i = 1;
    while (taken.has(s)) s = `${slug(p.n)}-${++i}`;
    taken.add(s);

    await query(
      `INSERT INTO products (category_id, slug, name, description, cas_no, grade, packaging, image_url,
                             sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
               (SELECT COALESCE(MAX(sort_order),0)+1 FROM products WHERE category_id = $1))`,
      [cat.id, s, p.n, p.desc, p.cas || '', p.grade || '', p.pack || '', cat.image_url || '']
    );
    addedProds++;
  }

  await query(
    `INSERT INTO site_settings (key, value) VALUES ($1,$2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [KEY, new Date().toISOString()]
  );
  console.log(`Migration: Godrej catalogue synced (+${addedCats} categories, +${addedProds} products).`);
}

async function ensure() {
  try {
    const { rows } = await query("SELECT to_regclass('public.admins') AS t");
    if (rows[0].t) {
      console.log('Database already initialised — running migrations.');
    } else {
      console.log('Fresh database detected — applying schema...');
      const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
      await pool.query(schema);
      console.log('Schema applied. Seeding data...');
      await seed(false);
    }
    await migrate();
    await pool.end();
    console.log('Database ready.');
  } catch (e) {
    console.error('ensure.js failed:', e);
    process.exit(1);
  }
}

ensure();
