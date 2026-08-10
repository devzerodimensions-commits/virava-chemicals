import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import { useSettings } from '../components/PublicLayout.jsx';
import Counter from '../components/Counter.jsx';
import PrincipalsSlider from '../components/PrincipalsSlider.jsx';
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
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline preload="auto"
          poster="/img/banner3.jpg">
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-text">
            <span className="eyebrow" style={{ color: '#cccccc' }}>Virava Chemicals · Since {settings.established || '1997'}</span>
            <h1>Your Trusted Partner in <span className="hero-accent">Industrial Chemicals</span></h1>
            <p>Exclusive distributors of Godrej oleo chemicals — fatty alcohols, fatty acids, surfactants, glycerine &amp; specialty chemicals for 20+ industries across India.</p>
            <div className="hero-btns">
              <Link to="/products" className="btn btn-primary">Explore Products <span>→</span></Link>
              <Link to="/contact" className="btn btn-ghost-light">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

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

      {/* ---------------- ABOUT ---------------- */}
      <section className="section about-sec">
        <div className="container about-grid">
          <div className="about-media reveal">
            <img src="/img/about.jpg" alt="Virava Chemicals" />
            <div className="about-badge">
              <Counter end={settings.stat_experience || 50} suffix="+" />
              <span>Years of Trust</span>
            </div>
          </div>
          <div className="about-body reveal">
            <span className="eyebrow">Welcome to Virava Chemicals</span>
            <h2 className="section-title">Quality, Service & <span className="serif">Transparency</span> for three generations</h2>
            <p>{settings.about_full ||
              'Virava Chemicals is committed towards quality service and transparency with its customers and principals. We are a valued business partner of Godrej Industries Ltd, a leader in oleo chemicals.'}</p>
            <ul className="about-points">
              <li>Agency house serving industry for 5+ decades</li>
              <li>Exclusive distributor of Godrej Industries Ltd</li>
              <li>Wide portfolio of oleochemicals & specialty products</li>
              <li>Trusted supply across 20+ industries</li>
            </ul>
            <Link to="/about" className="btn btn-navy">Learn More About Us <span>→</span></Link>
          </div>
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

      {/* ---------------- PRINCIPALS SLIDER ---------------- */}
      <PrincipalsSlider items={principals} />

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
