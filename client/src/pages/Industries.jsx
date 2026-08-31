import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import PageHeader from '../components/PageHeader.jsx';
import './pages.css';

export default function Industries() {
  const [items, setItems] = useState([]);
  // this page is nothing but the grid, so an empty one needs saying out loud
  // rather than leaving the visitor on a blank page
  const [state, setState] = useState('loading'); // loading | ready | failed

  useEffect(() => {
    api.get('/industries')
      .then((r) => { setItems(r.data); setState('ready'); })
      .catch(() => setState('failed'));
  }, []);
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

          {state === 'loading' ? (
            <p className="center">Loading…</p>
          ) : items.length === 0 ? (
            <div className="center">
              <p className="section-intro">
                {state === 'failed'
                  ? 'We could not load the industry list just now. Please try again shortly, or get in touch and we will tell you whether we supply your sector.'
                  : 'The industry list is being updated. Get in touch and we will tell you whether we supply your sector.'}
              </p>
              <Link to="/contact" className="btn btn-primary">Contact Us <span>→</span></Link>
            </div>
          ) : (
            <div className="ind-full-grid">
              {items.map((ind) => (
                <div className="ind-card reveal" key={ind.id}>
                  <img src={ind.image_url} alt={ind.name} />
                  <div className="ind-overlay"><h4>{ind.name}</h4></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
