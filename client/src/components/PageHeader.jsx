import { Link } from 'react-router-dom';
import SplitText from './SplitText.jsx';
import './PageHeader.css';

export default function PageHeader({ title, subtitle, image = '/img/banner3.jpg', crumbs = [] }) {
  return (
    <section className="page-header" style={{ backgroundImage: `url(${image})` }}>
      <div className="page-header-overlay" />
      <div className="container page-header-inner">
        <nav className="crumbs">
          <Link to="/">Home</Link>
          {crumbs.map((c, i) => (
            <span key={i}>
              <span className="crumb-sep">/</span>
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span className="crumb-current">{c.label}</span>}
            </span>
          ))}
        </nav>
        {/* keyed on the title so the words re-run when the route changes */}
        <h1><SplitText key={title}>{title}</SplitText></h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
