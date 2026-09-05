import { useEffect, useRef, useState } from 'react';
import api from '../api.js';
import './admin.css';

/**
 * The single way to set an image anywhere in the admin forms. Reads the same
 * media list as the Media page, so anything visible there can be reused here.
 *
 * Uploading lives inside this dialog rather than on the form. The form used to
 * carry its own file input, so choosing a photo opened the OS file manager
 * straight away and the image went to the field without ever appearing in the
 * media library — it could not then be found or reused anywhere else. Now the
 * library opens first, and a new photo is uploaded from within it, so it is
 * always added to Media on its way to the field.
 */
function MediaPicker({ onPick, onClose }) {
  const [media, setMedia] = useState({ uploads: [], bundled: [] });
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const fileInput = useRef(null);

  const load = () => api.get('/admin/media').then((r) => setMedia(r.data)).catch(() => {});

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // refresh the library first, so the new file is really in Media before the
      // dialog closes — not just handed to the field
      await load();
      onPick(data.url);
      onClose();
    } catch {
      setErr('That upload failed. Please try a different image.');
    } finally {
      setBusy(false);
    }
  };

  const list = (tab === 'uploads' ? media.uploads
    : tab === 'bundled' ? media.bundled
    : [...(media.uploads || []), ...(media.bundled || [])]) || [];
  const needle = q.trim().toLowerCase();
  const files = needle ? list.filter((f) => f.path.toLowerCase().includes(needle)) : list;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 60 }}>
      <div className="admin-modal media-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Choose an image</h2>
        <div className="media-bar">
          <div className="media-tabs">
            <button type="button" className={tab === 'all' ? 'on' : ''} onClick={() => setTab('all')}>
              All <em>{(media.uploads?.length || 0) + (media.bundled?.length || 0)}</em>
            </button>
            <button type="button" className={tab === 'uploads' ? 'on' : ''} onClick={() => setTab('uploads')}>
              Uploaded <em>{media.uploads?.length || 0}</em>
            </button>
            <button type="button" className={tab === 'bundled' ? 'on' : ''} onClick={() => setTab('bundled')}>
              Site images <em>{media.bundled?.length || 0}</em>
            </button>
          </div>
          <div className="media-bar-right">
            <input className="media-search" type="search" placeholder="Search…" value={q}
              onChange={(e) => setQ(e.target.value)} />
            <button type="button" className="btn btn-navy btn-sm" disabled={busy}
              onClick={() => fileInput.current?.click()}>
              {busy ? 'Uploading…' : '+ Upload new'}
            </button>
            <input ref={fileInput} type="file" accept="image/*" hidden
              onChange={(e) => { upload(e.target.files[0]); e.target.value = ''; }} />
          </div>
        </div>
        {err && <p className="media-err">{err}</p>}
        {loading ? <p className="empty">Loading…</p> : files.length === 0 ? (
          <p className="empty">
            {q ? 'Nothing matches that search.' : 'No images yet — use “Upload new” to add one.'}
          </p>
        ) : (
          <div className="media-grid picker">
            {files.map((f) => (
              <button type="button" className="media-card pick" key={f.url}
                onClick={() => { onPick(f.url); onClose(); }}>
                <span className="media-thumb"><img src={f.url} alt={f.name} loading="lazy" /></span>
                <span className="media-name" title={f.path}>{f.path}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Editor for a free-form JSON object of label -> text, used for the spec rows on
 * the product page. Rows are kept in local state so a half-typed label does not
 * collapse into the object and lose the row's other half.
 */
function KeyValueEditor({ value, onChange, hint, suggestions = [] }) {
  const toRows = (obj) => Object.entries(obj || {}).map(([k, v]) => ({ k, v: String(v) }));
  const [rows, setRows] = useState(() => toRows(value));
  const lastPushed = useRef(null);

  // reset when the modal switches to a different record
  useEffect(() => {
    const incoming = JSON.stringify(value || {});
    if (incoming !== lastPushed.current) setRows(toRows(value));
    // eslint-disable-next-line
  }, [value]);

  const push = (next) => {
    setRows(next);
    const obj = {};
    for (const { k, v } of next) if (k.trim()) obj[k.trim()] = v;
    lastPushed.current = JSON.stringify(obj);
    onChange(obj);
  };

  const setRow = (i, patch) => push(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const addRow = (k = '') => push([...rows, { k, v: '' }]);
  const removeRow = (i) => push(rows.filter((_, j) => j !== i));
  const unused = suggestions.filter((s) => !rows.some((r) => r.k === s));

  return (
    <div className="kv-editor">
      {rows.length === 0 && <p className="kv-empty">{hint || 'No rows yet.'}</p>}
      {rows.map((r, i) => (
        <div className="kv-row" key={i}>
          <input className="kv-key" placeholder="Label" value={r.k}
            onChange={(e) => setRow(i, { k: e.target.value })} />
          <textarea className="kv-val" rows="2" placeholder="Value" value={r.v}
            onChange={(e) => setRow(i, { v: e.target.value })} />
          <button type="button" className="icon-btn danger" title="Remove row"
            onClick={() => removeRow(i)}>🗑</button>
        </div>
      ))}
      <div className="kv-add">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => addRow()}>+ Add row</button>
        {unused.map((s) => (
          <button type="button" className="kv-suggest" key={s} onClick={() => addRow(s)}>+ {s}</button>
        ))}
      </div>
    </div>
  );
}

/**
 * Generic list + create/edit/delete manager.
 * props:
 *  - title, subtitle
 *  - resource: admin API path e.g. 'products'
 *  - columns: [{ key, label, render? }]
 *  - fields:  [{ key, label, type, options?, required?, full? }]
 *  - defaults: object of default new-item values
 *  - loadOptions: optional async () => merges dynamic options into fields by key
 */
export default function CrudManager({ title, subtitle, resource, columns, fields, defaults = {}, loadOptions }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // object being edited/created
  const [dynFields, setDynFields] = useState(fields);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState(null); // field key the media picker is filling

  const load = () => {
    setLoading(true);
    api.get(`/admin/${resource}`).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [resource]);

  useEffect(() => {
    if (!loadOptions) return;
    loadOptions().then((opts) => {
      setDynFields(fields.map((f) => (opts[f.key] ? { ...f, options: opts[f.key] } : f)));
    });
    // eslint-disable-next-line
  }, []);

  const openNew = () => setEditing({ ...defaults });
  const openEdit = (item) => setEditing({ ...item });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...editing };
      if (editing.id) await api.put(`/admin/${resource}/${editing.id}`, payload);
      else await api.post(`/admin/${resource}`, payload);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const remove = async (item) => {
    if (!confirm(`Delete "${item.name || item.title || 'this item'}"?`)) return;
    await api.delete(`/admin/${resource}/${item.id}`);
    load();
  };

  // (the form's own uploader was removed — MediaPicker owns uploading now, so
  // every new image passes through the media library)

  const setField = (k, v) => setEditing((cur) => ({ ...cur, [k]: v }));

  return (
    <div>
      <div className="page-head">
        <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
        <button className="btn btn-navy" onClick={openNew}>+ Add New</button>
      </div>

      <div className="panel">
        {loading ? <p className="empty">Loading…</p> : items.length === 0 ? (
          <p className="empty">No records yet. Click “Add New” to create one.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th className="ta-right">Actions</th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    {columns.map((c) => (
                      <td key={c.key}>{c.render ? c.render(item) : (item[c.key] ?? '—')}</td>
                    ))}
                    <td className="ta-right nowrap">
                      <button className="icon-btn" onClick={() => openEdit(item)} title="Edit">✏️</button>
                      <button className="icon-btn danger" onClick={() => remove(item)} title="Delete">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditing(null)}>×</button>
            <h2>{editing.id ? 'Edit' : 'Add'} {title.replace(/s$/, '')}</h2>
            <form onSubmit={save} className="admin-form">
              {dynFields.map((f) => (
                <div className={`af-field ${f.full ? 'af-full' : ''}`} key={f.key}>
                  <label>{f.label}{f.required && ' *'}</label>
                  {f.type === 'textarea' ? (
                    <textarea rows={f.rows || 3} required={f.required}
                      value={editing[f.key] ?? ''} onChange={(e) => setField(f.key, e.target.value)} />
                  ) : f.type === 'select' ? (
                    <select required={f.required} value={editing[f.key] ?? ''} onChange={(e) => setField(f.key, e.target.value)}>
                      <option value="">— select —</option>
                      {(f.options || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <label className="af-check">
                      <input type="checkbox" checked={!!editing[f.key]} onChange={(e) => setField(f.key, e.target.checked)} />
                      <span>{f.hint || 'Active / visible on site'}</span>
                    </label>
                  ) : f.type === 'keyvalue' ? (
                    <KeyValueEditor
                      value={editing[f.key]}
                      onChange={(v) => setField(f.key, v)}
                      hint={f.hint}
                      suggestions={f.suggestions}
                    />
                  ) : f.type === 'image' ? (
                    <div className="af-image">
                      {editing[f.key] && <img src={editing[f.key]} alt="" className="af-preview" />}
                      <div className="af-image-inputs">
                        <input type="text" placeholder="/img/… or choose from Media"
                          value={editing[f.key] ?? ''} onChange={(e) => setField(f.key, e.target.value)} />
                        {/* One route only. The direct file input that used to sit
                            here jumped straight to the OS file manager and put the
                            image on the field without it ever reaching the media
                            library. Uploading now happens inside the picker. */}
                        <div className="af-image-btns">
                          <button type="button" className="af-upload" onClick={() => setPicking(f.key)}>
                            Choose from Media
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <input type={f.type || 'text'} required={f.required}
                      value={editing[f.key] ?? ''} onChange={(e) => setField(f.key, e.target.value)} />
                  )}
                </div>
              ))}
              <div className="af-actions af-full">
                <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn btn-navy" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {picking && (
        <MediaPicker
          onPick={(url) => setField(picking, url)}
          onClose={() => setPicking(null)}
        />
      )}
    </div>
  );
}
