import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import publicRoutes from './routes/public.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));

const uploadsDir = path.join(__dirname, '..', 'uploads');
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');

// Serve every image as WebP: if a .jpg/.jpeg/.png is requested and a .webp
// sibling exists, send the webp bytes instead. Browsers render <img>/CSS
// backgrounds by content, so existing .jpg/.png references keep working while
// the smaller webp is delivered. Falls back to the original if no webp exists.
app.use((req, res, next) => {
  if (!/\.(jpe?g|png)$/i.test(req.path)) return next();
  const under = req.path.startsWith('/uploads/')
    ? { root: uploadsDir, rel: req.path.slice('/uploads/'.length) }
    : { root: clientDist, rel: req.path.replace(/^\//, '') };
  const abs = path.join(under.root, under.rel.replace(/\.(jpe?g|png)$/i, '.webp'));
  if (fs.existsSync(abs)) { res.type('image/webp'); return res.sendFile(abs); }
  next();
});

// Serve admin-uploaded images
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'virava-api' }));

app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Serve the built React app (production / single-service deploy)
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Central error handler (so async throws return JSON, not HTML)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Virava API running on http://localhost:${port}`));
