import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import PageHeader from '../components/PageHeader.jsx';
import EnquiryModal from '../components/EnquiryModal.jsx';
import './pages.css';

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
      <Link to="/about" className="btn btn-navy">Back to About</Link>
    </div>
  );
  if (!data) return <div className="container section center"><p>Loading…</p></div>;

  return (
    <>
      <PageHeader title={data.name} image="/img/banner3.jpg"
        subtitle="An exclusive manufacturing principal represented by Virava Chemicals."
        crumbs={[{ label: 'Principals', to: '/about' }, { label: data.name }]} />

      <section className="section">
        <div className="container">
          <div className="pd-top reveal">
            {data.logo_url && <div className="pd-logo"><img src={data.logo_url} alt={data.name} /></div>}
            <div className="pd-intro">
              <span className="eyebrow">Our Principal</span>
              <h2 className="section-title">{data.name}</h2>
              <p>{data.description}</p>
              {data.website && (
                <a href={data.website} target="_blank" rel="noreferrer" className="btn btn-outline">Visit Website →</a>
              )}
            </div>
          </div>

          {data.categories?.length ? data.categories.map((cat) => (
            <div className="pd-cat reveal" key={cat.id}>
              <div className="pd-cat-head">
                <h3>{cat.name}</h3>
                {cat.tagline && <span>{cat.tagline}</span>}
              </div>
              {cat.products?.length ? (
                <div className="prod-table-wrap">
                  <table className="prod-table">
                    <thead><tr><th>Product</th><th>CAS No.</th><th>Grade</th><th>Packaging</th><th></th></tr></thead>
                    <tbody>
                      {cat.products.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.name}</strong><span className="prod-desc">{p.description}</span></td>
                          <td>{p.cas_no || '—'}</td>
                          <td>{p.grade || '—'}</td>
                          <td>{p.packaging || '—'}</td>
                          <td><button className="btn-enquire" onClick={() => setEnquiry(p)}>Enquire</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p><Link to={`/products/${cat.slug}`} className="cat-link">View {cat.name} →</Link></p>
              )}
            </div>
          )) : <p className="center">Product details coming soon. Please <Link to="/contact">contact us</Link>.</p>}

          <div className="cat-cta reveal">
            <div>
              <h3>Interested in {data.name} products?</h3>
              <p>Reach out for specifications, samples and pricing.</p>
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
