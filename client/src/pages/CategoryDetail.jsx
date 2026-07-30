import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import PageHeader from '../components/PageHeader.jsx';
import EnquiryModal from '../components/EnquiryModal.jsx';
import './pages.css';

export default function CategoryDetail() {
  const { slug } = useParams();
  const [cat, setCat] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [enquiry, setEnquiry] = useState(null); // product to enquire about

  useEffect(() => {
    setCat(null); setNotFound(false);
    api.get(`/categories/${slug}`).then((r) => setCat(r.data)).catch(() => setNotFound(true));
  }, [slug]);

  useReveal([cat]);

  if (notFound) return (
    <div className="container section center">
      <h2>Category not found</h2>
      <Link to="/products" className="btn btn-navy">Back to Products</Link>
    </div>
  );
  if (!cat) return <div className="container section center"><p>Loading…</p></div>;

  return (
    <>
      <PageHeader title={cat.name} image={cat.image_url || '/img/banner2.jpg'}
        subtitle={cat.tagline}
        crumbs={[{ label: 'Products', to: '/products' }, { label: cat.name }]} />

      <section className="section">
        <div className="container">
          <div className="cat-detail-intro reveal">
            <p>{cat.description}</p>
          </div>

          {cat.products?.length ? (
            <div className="prod-table-wrap reveal">
              <table className="prod-table">
                <thead>
                  <tr><th>Product</th><th>CAS No.</th><th>Grade</th><th>Packaging</th><th></th></tr>
                </thead>
                <tbody>
                  {cat.products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong>
                        <span className="prod-desc">{p.description}</span>
                      </td>
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
            <p className="center">Product details coming soon. Please <Link to="/contact">contact us</Link> for this category.</p>
          )}

          <div className="cat-cta reveal">
            <div>
              <h3>Need a specific grade or bulk quantity?</h3>
              <p>Our team will help you with specifications, samples and pricing.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setEnquiry({ name: '' })}>Request a Quote <span>→</span></button>
          </div>
        </div>
      </section>

      {enquiry && (
        <EnquiryModal
          product={enquiry.id ? enquiry : null}
          category={cat.name}
          onClose={() => setEnquiry(null)}
        />
      )}
    </>
  );
}
