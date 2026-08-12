import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroSlider.css';

// Map each principal to its created banner image (robust to reordering).
function bannerFor(name = '') {
  const n = name.toLowerCase();
  if (n.includes('godrej')) return '/img/slides/godrej.jpg';
  if (n.includes('hpl')) return '/img/slides/hpl.jpg';
  if (n.includes('oriental') || n.includes('occl')) return '/img/slides/occl.jpg';
  if (n.includes('standard')) return '/img/slides/standard.jpg';
  return '/img/slides/godrej.jpg';
}

export default function HeroSlider({ items = [] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % items.length), 5500);
    return () => clearInterval(t);
  }, [items]);

  const go = (n) => setActive((n + items.length) % items.length);
  const cur = items[active];

  return (
    <section className="hero hero-slider">
      {items.map((p, i) => (
        <div
          key={p.id}
          className={`hero-bg ${i === active ? 'on' : ''}`}
          style={{ backgroundImage: `url(${bannerFor(p.name)})` }}
        />
      ))}
      <div className="hero-overlay" />

      <div className="container hero-content">
        <div className="hero-text" key={active}>
          <span className="eyebrow" style={{ color: '#cccccc' }}>
            Exclusive Distributor · 0{active + 1} / 0{items.length || 4}
          </span>
          <h1>{cur ? cur.name : 'Your Trusted Partner in Industrial Chemicals'}</h1>
          <p>{cur ? cur.description : 'Exclusive distributors of quality oleo & specialty chemicals for 20+ industries across India.'}</p>
          <div className="hero-btns">
            <Link to="/products" className="btn btn-primary">View Products <span>→</span></Link>
            <Link to="/contact" className="btn btn-ghost-light">Contact Us</Link>
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button className="hero-arrow prev" onClick={() => go(active - 1)} aria-label="Previous">‹</button>
          <button className="hero-arrow next" onClick={() => go(active + 1)} aria-label="Next">›</button>
          <div className="hero-dots">
            {items.map((_, i) => (
              <button key={i} className={i === active ? 'on' : ''} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
