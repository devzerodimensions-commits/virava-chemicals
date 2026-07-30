import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ---- Dashboard overview ----
router.get('/dashboard', async (_req, res) => {
  const counts = await query(`
    SELECT
      (SELECT count(*) FROM products)   AS products,
      (SELECT count(*) FROM categories) AS categories,
      (SELECT count(*) FROM industries) AS industries,
      (SELECT count(*) FROM principals) AS principals,
      (SELECT count(*) FROM enquiries)  AS enquiries,
      (SELECT count(*) FROM enquiries WHERE status = 'new') AS new_enquiries
  `);
  const recent = await query('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 6');
  res.json({ counts: counts.rows[0], recent: recent.rows });
});

// ---- Settings ----
router.get('/settings', async (_req, res) => {
  const { rows } = await query('SELECT key, value FROM site_settings');
  const obj = {};
  for (const r of rows) obj[r.key] = r.value;
  res.json(obj);
});

router.put('/settings', async (req, res) => {
  const entries = Object.entries(req.body || {});
  for (const [key, value] of entries) {
    await query(
      `INSERT INTO site_settings (key, value) VALUES ($1,$2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, String(value ?? '')]
    );
  }
  res.json({ ok: true });
});

// ---- Enquiries (read/update/delete only) ----
router.get('/enquiries', async (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM enquiries';
  const params = [];
  if (status && status !== 'all') { params.push(status); sql += ` WHERE status = $1`; }
  sql += ' ORDER BY created_at DESC';
  const { rows } = await query(sql, params);
  res.json(rows);
});

router.patch('/enquiries/:id', async (req, res) => {
  const { status } = req.body;
  const { rows } = await query(
    'UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *',
    [status, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/enquiries/:id', async (req, res) => {
  await query('DELETE FROM enquiries WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

// ---- Generic CRUD builder for content resources ----
function crud(resource, table, columns) {
  router.get(`/${resource}`, async (_req, res) => {
    const { rows } = await query(`SELECT * FROM ${table} ORDER BY sort_order, id`);
    res.json(rows);
  });

  router.get(`/${resource}/:id`, async (req, res) => {
    const { rows } = await query(`SELECT * FROM ${table} WHERE id = $1`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  });

  router.post(`/${resource}`, async (req, res) => {
    const cols = columns.filter((c) => req.body[c] !== undefined);
    if (!cols.length) return res.status(400).json({ error: 'No data' });
    const values = cols.map((c) => normalize(c, req.body[c]));
    const placeholders = cols.map((_, i) => `$${i + 1}`);
    const { rows } = await query(
      `INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders.join(',')}) RETURNING *`,
      values
    );
    res.status(201).json(rows[0]);
  });

  router.put(`/${resource}/:id`, async (req, res) => {
    const cols = columns.filter((c) => req.body[c] !== undefined);
    if (!cols.length) return res.status(400).json({ error: 'No data' });
    const sets = cols.map((c, i) => `${c} = $${i + 1}`);
    const values = cols.map((c) => normalize(c, req.body[c]));
    values.push(req.params.id);
    const { rows } = await query(
      `UPDATE ${table} SET ${sets.join(',')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  });

  router.delete(`/${resource}/:id`, async (req, res) => {
    await query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
    res.json({ ok: true });
  });
}

function normalize(col, val) {
  if (col === 'specs') return typeof val === 'string' ? val : JSON.stringify(val || {});
  return val;
}

// Products list enriched with category name (registered before generic crud so it wins)
router.get('/products', async (_req, res) => {
  const { rows } = await query(
    `SELECT p.*, c.name AS category_name
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY p.sort_order, p.id`
  );
  res.json(rows);
});

crud('categories', 'categories',
  ['slug', 'name', 'tagline', 'description', 'image_url', 'sort_order', 'is_active']);
crud('products', 'products',
  ['category_id', 'slug', 'name', 'description', 'cas_no', 'grade', 'packaging', 'specs',
   'image_url', 'sort_order', 'is_active']);
crud('principals', 'principals',
  ['slug', 'name', 'description', 'logo_url', 'website', 'sort_order', 'is_active']);
crud('industries', 'industries',
  ['slug', 'name', 'description', 'image_url', 'sort_order', 'is_active']);
crud('hero-slides', 'hero_slides',
  ['title', 'subtitle', 'image_url', 'cta_text', 'cta_link', 'sort_order', 'is_active']);
crud('blogs', 'blogs',
  ['slug', 'title', 'excerpt', 'content', 'category', 'author', 'image_url',
   'published_at', 'sort_order', 'is_active']);

export default router;
