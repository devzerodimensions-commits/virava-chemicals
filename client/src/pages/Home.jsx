import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import { useSettings } from '../components/PublicLayout.jsx';
import Counter from '../components/Counter.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import './Home.css';

export default function Home() {
  const settings = useSettings();
  const [cats, setCats] = useState([]);
  const [principals, setPrincipals] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data)).catch(() => {});
    api.get('/principals').then((r) => setPrincipals(r.data)).catch(() => {});
    api.get('/industries').then((r) => setIndustries(r.data)).catch(() => {});
    api.get('/blogs').then((r) => setBlogs(r.data)).catch(() => {});
  }, []);

  useReveal([cats, principals, industries, blogs]);

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      {/* ---------------- INTRO (before the slider) ---------------- */}
      <section className="intro-band">
        <div className="container">
          <span className="eyebrow">Virava Chemicals · Since {settings.established || '1997'}</span>
          <h1 className="intro-title">Your trusted partner in <span className="serif">industrial chemicals</span></h1>
          <p className="intro-text">
            {settings.about_full ||
              'Virava Chemicals is a closely held partnership firm and an agency house serving the industrial world of India with quality oleo and specialty chemicals for more than five decades. As the exclusive distributors of Godrej Industries Ltd and other reputed manufacturers, we supply fatty alcohols, fatty acids, surfactants, glycerine and specialty chemicals to 20+ industries.'}
          </p>
          <div className="intro-cta">
            <Link to="/about" className="btn btn-navy">Learn More <span>→</span></Link>
            <Link to="/contact" className="btn btn-outline">Enquire Now</Link>
          </div>
        </div>
      </section>

      {/* ---------------- HERO SLIDER (one slide per principal) ---------------- */}
      <HeroSlider items={principals} />

      <div className="home-content">
      {/* ---------------- QUICK HIGHLIGHTS ---------------- */}
      <section className="highlights">
        <div className="container highlights-grid">
          {[
            ['🏆', '35+ Awards', 'Recognised & award-winning brand'],
            ['🤝', 'Godrej Partner', 'Exclusive distributors of oleo chemicals'],
            ['🏭', '20+ Industries', 'Served across diverse sectors'],
            ['⏳', '3 Generations', 'Trusted since 1997'],
          ].map(([ic, t, d]) => (
            <div className="highlight" key={t}>
              <span className="hl-ic">{ic}</span>
              <div><strong>{t}</strong><span>{d}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- PRODUCT CATEGORIES ---------------- */}
      <section className="section section-soft">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Our Product Range</span>
            <h2 className="section-title">Chemicals we <span className="serif">supply</span></h2>
            <p className="section-intro">A comprehensive portfolio of oleochemicals and specialty products sourced from the country's most reputed manufacturers.</p>
          </div>
          <div className="cat-grid">
            {cats.map((c) => (
              <Link to={`/products/${c.slug}`} className="cat-card reveal" key={c.id}>
                <div className="cat-img"><img src={c.image_url} alt={c.name} /></div>
                <div className="cat-body">
                  <h3>{c.name}</h3>
                  <p>{c.tagline}</p>
                  <span className="cat-link">View products →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PRINCIPALS ---------------- */}
      <section className="section section-soft principals-sec" id="principals">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Our Principals</span>
            <h2 className="section-title">We are the exclusive <span className="serif">distributors</span> of</h2>
            <p className="section-intro">The country's most reputed manufacturers whom we proudly represent across India.</p>
          </div>
          <div className="principals-list">
            {principals.map((p, i) => (
              <Link to={`/principals/${p.slug}`} className="principal-row reveal" key={p.id}>
                <div className="pr-logo"><img src={p.logo_url} alt={p.name} /></div>
                <div className="pr-info">
                  <span className="pr-num">Principal 0{i + 1}</span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <span className="cat-link">View details →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- INDUSTRIES ---------------- */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Industries We Serve</span>
            <h2 className="section-title">A broad spectrum of <span className="serif">industries</span></h2>
            <p className="section-intro">Our chemicals power manufacturing across more than twenty sectors of the Indian industrial economy.</p>
          </div>
          <div className="ind-grid">
            {industries.slice(0, 12).map((ind) => (
              <div className="ind-card reveal" key={ind.id}>
                <img src={ind.image_url} alt={ind.name} />
                <div className="ind-overlay"><h4>{ind.name}</h4></div>
              </div>
            ))}
          </div>
          <div className="center" style={{ marginTop: 40 }}>
            <Link to="/industries" className="btn btn-outline">View All Industries <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="stats-sec">
        <div className="container stats-grid">
          <div className="stats-head reveal">
            <span className="eyebrow" style={{ color: '#cccccc' }}>Our Track Record</span>
            <h2>We are proud of<br /><span className="serif">our achievements</span></h2>
          </div>
          <div className="stats-nums">
            <div className="stat reveal"><b><Counter end={settings.stat_experience || 50} /></b><span>Years Experience</span></div>
            <div className="stat reveal"><b><Counter end={settings.stat_awards || 35} /></b><span>Awards Won</span></div>
            <div className="stat reveal"><b><Counter end={settings.stat_customers || 3000} /></b><span>Satisfied Customers</span></div>
          </div>
        </div>
      </section>

      {/* ---------------- BLOG ---------------- */}
      {blogs.length > 0 && (
        <section className="section blog-sec">
          <div className="container">
            <div className="center reveal">
              <span className="eyebrow">From Our Desk</span>
              <h2 className="section-title">Latest <span className="serif">insights</span> & news</h2>
              <p className="section-intro">Knowledge and updates from the world of oleochemicals and specialty chemicals.</p>
            </div>
            <div className="blog-grid">
              {blogs.slice(0, 3).map((b) => (
                <Link to={`/blog/${b.slug}`} className="blog-card reveal" key={b.id}>
                  <div className="blog-img">
                    <img src={b.image_url} alt={b.title} />
                    {b.category && <span className="blog-tag">{b.category}</span>}
                  </div>
                  <div className="blog-body">
                    <div className="blog-meta">
                      <span>📅 {fmtDate(b.published_at)}</span>
                      {b.author && <span>✍ {b.author}</span>}
                    </div>
                    <h3>{b.title}</h3>
                    <p>{b.excerpt}</p>
                    <span className="cat-link">Read More →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- CTA ---------------- */}
      <section className="cta-sec">
        <div className="container cta-inner reveal">
          <div>
            <h2>Looking for a reliable chemical partner?</h2>
            <p>Get in touch for product specifications, pricing and bulk supply enquiries.</p>
          </div>
          <Link to="/contact" className="btn btn-primary">Enquire Now <span>→</span></Link>
        </div>
      </section>
      </div>
    </>
  );
}
