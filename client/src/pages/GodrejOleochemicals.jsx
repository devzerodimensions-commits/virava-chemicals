import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import PageHeader from '../components/PageHeader.jsx';
import EnquiryModal from '../components/EnquiryModal.jsx';
import ProductModal from '../components/ProductModal.jsx';
import './GodrejOleochemicals.css';

const SLUG = 'godrej-industries-limited';

// Order the portfolio the way Godrej groups it, rather than by the generic
// category sort_order. Anything not listed falls in afterwards, alphabetically.
const CATEGORY_ORDER = [
  'glycerine', 'stearic-acids', 'fatty-acids', 'oleic-acids',
  'fatty-alcohols', 'surfactants', 'oleo-derivatives-and-specialty-chemicals',
];

const HIGHLIGHTS = [
  'Sustainably sourced and bio-based',
  'Consistent, batch-to-batch quality',
  'Adaptable across diverse industries',
];

// applications shown inside a product's detail modal, by category slug
const CATEGORY_APPS = {
  'fatty-alcohols': ['Personal Care', 'Detergents', 'Cosmetics', 'Emulsifiers'],
  'fatty-acids': ['Rubber', 'Plastics', 'Cosmetics', 'Candles', 'Lubricants'],
  'stearic-acids': ['Cosmetics', 'Detergents', 'Lubricants', 'Rubber'],
  'oleic-acids': ['Lubricants', 'Textiles', 'Soaps', 'Intermediates'],
  'surfactants': ['Detergents', 'Personal Care', 'Textiles', 'Industrial Cleaning'],
  'glycerine': ['Pharmaceuticals', 'Food', 'Cosmetics', 'Paints & Resins'],
  'oleo-derivatives-and-specialty-chemicals': ['Cosmetics', 'Food', 'Plastics', 'Personal Care'],
};

