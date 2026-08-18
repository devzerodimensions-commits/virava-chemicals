import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import Icon from './icons.jsx';
import './admin.css';

const cards = [
  ['new_enquiries', 'enquiries', 'New Enquiries', '/admin/enquiries', true],
  ['enquiries', 'enquiries', 'Total Enquiries', '/admin/enquiries'],
  ['products', 'products', 'Products', '/admin/products'],
  ['categories', 'categories', 'Categories', '/admin/categories'],
  ['solutions', 'solutions', 'Solutions', '/admin/solutions'],
  ['principals', 'principals', 'Principals', '/admin/principals'],
  ['industries', 'industries', 'Industries', '/admin/industries'],
  ['blogs', 'blogs', 'Blog Posts', '/admin/blogs'],
];

const shortcuts = [
  ['products', 'products', 'Add a product'],
  ['hero', 'hero', 'Edit hero slides'],
  ['media', 'media', 'Upload images'],
  ['settings', 'settings', 'Company details'],
];

export default function Dashboard() {
  const [data, setData] = useState({ counts: {}, recent: [] });
  const [loading, setLoading] = useState(true);
  const admin = JSON.parse(localStorage.getItem('virava_admin') || '{}');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmtDate = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  const firstName = (admin.name || '').split(' ')[0] || 'there';
  const newCount = Number(data.counts.new_enquiries || 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Welcome back, {firstName}</h1>
          <p>
            {loading ? 'Loading your site overview…'
              : newCount > 0
                ? `You have ${newCount} new ${newCount === 1 ? 'enquiry' : 'enquiries'} waiting.`
                : 'No new enquiries right now — everything is up to date.'}
          </p>
        </div>
        <Link to="/admin/enquiries" className="btn btn-navy">View Enquiries</Link>
      </div>

      <div className="stat-cards">
        {cards.map(([key, icon, label, to, alert]) => (
          <Link to={to} className={`stat-card ${alert && newCount > 0 ? 'alert' : ''}`} key={key}>
            <span className="sc-ic"><Icon name={icon} size={20} /></span>
            <div>
              <b>{loading ? '—' : (data.counts[key] ?? 0)}</b>
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="dash-split">
        <div className="panel">
          <div className="panel-head">
            <h2>Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {loading ? <p className="empty">Loading…</p> : data.recent?.length ? (
            <div className="table-wrap">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Subject</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {data.recent.map((e) => (
                    <tr key={e.id} className={e.status === 'new' ? 'row-new' : ''}>
                      <td><strong>{e.name}</strong><span className="sub">{e.email}</span></td>
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

        <div className="panel">
          <div className="panel-head"><h2>Quick actions</h2></div>
          <div className="quick-list">
            {shortcuts.map(([to, icon, label]) => (
              <Link className="quick-item" to={`/admin/${to}`} key={to}>
                <span className="quick-ic"><Icon name={icon} size={17} /></span>
                <span>{label}</span>
                <span className="quick-arrow">›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
