// Runs on server start. If the database has no tables yet (fresh deploy),
// it applies the schema and seeds initial data. On later deploys it does
// nothing, so existing data (products, blogs, enquiries) is preserved.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from '../src/db.js';
import { run as seed } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ensure() {
  try {
    const { rows } = await query("SELECT to_regclass('public.admins') AS t");
    if (rows[0].t) {
      console.log('Database already initialised — skipping schema/seed.');
      await pool.end();
      return;
    }
    console.log('Fresh database detected — applying schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Schema applied. Seeding data...');
    await seed(false); // keep pool open; we close it below
    await pool.end();
    console.log('Database ready.');
  } catch (e) {
    console.error('ensure.js failed:', e);
    process.exit(1);
  }
}

ensure();
