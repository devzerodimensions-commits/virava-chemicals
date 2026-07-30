import { useEffect, useState } from 'react';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import PageHeader from '../components/PageHeader.jsx';
import './pages.css';

export default function Industries() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/industries').then((r) => setItems(r.data)).catch(() => {}); }, []);
  useReveal([items]);

  return (
    <>
      <PageHeader title="Industries We Serve" image="/img/banner2.jpg"
        subtitle="Our chemicals support manufacturing across more than twenty industrial sectors."
        crumbs={[{ label: 'Industries' }]} />

      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Applications</span>
            <h2 className="section-title">A broad spectrum of <span className="serif">industries</span></h2>
            <p className="section-intro">From plastics and rubber to pharmaceuticals, cosmetics and construction — Virava Chemicals is a trusted supply partner.</p>
          </div>

          <div className="ind-full-grid">
            {items.map((ind) => (
              <div className="ind-card reveal" key={ind.id}>
                <img src={ind.image_url} alt={ind.name} />
                <div className="ind-overlay"><h4>{ind.name}</h4></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
