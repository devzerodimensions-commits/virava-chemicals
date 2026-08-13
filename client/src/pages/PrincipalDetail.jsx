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

export default function PrincipalDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [enquiry, setEnquiry] = useState(false);

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
  const shortName = data.name.split(' ')[0];

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
            {data.website && (
              <a href={data.website} target="_blank" rel="noreferrer" className="btn btn-outline">Visit Website →</a>
            )}
          </div>
        </div>
      </section>

      {/* Product solutions */}
      {cats.length > 0 && (
        <section className="section section-soft">
          <div className="container">
            <div className="center reveal">
              <span className="eyebrow">Products & Solutions</span>
              <h2 className="section-title">The <span className="serif">{shortName}</span> product range</h2>
              <p className="section-intro">Explore the product categories we supply from {data.name}. Click any category for grades, specifications and enquiry.</p>
            </div>
            <div className="prod-cat-grid">
              {cats.map((cat) => (
                <Link to={`/products/${cat.slug}`} className="prod-cat-card reveal" key={cat.id}>
                  <div className="pcc-img">
                    <img src={cat.image_url} alt={cat.name} />
                    {cat.tagline && <span className="pcc-tag">{cat.tagline}</span>}
                  </div>
                  <div className="pcc-body">
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                    <span className="cat-link">{cat.products?.length || 0} products →</span>
                  </div>
                </Link>
              ))}
            </div>
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
            <button className="btn btn-primary" onClick={() => setEnquiry(true)}>Request a Quote <span>→</span></button>
          </div>
        </div>
      </section>

      {enquiry && <EnquiryModal category={data.name} onClose={() => setEnquiry(false)} />}
    </>
  );
}
