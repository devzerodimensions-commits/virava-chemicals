import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../api.js';
import './admin.css';

const fmtSize = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

export default function AdminMedia() {
  const [media, setMedia] = useState({ uploads: [], bundled: [] });
  const [tab, setTab] = useState('uploads');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState('');
  const [preview, setPreview] = useState(null);   // { file, usage }
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef(null);

  const load = () => {
    setLoading(true);
    api.get('/admin/media')
      .then((r) => setMedia(r.data))
      .catch(() => setMedia({ uploads: [], bundled: [] }))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const files = useMemo(() => {
    const list = tab === 'uploads' ? media.uploads : media.bundled;
    const needle = q.trim().toLowerCase();
    return needle ? list.filter((f) => f.path.toLowerCase().includes(needle)) : list;
  }, [media, tab, q]);

  const upload = async (fileList) => {
    const picked = [...fileList].filter((f) => f.type.startsWith('image/'));
    if (!picked.length) return;
    setBusy(true);
    try {
      const fd = new FormData();
      picked.forEach((f) => fd.append('images', f));
      await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setTab('uploads');
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Upload failed');
    } finally { setBusy(false); }
  };

  const copy = async (url) => {
    try { await navigator.clipboard.writeText(url); } catch { /* clipboard blocked */ }
    setCopied(url);
    setTimeout(() => setCopied(''), 1600);
  };

  const openPreview = async (file) => {
    setPreview({ file, usage: null });
    try {
      const { data } = await api.get('/admin/media/usage', { params: { url: file.url } });
      setPreview((p) => (p && p.file.url === file.url ? { ...p, usage: data.usedIn } : p));
    } catch { setPreview((p) => (p ? { ...p, usage: [] } : p)); }
  };

  const remove = async (file, usage) => {
    const used = (usage || []).reduce((n, u) => n + u.items.length, 0);
    const warn = used
      ? `"${file.name}" is used in ${used} place${used === 1 ? '' : 's'}. Deleting it will leave those without an image.\n\nDelete anyway?`
      : `Delete "${file.name}"?`;
    if (!confirm(warn)) return;
    setBusy(true);
    try {
      await api.delete('/admin/media', { data: { url: file.url } });
      setPreview(null);
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Delete failed');
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Media</h1>
          <p>Images available across the site. Upload new ones, copy a path to paste into any image field, or remove what is no longer used.</p>
        </div>
        <button className="btn btn-navy" disabled={busy} onClick={() => fileInput.current?.click()}>
          {busy ? 'Working…' : '+ Upload Images'}
        </button>
        <input ref={fileInput} type="file" accept="image/*" multiple hidden
          onChange={(e) => { upload(e.target.files); e.target.value = ''; }} />
      </div>

      <div
        className={`media-drop ${dragging ? 'on' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
        onClick={() => fileInput.current?.click()}
      >
        <strong>Drop images here</strong>
        <span>or click to choose — JPG, PNG, WebP, SVG, up to 8 MB each</span>
      </div>

      <div className="panel">
        <div className="media-bar">
          <div className="media-tabs">
            <button className={tab === 'uploads' ? 'on' : ''} onClick={() => setTab('uploads')}>
              Uploaded <em>{media.uploads.length}</em>
            </button>
            <button className={tab === 'bundled' ? 'on' : ''} onClick={() => setTab('bundled')}>
              Site images <em>{media.bundled.length}</em>
            </button>
          </div>
          <input className="media-search" type="search" placeholder="Search by name…"
            value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {tab === 'bundled' && (
          <p className="media-note">
            These ship with the site and cannot be deleted here — but you can copy any path and use it in an image field.
          </p>
        )}

        {loading ? <p className="empty">Loading…</p> : files.length === 0 ? (
          <p className="empty">{q ? 'Nothing matches that search.' : 'No images yet — upload some above.'}</p>
        ) : (
          <div className="media-grid">
            {files.map((f) => (
              <div className="media-card" key={f.url}>
                <button className="media-thumb" onClick={() => openPreview(f)} title="Details">
                  <img src={f.url} alt={f.name} loading="lazy" />
                </button>
                <div className="media-meta">
                  <span className="media-name" title={f.path}>{f.path}</span>
                  <span className="media-size">{fmtSize(f.size)}</span>
                </div>
                <div className="media-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => copy(f.url)}>
                    {copied === f.url ? '✓ Copied' : 'Copy path'}
                  </button>
                  {f.source === 'upload' && (
                    <button className="icon-btn danger" title="Delete" onClick={() => remove(f)}>🗑</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <div className="admin-modal media-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPreview(null)}>×</button>
            <h2>{preview.file.name}</h2>
            <img className="media-preview" src={preview.file.url} alt={preview.file.name} />
            <dl className="media-facts">
              <div><dt>Path</dt><dd><code>{preview.file.url}</code></dd></div>
              <div><dt>Size</dt><dd>{fmtSize(preview.file.size)}</dd></div>
              <div><dt>Source</dt><dd>{preview.file.source === 'upload' ? 'Uploaded' : 'Ships with the site'}</dd></div>
            </dl>

            <h3 className="media-used-head">Used in</h3>
            {preview.usage === null ? <p className="empty">Checking…</p>
              : preview.usage.length === 0 ? <p className="empty">Not referenced anywhere.</p> : (
              <ul className="media-used">
                {preview.usage.map((u) => (
                  <li key={u.area}><strong>{u.area}:</strong> {u.items.join(', ')}</li>
                ))}
              </ul>
            )}

            <div className="af-actions">
              <button className="btn btn-outline" onClick={() => copy(preview.file.url)}>
                {copied === preview.file.url ? '✓ Copied' : 'Copy path'}
              </button>
              {preview.file.source === 'upload' && (
                <button className="btn btn-danger" disabled={busy}
                  onClick={() => remove(preview.file, preview.usage)}>Delete</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
