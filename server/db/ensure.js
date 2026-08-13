// Runs on server start. Fresh DB -> apply schema + seed. Existing DB -> run
// idempotent migrations (so schema changes reach an already-deployed database).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from '../src/db.js';
import { run as seed } from './seed.js';

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
