import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import './admin.css';

const cards = [
  ['products', '🧪', 'Products', '/admin/products', '#161616'],
  ['categories', '📁', 'Categories', '/admin/categories', '#333333'],
  ['solutions', '🧬', 'Solutions', '/admin/solutions', '#404040'],
  ['industries', '🏭', 'Industries', '/admin/industries', '#4d4d4d'],
  ['principals', '🤝', 'Principals', '/admin/principals', '#666666'],
  ['blogs', '📝', 'Blog Posts', '/admin/blogs', '#737373'],
  ['enquiries', '✉', 'Total Enquiries', '/admin/enquiries', '#000000'],
  ['new_enquiries', '🔔', 'New Enquiries', '/admin/enquiries', '#808080'],
];

export default function Dashboard() {
  const [data, setData] = useState({ counts: {}, recent: [] });
  useEffect(() => { api.get('/admin/dashboard').then((r) => setData(r.data)).catch(() => {}); }, []);

  const fmtDate = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back — here's an overview of your website.</p>
        </div>
      </div>

      <div className="stat-cards">
        {cards.map(([key, ic, label, to, color]) => (
          <Link to={to} className="stat-card" key={key} style={{ '--c': color }}>
            <span className="sc-ic">{ic}</span>
            <div>
              <b>{data.counts[key] ?? 0}</b>
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="btn btn-outline btn-sm">View All</Link>
        </div>
        {data.recent?.length ? (
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {data.recent.map((e) => (
                  <tr key={e.id}>
                    <td><strong>{e.name}</strong></td>
                    <td>{e.email}</td>
                    <td>{e.subject || e.product_name || '—'}</td>
                    <td><span className={`badge badge-${e.status}`}>{e.status}</span></td>
                    <td className="nowrap">{fmtDate(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="empty">No enquiries yet.</p>}
      </div>
    </div>
  );
}
