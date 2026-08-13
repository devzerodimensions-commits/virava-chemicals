import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import PageHeader from '../components/PageHeader.jsx';
import EnquiryModal from '../components/EnquiryModal.jsx';
import './pages.css';

const APPLICATIONS = [
  'Plastics', 'Rubber', 'Cosmetics & Personal Care', 'Detergents', 'Pharmaceuticals',
  'Paints & Coatings', 'Lubricants', 'Textiles', 'Food Products', 'Agrochemicals',
];

function portfolioLabel(name = '') {
  const n = name.toLowerCase();
  if (n.includes('godrej')) return 'Oleochemicals Portfolio';
  if (n.includes('hpl')) return 'Additives Portfolio';
  if (n.includes('oriental') || n.includes('occl')) return 'Insoluble Sulphur Portfolio';
  if (n.includes('standard')) return 'Specialty Chemicals Portfolio';
  return 'Product Portfolio';
}

export default function PrincipalDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [enquiry, setEnquiry] = useState(null);

  useEffect(() => {
    setData(null); setNotFound(false);
    api.get(`/principals/${slug}`).then((r) => setData(r.data)).catch(() => setNotFound(true));
  }, [slug]);

  useReveal([data]);

  if (notFound) return (
    <div className="container section center">
      <h2>Principal not found</h2>
      <Link to="/" className="btn btn-navy">Back to Home</Link>
    </div>
  );
  if (!data) return <div className="container section center"><p>Loading…</p></div>;

  const cats = data.categories || [];
  const totalProducts = cats.reduce((s, c) => s + (c.products?.length || 0), 0);
  const headerImg = cats[0]?.image_url || '/img/banner3.jpg';

  return (
    <>
      <PageHeader title={data.name} image={headerImg}
        subtitle="Products & Solutions — distributed by Virava Chemicals"
        crumbs={[{ label: 'Principals', to: '/#principals' }, { label: data.name }]} />

      {/* Overview */}
      <section className="section">
        <div className="container pd-top reveal">
          {data.logo_url && <div className="pd-logo"><img src={data.logo_url} alt={data.name} /></div>}
          <div className="pd-intro">
            <span className="eyebrow">Overview</span>
            <h2 className="section-title">{data.name}</h2>
            <p>{data.description}</p>
            <div className="pd-stats">
              <div><b>{cats.length}</b><span>Product Categories</span></div>
              <div><b>{totalProducts}+</b><span>Products</span></div>
              <div><b>20+</b><span>Industries Served</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio (categories + products) */}
      {cats.length > 0 && (
        <section className="section section-soft">
          <div className="container">
            <div className="center reveal">
              <span className="eyebrow">{portfolioLabel(data.name)}</span>
              <h2 className="section-title">Complete <span className="serif">product</span> portfolio</h2>
              <p className="section-intro">The full range of products we supply from {data.name} — with grades and specifications.</p>
            </div>

            {cats.map((cat) => (
              <div className="portfolio-cat reveal" key={cat.id}>
                <div className="portfolio-cat-head">
                  <h3>{cat.name}</h3>
                  {cat.tagline && <span>{cat.tagline}</span>}
                </div>
                {cat.products?.length ? (
                  <div className="portfolio-grid">
                    {cat.products.map((p) => (
                      <div className="portfolio-product" key={p.id}>
                        <h4>{p.name}</h4>
                        <p>{p.description}</p>
                        <div className="pp-meta">
                          {p.cas_no && <span>CAS: {p.cas_no}</span>}
                          {p.grade && <span>{p.grade}</span>}
                          {p.packaging && <span>{p.packaging}</span>}
                        </div>
                        <button className="btn-enquire" onClick={() => setEnquiry(p)}>Enquire</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p><Link to={`/products/${cat.slug}`} className="cat-link">View {cat.name} →</Link></p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Applications */}
      <section className="section">
        <div className="container center reveal">
          <span className="eyebrow">Applications</span>
          <h2 className="section-title">Industries we <span className="serif">serve</span></h2>
          <p className="section-intro">These products are trusted across a broad spectrum of Indian industries.</p>
          <div className="pd-apps">
            {APPLICATIONS.map((a) => <span key={a} className="pd-app">{a}</span>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cat-cta reveal">
            <div>
              <h3>Interested in {data.name} products?</h3>
              <p>Get specifications, samples and pricing from our team.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setEnquiry({ name: '' })}>Request a Quote <span>→</span></button>
          </div>
        </div>
      </section>

      {enquiry && (
        <EnquiryModal product={enquiry.id ? enquiry : null} category={data.name} onClose={() => setEnquiry(null)} />
      )}
    </>
  );
}
