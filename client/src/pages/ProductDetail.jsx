import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import EnquiryModal from '../components/EnquiryModal.jsx';
import './ProductDetail.css';

// Column values worth showing as their own rows, in the order principals list
// them. Anything in products.specs is rendered first, in insertion order.
const COLUMN_ROWS = [
  ['CAS Number', 'cas_no'],
  ['Grade', 'grade'],
  ['Packaging', 'packaging'],
];

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [enquiry, setEnquiry] = useState(null);

  useEffect(() => {
    setProduct(null); setNotFound(false); setRelated([]);
    api.get(`/products/${slug}`)
      .then((r) => {
        setProduct(r.data);
        if (r.data.category_slug) {
          api.get(`/products?category=${r.data.category_slug}`)
            .then((res) => setRelated(res.data.filter((p) => p.slug !== r.data.slug)))
            .catch(() => {});
        }
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  useReveal([product, related]);

  if (notFound) return (
    <div className="container section center">
      <h2>Product not found</h2>
      <Link to="/products" className="btn btn-navy">Browse all products</Link>
    </div>
  );
  if (!product) return <div className="container section center"><p>Loading…</p></div>;

  const rows = [
    ...Object.entries(product.specs || {}),
    ...COLUMN_ROWS.map(([label, key]) => [label, product[key]]),
  ].filter(([, v]) => v);

  return (
    <>
      <section className="section pd2">
        <div className="container">
          <nav className="pd2-crumbs">
            <Link to="/products">Products</Link>
            {product.category_name && (
              <>
                <span className="pd2-sep">|</span>
                <Link to={`/products?category=${product.category_slug}`}>{product.category_name}</Link>
              </>
            )}
          </nav>

          <div className="pd2-grid">
            <div className="pd2-media reveal">
              {product.image_url
                ? <img src={product.image_url} alt={product.name} />
                : <div className="pd2-noimg" aria-hidden="true" />}
            </div>

            <div className="pd2-body reveal">
              <h1 className="pd2-title">{product.name}</h1>
              {product.description && <p className="pd2-desc">{product.description}</p>}

              <div className="pd2-actions">
                <button className="btn btn-outline" onClick={() => setEnquiry({ kind: 'quote' })}>
                  Request Quote
                </button>
                <button className="btn btn-outline" onClick={() => setEnquiry({ kind: 'sample' })}>
                  Request Sample
                </button>
              </div>

              {rows.length > 0 && (
                <dl className="pd2-specs">
                  {rows.map(([k, v]) => (
                    <div className="pd2-row" key={k}>
                      <dt>{k}</dt>
                      <dd>{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section-soft">
          <div className="container">
            <h2 className="pd2-related-title">Related Products</h2>
            <div className="pd2-related">
              {related.map((p) => (
                <Link className="pd2-related-item" to={`/product/${p.slug}`} key={p.id}>
                  <span>{p.name}</span>
                  <span className="pd2-related-arrow">›</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {enquiry && (
        <EnquiryModal product={product} intent={enquiry.kind} onClose={() => setEnquiry(null)} />
      )}
    </>
  );
}
