import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import { useSettings } from '../components/PublicLayout.jsx';
import Counter from '../components/Counter.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import LegacyGallery from '../components/LegacyGallery.jsx';
import { FALLBACK_SOLUTIONS } from './GodrejSolution.jsx';
import './Home.css';

// Shown only until /highlights resolves, or if it fails
const FALLBACK_HIGHLIGHTS = [
  { id: 'a', icon: 'awards', title: '35+ Awards', subtitle: 'Recognised & award-winning brand' },
  { id: 'b', icon: 'partner', title: 'Godrej Partner', subtitle: 'Exclusive distributors of oleo chemicals' },
  { id: 'c', icon: 'industries', title: '20+ Industries', subtitle: 'Served across diverse sectors' },
  { id: 'd', icon: 'generations', title: '3 Generations', subtitle: 'Trusted since 1996' },
];

// The three principals we represent alongside Godrej
const OTHER_RANGES = [
  { slug: 'hpl-products', kicker: 'HPL Additives', to: '/principals/hpl-additives-limited',
    blurb: 'Antioxidants, accelerators and antidegradants for rubber and polymers.' },
  { slug: 'occl-products', kicker: 'Oriental Carbon', to: '/principals/oriental-carbon-and-chemicals-limited',
    blurb: 'Insoluble sulphur for tyre and rubber vulcanisation.' },
  { slug: 'std-products', kicker: 'Standard Chemicals', to: '/principals/the-standard-chemicals-co-pvt-ltd',
    blurb: 'Specialty chemicals and intermediates across diverse industries.' },
];

/* Highlight-strip icons. Emoji were used here before, but they render as full
   colour on every OS (and differently on each), which fights the black & white
   palette — these are monochrome line icons that inherit currentColor. */
const HL_ICONS = {
  awards: [
    'M6 9H4.5a2.5 2.5 0 0 1 0-5H6', 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', 'M4 22h16',
    'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22',
    'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22',
    'M18 2H6v7a6 6 0 0 0 12 0V2Z',
  ],
  partner: [
    'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
    'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  ],
  industries: [
    'M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z',
    'M17 18h1', 'M12 18h1', 'M7 18h1',
  ],
  generations: [
    'M5 22h14', 'M5 2h14',
    'M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22',
    'M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2',
  ],
};

function HlIcon({ name }) {
  // the icon is admin-editable, so an unrecognised value must degrade, not throw
  const paths = HL_ICONS[name] || HL_ICONS.awards;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths.map((d) => <path d={d} key={d} />)}
    </svg>
  );
}

export default function Home() {
  const settings = useSettings();
  const [cats, setCats] = useState([]);
  const [principals, setPrincipals] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const [products, setProducts] = useState([]);
  const [solutions, setSolutions] = useState(FALLBACK_SOLUTIONS);
  const [highlights, setHighlights] = useState(FALLBACK_HIGHLIGHTS);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data)).catch(() => {});
    api.get('/principals').then((r) => setPrincipals(r.data)).catch(() => {});
    api.get('/industries').then((r) => setIndustries(r.data)).catch(() => {});
    api.get('/blogs').then((r) => setBlogs(r.data)).catch(() => {});
    api.get('/products').then((r) => setProducts(r.data)).catch(() => {});
    api.get('/solutions').then((r) => { if (r.data?.length) setSolutions(r.data); }).catch(() => {});
    api.get('/highlights').then((r) => { if (r.data?.length) setHighlights(r.data); }).catch(() => {});
    api.get('/hero-slides').then((r) => setSlides(r.data)).catch(() => {});
  }, []);

  // The home page shows the seven ranges we actually sell under, not every
  // category — Godrej alone has twenty, most of them sub-categories of a
  // solution, and listing them all buried the page in near-identical cards.
  const ranges = useMemo(() => {
    const bySlug = new Map(cats.map((c) => [c.slug, c]));
    const countIn = (pred) => products.filter((p) => {
      const c = bySlug.get(p.category_slug);
      return c ? pred(c) : false;
    }).length;
    const imageOf = (slug, fallback) => bySlug.get(slug)?.image_url || fallback;

    const solutionCards = solutions.map((s) => ({
      name: s.name,
      kicker: 'Godrej Industries',
      to: `/principals/godrej-industries-limited/${s.slug}`,
      image: s.image_url,
      blurb: s.blurb,
      count: countIn((c) => c.solution === s.slug),
    }));

    const others = OTHER_RANGES
      .filter(({ slug }) => bySlug.has(slug))
      .map(({ slug, kicker, to, blurb }) => ({
        name: bySlug.get(slug).name, kicker, to, blurb,
        image: imageOf(slug), count: countIn((c) => c.slug === slug),
      }));

    return [...solutionCards, ...others];
  }, [cats, products, solutions]);

  useReveal([ranges, principals, industries, blogs, highlights]);

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      {/* ---------------- INTRO (before the slider) ---------------- */}
      <section className="intro-band">
        <div className="container">
          <span className="eyebrow">Virava Chemicals · Since {settings.established || '1996'}</span>
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

      {/* ---------------- HERO SLIDER (managed under Hero Slides in the admin) ---------------- */}
      <HeroSlider items={slides} />

      <div className="home-content">
      {/* ---------------- QUICK HIGHLIGHTS ---------------- */}
      <section className="highlights">
        <div className="container highlights-grid">
          {highlights.map((h) => (
            <div className="highlight" key={h.id ?? h.title}>
              <span className="hl-ic"><HlIcon name={h.icon} /></span>
              <div className="hl-text"><strong>{h.title}</strong><span>{h.subtitle}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- PRODUCT RANGE ---------------- */}
      <section className="section section-soft">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Our Product Range</span>
            <h2 className="section-title">Chemicals we <span className="serif">supply</span></h2>
            <p className="section-intro">A comprehensive portfolio of oleochemicals and specialty products sourced from the country's most reputed manufacturers.</p>
          </div>
          <div className="range-grid">
            {ranges.map((r) => (
              <Link to={r.to} className="range-card reveal" key={r.name}>
                <div className="range-img">
                  <img src={r.image} alt={r.name} loading="lazy" />
                  <span className="range-kicker">{r.kicker}</span>
                </div>
                <div className="range-body">
                  <h3>{r.name}</h3>
                  <p>{r.blurb}</p>
                  <span className="range-meta">
                    {r.count > 0 && <em>{r.count} products</em>}
                    <span className="range-arrow">→</span>
                  </span>
                </div>
              </Link>
            ))}
            <Link to="/products" className="range-card range-cta reveal">
              <div className="range-cta-in">
                <h3>Browse the full range</h3>
                <p>Search every grade by chemistry or principal.</p>
                <span className="range-meta"><em>All products</em><span className="range-arrow">→</span></span>
              </div>
            </Link>
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

      {/* ---------------- LEGACY PHOTOS ----------------
          Same carousel as the About page, from components/LegacyGallery.jsx.
          Sits straight after the principals because the photographs are of the
          Godrej relationship the section above it describes. */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Our Legacy</span>
            <h2 className="section-title">Moments from our <span className="serif">journey</span></h2>
            <p className="section-intro">From the Fatty Alcohol Meet of 1985 to the present day — reflecting Virava's long-standing association with Godrej Industries.</p>
          </div>
          <LegacyGallery />
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
