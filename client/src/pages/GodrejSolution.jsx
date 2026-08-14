import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import PageHeader from '../components/PageHeader.jsx';
import EnquiryModal from '../components/EnquiryModal.jsx';
import './GodrejSolution.css';

const SLUG = 'godrej-industries-limited';

/* Godrej divides its range into four product solutions. Each gets this same page,
   scoped to the categories carrying that `solution` value. */
export const SOLUTIONS = [
  {
    slug: 'oleochemicals', name: 'Oleochemicals',
    portfolio: 'Oleochemicals Portfolio',
    image: '/img/categories/glycerine.jpg',
    title: <>High-purity oleochemicals for <span className="serif">demanding</span> industrial needs</>,
    lead: 'Renewable fatty acids, fatty alcohols, glycerine and speciality derivatives — engineered for purity, consistency and performance across a wide range of industrial applications.',
    points: ['Sustainably sourced and bio-based', 'Consistent, batch-to-batch quality', 'Adaptable across diverse industries'],
  },
  {
    slug: 'surfactants', name: 'Surfactants',
    portfolio: 'Our Surfactants Portfolio',
    image: '/img/categories/surfactants.jpg',
    title: <>Surfactants that build <span className="serif">foam</span>, cleaning and mildness</>,
    lead: 'Anionic and non-ionic surfactants — AOS, SLS, SLES, ALS and KOS — supplied as pastes, liquids, needles and granules for home care, personal care and industrial cleaning.',
    points: ['High foam and reliable detergency', 'Liquid, paste, needle and granule forms', 'Home care, personal care and industrial cleaning'],
  },
  {
    slug: 'specialty-chemicals', name: 'Specialty Chemicals',
    portfolio: 'Our Specialities Portfolio',
    image: '/img/categories/oleo-derivatives.jpg',
    title: <>Speciality chemistry for <span className="serif">formulation</span> performance</>,
    lead: 'Conditioning systems, emulsifiers, esters and emollients, ethoxylates, food emulsifiers, performance additives and preservatives for personal care, home care and food.',
    points: ['Conditioning, emulsification and sensory control', 'Food-grade and personal-care grades', 'Preservation and microbial control'],
  },
  {
    slug: 'biotech', name: 'Biotech',
    portfolio: 'Biosurfactants Portfolio',
    image: '/img/categories/biotech.jpg',
    title: <>Fermentation-derived <span className="serif">biosurfactants</span></>,
    lead: 'Sophorolipid biosurfactants produced by fermentation — readily biodegradable, bio-based alternatives for home and personal care formulations.',
    points: ['Bio-based and readily biodegradable', 'Produced by fermentation', 'Home care and personal care'],
  },
];

// Order the portfolio the way Godrej groups it, rather than by the generic
// category sort_order. Anything not listed falls in afterwards, alphabetically.
const CATEGORY_ORDER = [
  'glycerine', 'stearic-acids', 'fatty-acids', 'oleic-acids', 'fatty-alcohols',
  'alpha-olefin-sulfonate-aos', 'sodium-lauryl-sulphate-sls',
  'sodium-lauryl-ether-sulphate-sles', 'ammonium-lauryl-sulphate-als',
  'di-potassium-oleate-sulfonate-kos', 'surfactants',
  'conditioning-and-care-systems', 'emulsifiers-and-systems', 'esters-and-emollients',
  'ethoxylates-and-surfactants', 'food-emulsifiers', 'performance-additives',
  'preservatives-and-antimicrobials', 'oleo-derivatives-and-specialty-chemicals',
  'sophorolipids',
];

export default function GodrejSolution() {
  const { solution: solutionSlug } = useParams();
  const solution = SOLUTIONS.find((s) => s.slug === solutionSlug);

  const [data, setData] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [active, setActive] = useState(0);
  const [enquiry, setEnquiry] = useState(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    api.get(`/principals/${SLUG}`).then((r) => setData(r.data)).catch(() => setData({ error: true }));
    api.get('/industries').then((r) => setIndustries(r.data)).catch(() => {});
  }, []);

  useEffect(() => { setActive(0); sectionRefs.current = []; }, [solutionSlug]);

  const cats = useMemo(() => {
    const list = (data?.categories || [])
      .filter((c) => (c.products?.length || 0) > 0)
      .filter((c) => c.solution === solutionSlug);
    return [...list].sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a.slug), ib = CATEGORY_ORDER.indexOf(b.slug);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [data, solutionSlug]);

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

  if (!solution) return <Navigate to={`/principals/${SLUG}/oleochemicals`} replace />;
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
        title={solution.name}
        image={cats[0]?.image_url || solution.image}
        subtitle="Godrej Industries Limited — distributed across India by Virava Chemicals"
        crumbs={[{ label: 'Principals', to: '/#principals' }, { label: 'Godrej Industries Limited' }]}
      />

      {/* ---------------- INTRO ---------------- */}
      <section className="section go-intro">
        <div className="container go-intro-grid">
          <div className="go-intro-side reveal">
            {data.logo_url && <img className="go-logo" src={data.logo_url} alt={data.name} />}
            <span className="go-kicker">{solution.name}</span>
          </div>
          <div className="go-intro-body reveal">
            <h2 className="go-lead-title">{solution.title}</h2>
            <p className="go-lead">
              As exclusive distributors for {data.name}, Virava Chemicals supplies {solution.lead}
            </p>
            <ul className="go-points">
              {solution.points.map((h) => <li key={h}>{h}</li>)}
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
      {cats.length === 0 ? (
        <section className="section section-soft">
          <div className="container center">
            <h2 className="go-section-title">{solution.portfolio}</h2>
            <p className="section-intro">
              We are building out this part of the range. Contact us for availability, grades and
              pricing on {solution.name.toLowerCase()} from {data.name}.
            </p>
            <Link to="/contact" className="btn btn-primary">Talk to our team <span>→</span></Link>
          </div>
        </section>
      ) : (
        <section className="section section-soft go-portfolio">
          <div className="container">
            <h2 className="go-section-title">{solution.portfolio}</h2>

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
                        <Link className="go-product" key={p.id} to={`/product/${p.slug}`}>
                          <span className="go-product-name">{p.name}</span>
                          <span className="go-product-arrow">›</span>
                        </Link>
                      ))}
                    </div>

                    <Link to={`/products?category=${c.slug}`} className="btn btn-outline go-view-all">
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
            <h2 className="go-section-title">{solution.name} Markets</h2>
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

      {/* ---------------- OTHER SOLUTIONS ---------------- */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="go-section-title">Other Product Solutions</h2>
          <div className="go-others">
            {SOLUTIONS.filter((s) => s.slug !== solution.slug).map((s) => (
              <Link key={s.slug} to={`/principals/${SLUG}/${s.slug}`} className="go-other">{s.name}</Link>
            ))}
            <Link to="/products" className="go-other">All Products</Link>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cat-cta reveal">
            <div>
              <h3>Need a Godrej {solution.name.toLowerCase()} grade?</h3>
              <p>Get specifications, samples and bulk pricing from our team.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setEnquiry({ name: '' })}>
              Request a Quote <span>→</span>
            </button>
          </div>
        </div>
      </section>

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
