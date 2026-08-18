import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import './admin.css';

const nav = [
  ['', '📊', 'Dashboard'],
  ['enquiries', '✉', 'Enquiries'],
  ['products', '🧪', 'Products'],
  ['categories', '📁', 'Categories'],
  ['solutions', '🧬', 'Solutions'],
  ['industries', '🏭', 'Industries'],
  ['principals', '🤝', 'Principals'],
  ['hero', '🖼', 'Hero Slides'],
  ['highlights', '⭐', 'Highlights'],
  ['why', '❓', 'Why Virava'],
  ['blogs', '📝', 'Blogs'],
  ['settings', '⚙', 'Settings'],
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const admin = JSON.parse(localStorage.getItem('virava_admin') || '{}');

  const logout = () => {
    localStorage.removeItem('virava_token');
    localStorage.removeItem('virava_admin');
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-side ${open ? 'open' : ''}`}>
        <div className="admin-brand">
          <span className="ab-mark"><img src="/img/mark.png" alt="" /></span>
          <span className="ab-text"><b>Virava</b><i>CHEMICALS</i></span>
        </div>
        <nav className="admin-nav">
          {nav.map(([to, ic, label]) => (
            <NavLink key={to} to={to} end={to === ''} onClick={() => setOpen(false)}>
              <span className="an-ic">{ic}</span> {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <Link to="/" target="_blank" className="view-site">🌐 View Website</Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-top">
          <button className="admin-burger" onClick={() => setOpen(!open)}>☰</button>
          <div className="admin-top-right">
            <span className="admin-user">👤 {admin.name || 'Admin'}</span>
            <button className="admin-logout" onClick={logout}>Logout</button>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
      {open && <div className="admin-backdrop" onClick={() => setOpen(false)} />}
    </div>
  );
}