export default function GodrejOleochemicals() {
  const [data, setData] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [active, setActive] = useState(0);
  const [product, setProduct] = useState(null);
  const [productCat, setProductCat] = useState(null);
  const [enquiry, setEnquiry] = useState(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    api.get(`/principals/${SLUG}`).then((r) => setData(r.data)).catch(() => setData({ error: true }));
    api.get('/industries').then((r) => setIndustries(r.data)).catch(() => {});
  }, []);

  const cats = useMemo(() => {
    const list = (data?.categories || []).filter((c) => (c.products?.length || 0) > 0);
    return [...list].sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a.slug), ib = CATEGORY_ORDER.indexOf(b.slug);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [data]);

  useReveal([cats, industries]);

  // scroll-spy: highlight the side-nav entry for whichever section is in view
  useEffect(() => {
    if (!cats.length) return;
    const els = sectionRefs.current.filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(els.indexOf(visible.target));
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [cats]);

  const jumpTo = (i) => {
    const el = sectionRefs.current[i];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  if (!data) return <div className="container section center"><p>Loading…</p></div>;
  if (data.error) return (
    <div className="container section center">
      <h2>Page not available</h2>
      <Link to="/" className="btn btn-navy">Back to Home</Link>
    </div>
  );

  const totalProducts = cats.reduce((s, c) => s + (c.products?.length || 0), 0);

  return (
    <>
      <PageHeader
        title="Oleochemicals"
        image={cats[0]?.image_url || '/img/pro4.jpg'}
        subtitle="Godrej Industries Limited — distributed across India by Virava Chemicals"
        crumbs={[{ label: 'Principals', to: '/#principals' }, { label: 'Godrej Industries Limited' }]}
      />

      {/* ---------------- INTRO ---------------- */}
      <section className="section go-intro">
        <div className="container go-intro-grid">
          <div className="go-intro-side reveal">
            {data.logo_url && <img className="go-logo" src={data.logo_url} alt={data.name} />}
            <span className="go-kicker">Oleochemicals</span>
          </div>
          <div className="go-intro-body reveal">
            <h2 className="go-lead-title">
              High-purity oleochemicals for <span className="serif">demanding</span> industrial needs
            </h2>
            <p className="go-lead">
              As exclusive distributors for {data.name}, Virava Chemicals supplies renewable fatty
              acids, fatty alcohols, glycerine and specialty derivatives — engineered for purity,
              consistency and performance across a wide range of industrial applications.
            </p>
            <ul className="go-points">
              {HIGHLIGHTS.map((h) => <li key={h}>{h}</li>)}
            </ul>
            <div className="go-figures">
              <div><b>{cats.length}</b><span>Product Categories</span></div>
              <div><b>{totalProducts}</b><span>Grades & Products</span></div>
              <div><b>20+</b><span>Industries Served</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PORTFOLIO ---------------- */}
      {cats.length > 0 && (
        <section className="section section-soft go-portfolio">
          <div className="container">
            <h2 className="go-section-title">Oleochemicals Portfolio</h2>

            <div className="go-grid">
              {/* sticky category rail */}
              <aside className="go-rail">
                <nav className="go-rail-nav">
                  {cats.map((c, i) => (
                    <button
                      key={c.id}
                      className={`go-rail-item ${i === active ? 'on' : ''}`}
                      onClick={() => jumpTo(i)}
                      aria-current={i === active ? 'true' : undefined}
                    >
                      <span>{c.name}</span>
                      <span className="go-rail-arrow">›</span>
                    </button>
                  ))}
                </nav>
              </aside>

              {/* stacked category sections */}
              <div className="go-sections">
                {cats.map((c, i) => (
                  <article
                    className="go-cat"
                    key={c.id}
                    ref={(el) => { sectionRefs.current[i] = el; }}
                  >
                    <h3 className="go-cat-title">{c.name}</h3>
                    {c.image_url && (
                      <div className="go-cat-img"><img src={c.image_url} alt={c.name} loading="lazy" /></div>
                    )}
                    {c.description && <p className="go-cat-desc">{c.description}</p>}

                    <div className="go-products">
                      {c.products.map((p) => (
                        <button
                          className="go-product"
                          key={p.id}
                          onClick={() => { setProduct(p); setProductCat(c); }}
                        >
                          <span className="go-product-name">{p.name}</span>
                          <span className="go-product-arrow">›</span>
                        </button>
                      ))}
                    </div>

                    <Link to={`/products/${c.slug}`} className="btn btn-outline go-view-all">
                      View All Products
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- MARKETS ---------------- */}
      {industries.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="go-section-title">Oleochemical Markets</h2>
            <div className="go-markets">
              {industries.slice(0, 8).map((ind) => (
                <Link to="/industries" className="go-market reveal" key={ind.id}>
                  <img src={ind.image_url} alt={ind.name} loading="lazy" />
                  <div className="go-market-cap">
                    <h4>{ind.name}</h4>
                    <span className="go-market-arrow">›</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- OTHER PRINCIPALS ---------------- */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="go-section-title">Other Product Solutions</h2>
          <div className="go-others">
            <Link to="/principals/hpl-additives-limited" className="go-other">HPL Additives</Link>
            <Link to="/principals/oriental-carbon-and-chemicals-limited" className="go-other">Oriental Carbon &amp; Chemicals</Link>
            <Link to="/principals/the-standard-chemicals-co-pvt-ltd" className="go-other">The Standard Chemicals Co.</Link>
            <Link to="/products" className="go-other">All Products</Link>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cat-cta reveal">
            <div>
              <h3>Need a Godrej oleochemical grade?</h3>
              <p>Get specifications, samples and bulk pricing from our team.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setEnquiry({ name: '' })}>
              Request a Quote <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {product && (
        <ProductModal
          product={product}
          categoryName={productCat?.name}
          applications={CATEGORY_APPS[productCat?.slug] || []}
          onClose={() => setProduct(null)}
          onEnquire={(p) => { setProduct(null); setEnquiry(p); }}
        />
      )}

      {enquiry && (
        <EnquiryModal
          product={enquiry.id ? enquiry : null}
          category={data.name}
          onClose={() => setEnquiry(null)}
        />
      )}
    </>
  );
}
