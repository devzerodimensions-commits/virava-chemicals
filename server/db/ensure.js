// Runs on server start. Fresh DB -> apply schema + seed. Existing DB -> run
// idempotent migrations (so schema changes reach an already-deployed database).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from '../src/db.js';
import {
  run as seed, categories as seedCategories, products as seedProducts, slug, specsFor,
  solutions as seedSolutions, highlights as seedHighlights, faqs as seedFaqs,
  heroSlides as seedHeroSlides,
} from './seed.js';
import { GODREJ_CATALOGUE } from './godrej-catalogue.js';

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
  await fixCategoryImages();
  await backfillProductSpecs();
  await syncGodrejSolutions();
  // HPL/OCCL/STD were still on borrowed industry photos and the About collage;
  // needs its own key because the first image pass already spent that one.
  await fixCategoryImages('migration_principal_images');
  await addEditableContentTables();
  await fixHeroSlides();
  await applyGodrejSheet();
  await applyClientFacts();
}

// The founding year, customer count and founder's name were guesses that turned
// out to be wrong. The client's own "Virava Chemicals.docx" states 1996, 2500+
// customers in Gujarat, and Mr. Siddharth Shah. Correct the seeded values.
//
// Only rows still holding the wrong value are touched, so anything an admin has
// since edited is left alone. One-shot.
async function applyClientFacts() {
  const KEY = 'migration_client_facts_v2';
  const done = await query('SELECT 1 FROM site_settings WHERE key = $1', [KEY]);
  if (done.rowCount) return;

  const corrections = [
    ['established', '1997', '1996'],
    ['stat_customers', '3000', '2500'],
    ['founder', 'Mr. Siddharth S. Shah', 'Mr. Siddharth Shah'],
  ];
  let n = 0;
  for (const [key, wrong, right] of corrections) {
    const r = await query(
      'UPDATE site_settings SET value = $1 WHERE key = $2 AND value = $3',
      [right, key, wrong]
    );
    n += r.rowCount;
  }
  const h = await query(
    "UPDATE highlights SET subtitle = 'Trusted since 1996' WHERE subtitle = 'Trusted since 1997'"
  );
  const s = await query(
    `UPDATE hero_slides
        SET subtitle = 'Reputed & award-winning brand serving the industrial world of Gujarat since 1996.'
      WHERE subtitle LIKE '%industrial world of India since 1997%'`
  );

  await query(
    `INSERT INTO site_settings (key, value) VALUES ($1,$2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [KEY, new Date().toISOString()]
  );
  console.log(`Migration: client facts corrected (${n} settings, ${h.rowCount} highlights, ${s.rowCount} slides).`);
}

// Replaces the Godrej catalogue with the client's own product sheet. The earlier
// data was transcribed from godrejchemicals.com and listed grades Virava does not
// actually sell (Alfodet, Textric SPL, Glycerin EP, Ginopol 28N, a whole Oleic
// Acids category), while missing about seventy products it does.
//
// Nothing is deleted. Superseded categories and products are set is_active=false,
// so they vanish from the site but remain in the admin panel and can be switched
// back on. One-shot, on its own marker.
async function applyGodrejSheet() {
  const KEY = 'migration_godrej_sheet_v2';
  const done = await query('SELECT 1 FROM site_settings WHERE key = $1', [KEY]);
  if (done.rowCount) return;

  const pr = await query("SELECT id FROM principals WHERE name ILIKE '%godrej%' LIMIT 1");
  const godrejId = pr.rows[0]?.id;
  if (!godrejId) { console.warn('Godrej principal missing — skipping sheet import.'); return; }

  const keepCategory = new Set(GODREJ_CATALOGUE.map((c) => c.slug));
  // keyed on category + name, not name alone: several products share a name with
  // a stale entry sitting in a different category, and matching on name would
  // leave that copy active while the sheet's copy is inserted elsewhere
  const keepPairs = new Set();
  let cats = 0, added = 0, sort = 0;

  for (const c of GODREJ_CATALOGUE) {
    // upsert the category itself
    const existing = await query('SELECT id FROM categories WHERE slug = $1', [c.slug]);
    let catId;
    if (existing.rowCount) {
      catId = existing.rows[0].id;
      await query(
        `UPDATE categories SET name=$1, principal_id=$2, solution=$3, tagline=$4,
                description=$5, image_url=$6, sort_order=$7, is_active=true WHERE id=$8`,
        [c.name, godrejId, c.solution, c.tagline, c.description, c.image, sort++, catId]
      );
    } else {
      const ins = await query(
        `INSERT INTO categories (slug, name, principal_id, solution, tagline, description, image_url, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
        [c.slug, c.name, godrejId, c.solution, c.tagline, c.description, c.image, sort++]
      );
      catId = ins.rows[0].id;
      cats++;
    }

    // products
    let pSort = 0;
    for (const p of c.products) {
      keepPairs.add(`${catId}::${p.n}`);
      const specs = {
        ...(p.chem ? { 'Chemical Name': p.chem } : {}),
        'Application Details': c.description,
      };
      const hit = await query('SELECT id FROM products WHERE category_id=$1 AND name=$2', [catId, p.n]);
      if (hit.rowCount) {
        await query('UPDATE products SET is_active=true, sort_order=$1 WHERE id=$2', [pSort++, hit.rows[0].id]);
        continue;
      }
      // slug must be unique across the table, so disambiguate on collision
      let s = slug(p.n), i = 1;
      while ((await query('SELECT 1 FROM products WHERE slug=$1', [s])).rowCount) s = `${slug(p.n)}-${++i}`;
      await query(
        `INSERT INTO products (category_id, slug, name, description, image_url, specs, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [catId, s, p.n, p.chem ? `${p.n} — ${p.chem}.` : c.description,
         c.image, JSON.stringify(specs), pSort++]
      );
      added++;
    }
  }

  // retire what the sheet does not list, Godrej only — other principals untouched
  const retiredCats = await query(
    `UPDATE categories SET is_active=false
      WHERE principal_id=$1 AND slug <> ALL($2) RETURNING id`,
    [godrejId, [...keepCategory]]
  );
  const live = await query(
    `SELECT p.id, p.category_id, p.name FROM products p
       JOIN categories c ON c.id = p.category_id
      WHERE c.principal_id = $1 AND p.is_active = true`,
    [godrejId]
  );
  const stale = live.rows
    .filter((r) => !keepPairs.has(`${r.category_id}::${r.name}`))
    .map((r) => r.id);
  const retiredProds = stale.length
    ? await query('UPDATE products SET is_active=false WHERE id = ANY($1) RETURNING id', [stale])
    : { rowCount: 0 };

  await query(
    `INSERT INTO site_settings (key, value) VALUES ($1,$2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [KEY, new Date().toISOString()]
  );
  console.log(`Migration: Godrej sheet applied (+${cats} categories, +${added} products; ` +
    `retired ${retiredCats.rowCount} categories, ${retiredProds.rowCount} products).`);
}

// The home carousel ignored the hero_slides table entirely — it was handed the
// principals list and picked a background from a hardcoded path, so the rows
// pointed at generic site banners nobody ever saw. Now that the slider actually
// renders them, move them onto the purpose-made banner photography and add the
// fourth slide, so wiring it up does not change how the page looks.
//
// Only rows still holding the original seeded image are touched.
async function fixHeroSlides() {
  const KEY = 'migration_hero_slides';
  const done = await query('SELECT 1 FROM site_settings WHERE key = $1', [KEY]);
  if (done.rowCount) return;

  const OLD = ['/img/banner1.jpg', '/img/banner3.jpg', '/img/banner4.jpg', ''];
  let moved = 0, added = 0;
  for (let i = 0; i < seedHeroSlides.length; i++) {
    const s = seedHeroSlides[i];
    const hit = await query(
      `UPDATE hero_slides SET image_url = $1
        WHERE title = $2 AND (image_url = ANY($3) OR image_url IS NULL) RETURNING id`,
      [s.image, s.title, OLD]
    );
    if (hit.rowCount) { moved++; continue; }

    const exists = await query('SELECT 1 FROM hero_slides WHERE title = $1', [s.title]);
    if (!exists.rowCount) {
      await query(
        `INSERT INTO hero_slides (title, subtitle, image_url, cta_text, cta_link, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [s.title, s.subtitle, s.image, s.cta_text, s.cta_link, i]
      );
      added++;
    }
  }

  await query(
    `INSERT INTO site_settings (key, value) VALUES ($1,$2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [KEY, new Date().toISOString()]
  );
  console.log(`Migration: hero slides repointed (${moved} updated, ${added} added).`);
}

// Solution copy, the home highlight strip and the "Why Virava" answers were all
// hardcoded in the frontend, so nothing about them could be changed without a
// deploy. Move them into tables the admin panel can edit.
//
// CREATE TABLE IF NOT EXISTS is safe every boot; the row seeding is guarded so it
// only populates an empty table — edits and deletions are never undone.
async function addEditableContentTables() {
  await query(`CREATE TABLE IF NOT EXISTS solutions (
    id SERIAL PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
    portfolio_title TEXT DEFAULT '', headline TEXT DEFAULT '', lead TEXT DEFAULT '',
    points TEXT DEFAULT '', blurb TEXT DEFAULT '', image_url TEXT DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true)`);
  await query(`CREATE TABLE IF NOT EXISTS highlights (
    id SERIAL PRIMARY KEY, icon TEXT DEFAULT 'awards', title TEXT NOT NULL,
    subtitle TEXT DEFAULT '', sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true)`);
  await query(`CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY, question TEXT NOT NULL, answer TEXT DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true)`);

  const empty = async (t) => (await query(`SELECT count(*)::int AS n FROM ${t}`)).rows[0].n === 0;

  if (await empty('solutions')) {
    for (let i = 0; i < seedSolutions.length; i++) {
      const s = seedSolutions[i];
      await query(
        `INSERT INTO solutions (slug, name, portfolio_title, headline, lead, points, blurb, image_url, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (slug) DO NOTHING`,
        [s.slug, s.name, s.portfolio_title, s.headline, s.lead, s.points, s.blurb, s.image, i]
      );
    }
    console.log(`Migration: seeded ${seedSolutions.length} solutions.`);
  }
  if (await empty('highlights')) {
    for (let i = 0; i < seedHighlights.length; i++) {
      const h = seedHighlights[i];
      await query('INSERT INTO highlights (icon, title, subtitle, sort_order) VALUES ($1,$2,$3,$4)',
        [h.icon, h.title, h.subtitle, i]);
    }
    console.log(`Migration: seeded ${seedHighlights.length} highlights.`);
  }
  if (await empty('faqs')) {
    for (let i = 0; i < seedFaqs.length; i++) {
      const f = seedFaqs[i];
      await query('INSERT INTO faqs (question, answer, sort_order) VALUES ($1,$2,$3)',
        [f.question, f.answer, i]);
    }
    console.log(`Migration: seeded ${seedFaqs.length} FAQs.`);
  }
}

// Godrej splits its range into four product solutions (oleochemicals, surfactants,
// specialty chemicals, biotech). categories.solution records which one a category
// belongs to, and the three non-oleochemical solutions brought their own
// categories and trade names with them.
async function syncGodrejSolutions() {
  await query('ALTER TABLE categories ADD COLUMN IF NOT EXISTS solution TEXT');

  // Safe on every boot: only fills a solution that has not been set, so an admin
  // moving a category between solutions is never undone.
  for (const c of seedCategories) {
    if (!c.solution) continue;
    await query(
      'UPDATE categories SET solution = $1 WHERE slug = $2 AND solution IS NULL',
      [c.solution, slug(c.name)]
    );
  }

  // The catalogue insert itself is one-shot — syncGodrejCatalogue already claimed
  // its own marker, so the newly added solution categories need a fresh one.
  await insertMissingCatalogue('migration_godrej_solutions');
}

// The product detail page shows a spec table driven by products.specs, which was
// empty for everything seeded before it existed. Fill in the rows we can state
// factually — physical form, application scope, grade and INCI name.
//
// Only rows whose specs are still empty are written, so anything entered in the
// admin panel is preserved. One-shot, like the migrations above.
async function backfillProductSpecs() {
  const KEY = 'migration_product_specs';
  const done = await query('SELECT 1 FROM site_settings WHERE key = $1', [KEY]);
  if (done.rowCount) return;

  let n = 0;
  for (const p of seedProducts) {
    const specs = specsFor(p);
    if (!Object.keys(specs).length) continue;
    const r = await query(
      `UPDATE products SET specs = $1
        WHERE name = $2 AND (specs IS NULL OR specs = '{}'::jsonb)`,
      [JSON.stringify(specs), p.n]
    );
    n += r.rowCount;
  }

  await query(
    `INSERT INTO site_settings (key, value) VALUES ($1,$2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [KEY, new Date().toISOString()]
  );
  console.log(`Migration: product specs backfilled (${n} products).`);
}

// The original seed pointed every category at /img/pro1-4.jpg, which are the four
// PRINCIPAL LOGOS (Godrej, HPL, OCCL, SCC) — not product photography. Categories
// added later reused the generic site banners. Repoint them at the purpose-made
// per-category images.
//
// Only rows still holding one of those known defaults are touched, so a picture an
// admin has already chosen is never overwritten. One-shot, like the catalogue sync.
async function fixCategoryImages(KEY = 'migration_category_images') {
  const done = await query('SELECT 1 FROM site_settings WHERE key = $1', [KEY]);
  if (done.rowCount) return;

  const STALE = [
    '/img/pro1.jpg', '/img/pro2.jpg', '/img/pro3.jpg', '/img/pro4.jpg',
    '/img/banner1.jpg', '/img/banner2.jpg', '/img/banner3.jpg', '/img/about.jpg',
    '/img/industries/2.jpg', '/img/industries/15.jpg', '',
  ];

  let cats = 0, prods = 0;
  for (const c of seedCategories) {
    const image = c.image;
    if (!image.startsWith('/img/categories/')) continue;

    const upd = await query(
      'UPDATE categories SET image_url = $1 WHERE slug = $2 AND (image_url = ANY($3) OR image_url IS NULL) RETURNING id',
      [image, slug(c.name), STALE]
    );
    if (!upd.rowCount) continue;
    cats++;

    // products inherit their category's picture at seed time, so they carry the
    // same wrong logo — repoint the ones that were never given their own
    const p = await query(
      'UPDATE products SET image_url = $1 WHERE category_id = $2 AND (image_url = ANY($3) OR image_url IS NULL)',
      [image, upd.rows[0].id, STALE]
    );
    prods += p.rowCount;
  }

  await query(
    `INSERT INTO site_settings (key, value) VALUES ($1,$2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [KEY, new Date().toISOString()]
  );
  console.log(`Migration: category imagery repointed (${cats} categories, ${prods} products).`);
}

// The Godrej trade-name catalogue (Ginol / Lubolic / Hystric / Textric / Distric /
// pharmacopoeial glycerin) plus the Stearic Acids and Oleic Acids categories were
// added after the first deploy. Insert whatever is missing so an already-seeded
// database picks them up.
//
// Gated on a one-shot marker rather than running every boot: without it, anything
// an admin deliberately deletes in the panel would silently reappear on restart.
async function syncGodrejCatalogue() {
  await insertMissingCatalogue('migration_godrej_catalogue');
}

// Inserts any seed category/product the database does not have yet, then claims
// `KEY` so it never runs again. Each batch of catalogue additions gets its own
// key — a spent key must not swallow a later batch.
async function insertMissingCatalogue(KEY) {
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
      `INSERT INTO categories (slug, name, principal_id, solution, tagline, description, image_url, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,(SELECT COALESCE(MAX(sort_order),0)+1 FROM categories))
       RETURNING id, slug, image_url`,
      [s, c.name, principalFor(c.name), c.solution || null, c.tagline, c.description, c.image]
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
                             specs, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,
               (SELECT COALESCE(MAX(sort_order),0)+1 FROM products WHERE category_id = $1))`,
      [cat.id, s, p.n, p.desc, p.cas || '', p.grade || '', p.pack || '', cat.image_url || '',
       JSON.stringify(specsFor(p))]
    );
    addedProds++;
  }

  await query(
    `INSERT INTO site_settings (key, value) VALUES ($1,$2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [KEY, new Date().toISOString()]
  );
  console.log(`Migration ${KEY}: +${addedCats} categories, +${addedProds} products.`);
}

// A cold Postgres can refuse the first connections while it accepts traffic, and
// on Render the database and the web service wake independently. Retry briefly
// before deciding it is genuinely unreachable.
async function waitForDatabase(attempts = 6) {
  for (let i = 1; i <= attempts; i++) {
    try {
      await query('SELECT 1');
      if (i > 1) console.log(`Database reachable after ${i} attempts.`);
      return true;
    } catch (e) {
      const wait = Math.min(2000 * i, 8000);
      console.warn(`Database not reachable (attempt ${i}/${attempts}): ${e.message}. Retrying in ${wait}ms.`);
      if (i < attempts) await new Promise((r) => setTimeout(r, wait));
    }
  }
  return false;
}

async function ensure() {
  // Booting is `ensure.js && app.js`, so exiting non-zero here used to take the
  // whole site down — no page at all, not even an error. A database problem
  // should degrade the site, not black it out, so carry on and let the API
  // surface the failure per request.
  if (!(await waitForDatabase())) {
    console.error('Database unreachable after retries — starting the server anyway. '
      + 'Pages will load; anything data-backed will error until the database returns.');
    return;
  }
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
    console.log('Database ready.');
  } catch (e) {
    // A failed migration is worth shouting about, but it is not worth taking the
    // site offline for — the previous schema is usually still serviceable.
    console.error('ensure.js failed — starting the server regardless:', e);
  } finally {
    try { await pool.end(); } catch { /* already closed */ }
  }
}

ensure();
