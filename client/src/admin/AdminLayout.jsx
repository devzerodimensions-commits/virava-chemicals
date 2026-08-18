import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import Icon from './icons.jsx';
import './admin.css';

/* Grouped rather than one flat list — fourteen undifferentiated links is a lot
   to scan, and at the old row height the sidebar ran past the bottom of a
   1366x768 laptop screen, cutting off the footer link. */
const groups = [
  ['Overview', [
    ['', 'dashboard', 'Dashboard'],
    ['enquiries', 'enquiries', 'Enquiries'],
  ]],
  ['Catalogue', [
    ['products', 'products', 'Products'],
    ['categories', 'categories', 'Categories'],
    ['solutions', 'solutions', 'Solutions'],
    ['principals', 'principals', 'Principals'],
    ['industries', 'industries', 'Industries'],
  ]],
  ['Website content', [
    ['hero', 'hero', 'Hero Slides'],
    ['highlights', 'highlights', 'Highlights'],
    ['why', 'why', 'Why Virava'],
    ['blogs', 'blogs', 'Blogs'],
    ['media', 'media', 'Media'],
  ]],
  ['System', [
    ['users', 'users', 'Users'],
    ['settings', 'settings', 'Settings'],
  ]],
];

const titleFor = (pathname) => {
  const seg = pathname.replace(/^\/admin\/?/, '').split('/')[0];
  for (const [, items] of groups) {
    const hit = items.find(([to]) => to === seg);
    if (hit) return hit[2];
  }
  return 'Dashboard';
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const admin = JSON.parse(localStorage.getItem('virava_admin') || '{}');
  const initials = (admin.name || 'A').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

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
          {groups.map(([label, items]) => (
            <div className="nav-group" key={label}>
              <span className="nav-group-label">{label}</span>
              {items.map(([to, icon, text]) => (
                <NavLink key={to} to={to} end={to === ''} onClick={() => setOpen(false)}>
                  <span className="an-ic"><Icon name={icon} /></span>
                  <span className="an-text">{text}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-side-foot">
          <Link to="/" target="_blank" rel="noreferrer" className="view-site">
            <Icon name="external" size={16} /> View Website
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-top">
          <button className="admin-burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
          <h2 className="admin-top-title">{titleFor(loc.pathname)}</h2>
          <div className="admin-top-right">
            <span className="admin-user">
              <span className="admin-avatar">{initials}</span>
              <span className="admin-user-name">{admin.name || 'Admin'}</span>
            </span>
            <button className="admin-logout" onClick={logout}>
              <Icon name="logout" size={15} /> Logout
            </button>
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
