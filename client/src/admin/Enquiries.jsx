import { useEffect, useState } from 'react';
import api from '../api.js';
import './admin.css';

const FILTERS = ['all', 'new', 'read', 'replied'];

export default function Enquiries() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const load = () => api.get(`/admin/enquiries?status=${filter}`).then((r) => setItems(r.data));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const fmtDate = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const setStatus = async (item, status) => {
    await api.patch(`/admin/enquiries/${item.id}`, { status });
    load();
    setSelected((s) => (s && s.id === item.id ? { ...s, status } : s));
  };

  const open = (item) => {
    setSelected(item);
    if (item.status === 'new') setStatus(item, 'read');
  };

  const remove = async (item) => {
    if (!confirm('Delete this enquiry?')) return;
    await api.delete(`/admin/enquiries/${item.id}`);
    setSelected(null);
    load();
  };

  return (
    <div>
      <div className="page-head">
        <div><h1>Enquiries</h1><p>Messages submitted through the website.</p></div>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="panel">
        {items.length === 0 ? <p className="empty">No enquiries in this view.</p> : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Contact</th><th>Subject</th><th>Status</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id} className={e.status === 'new' ? 'row-new' : ''}>
                    <td><strong>{e.name}</strong>{e.company && <span className="sub">{e.company}</span>}</td>
                    <td>{e.email}<span className="sub">{e.phone}</span></td>
                    <td>{e.subject || e.product_name || '—'}</td>
                    <td><span className={`badge badge-${e.status}`}>{e.status}</span></td>
                    <td className="nowrap sub">{fmtDate(e.created_at)}</td>
                    <td className="ta-right"><button className="btn btn-outline btn-sm" onClick={() => open(e)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            <h2>{selected.subject || 'Enquiry'}</h2>
            <span className={`badge badge-${selected.status}`}>{selected.status}</span>
            <div className="enq-detail">
              <div><label>Name</label><p>{selected.name}</p></div>
              <div><label>Email</label><p><a href={`mailto:${selected.email}`}>{selected.email}</a></p></div>
              <div><label>Phone</label><p>{selected.phone || '—'}</p></div>
              <div><label>Company</label><p>{selected.company || '—'}</p></div>
              {selected.product_name && <div><label>Product</label><p>{selected.product_name}</p></div>}
              <div><label>Received</label><p>{fmtDate(selected.created_at)}</p></div>
            </div>
            <label className="enq-label">Message</label>
            <div className="enq-message">{selected.message}</div>
            <div className="enq-actions">
              <a className="btn btn-navy" href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your enquiry')}`}>Reply by Email</a>
              {selected.status !== 'replied' && <button className="btn btn-outline" onClick={() => setStatus(selected, 'replied')}>Mark Replied</button>}
              <button className="btn btn-danger" onClick={() => remove(selected)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
