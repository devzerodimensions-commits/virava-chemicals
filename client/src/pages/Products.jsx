import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import PageHeader from '../components/PageHeader.jsx';
import './pages.css';

export default function Products() {
  const [cats, setCats] = useState([]);
  useEffect(() => { api.get('/categories').then((r) => setCats(r.data)).catch(() => {}); }, []);
  useReveal([cats]);

  return (
    <>
      <PageHeader title="Our Products" image="/img/banner1.jpg"
        subtitle="A comprehensive range of oleochemicals and specialty products for every industry."
        crumbs={[{ label: 'Products' }]} />

      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Product Categories</span>
            <h2 className="section-title">Explore our chemical <span className="serif">portfolio</span></h2>
            <p className="section-intro">Click any category to view the products, grades and specifications we supply.</p>
          </div>

          <div className="prod-cat-grid">
            {cats.map((c) => (
              <Link to={`/products/${c.slug}`} className="prod-cat-card reveal" key={c.id}>
                <div className="pcc-img"><img src={c.image_url} alt={c.name} />
                  <span className="pcc-tag">{c.tagline}</span>
                </div>
                <div className="pcc-body">
                  <h3>{c.name}</h3>
                  <p>{c.description}</p>
                  <span className="cat-link">View products →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
