import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// Categories (optionally with products)
router.get('/categories', async (req, res) => {
  const { rows } = await query(
    'SELECT * FROM categories WHERE is_active = true ORDER BY sort_order, name'
  );
  res.json(rows);
});

router.get('/categories/:slug', async (req, res) => {
  const cat = await query('SELECT * FROM categories WHERE slug = $1', [req.params.slug]);
  if (!cat.rows[0]) return res.status(404).json({ error: 'Category not found' });
  const products = await query(
    'SELECT * FROM products WHERE category_id = $1 AND is_active = true ORDER BY sort_order, name',
    [cat.rows[0].id]
  );
  res.json({ ...cat.rows[0], products: products.rows });
});

// Products
router.get('/products', async (req, res) => {
  const { category } = req.query;
  let sql =
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.is_active = true`;
  const params = [];
  if (category) {
    params.push(category);
    sql += ` AND c.slug = $${params.length}`;
  }
  sql += ' ORDER BY p.sort_order, p.name';
  const { rows } = await query(sql, params);
  res.json(rows);
});

router.get('/products/:slug', async (req, res) => {
  const { rows } = await query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug = $1`,
    [req.params.slug]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
  res.json(rows[0]);
});

router.get('/principals', async (_req, res) => {
  const { rows } = await query(
    'SELECT * FROM principals WHERE is_active = true ORDER BY sort_order, name'
  );
  res.json(rows);
});

router.get('/industries', async (_req, res) => {
  const { rows } = await query(
    'SELECT * FROM industries WHERE is_active = true ORDER BY sort_order, name'
  );
  res.json(rows);
});

router.get('/hero-slides', async (_req, res) => {
  const { rows } = await query(
    'SELECT * FROM hero_slides WHERE is_active = true ORDER BY sort_order'
  );
  res.json(rows);
});

router.get('/blogs', async (_req, res) => {
  const { rows } = await query(
    'SELECT * FROM blogs WHERE is_active = true ORDER BY sort_order, published_at DESC'
  );
  res.json(rows);
});

router.get('/blogs/:slug', async (req, res) => {
  const { rows } = await query('SELECT * FROM blogs WHERE slug = $1', [req.params.slug]);
  if (!rows[0]) return res.status(404).json({ error: 'Blog not found' });
  res.json(rows[0]);
});

router.get('/settings', async (_req, res) => {
  const { rows } = await query('SELECT key, value FROM site_settings');
  const obj = {};
  for (const r of rows) obj[r.key] = r.value;
  res.json(obj);
});

// Contact / product enquiry
router.post('/enquiries', async (req, res) => {
  const { name, email, phone, company, subject, message, product_id, product_name } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }
  const { rows } = await query(
    `INSERT INTO enquiries (name, email, phone, company, subject, message, product_id, product_name)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [name, email, phone || '', company || '', subject || '', message,
     product_id || null, product_name || '']
  );
  res.status(201).json({ ok: true, id: rows[0].id });
});

export default router;
