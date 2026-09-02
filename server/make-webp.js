// One-time: create a .webp sibling for every jpg/jpeg/png under client/public/img.
// References are unchanged; the server serves the .webp when it exists (see app.js).
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG = path.join(__dirname, '..', 'client', 'public', 'img');

async function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { await walk(p); continue; }
    if (!/\.(jpe?g|png)$/i.test(e.name)) continue;
    const out = p.replace(/\.(jpe?g|png)$/i, '.webp');
    if (fs.existsSync(out)) continue;
    try {
      await sharp(p).webp({ quality: 82 }).toFile(out);
      console.log('webp:', path.relative(IMG, out));
    } catch (err) { console.error('skip', e.name, err.message); }
  }
}

walk(IMG).then(() => console.log('done'));
