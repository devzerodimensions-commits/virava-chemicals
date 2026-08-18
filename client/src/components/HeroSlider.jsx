import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroSlider.css';

/**
 * Home banner carousel, driven by the Hero Slides section of the admin panel.
 *
 * This used to be handed the principals list and pick a background by matching
 * the principal's name against a hardcoded path — so the image, title, subtitle
 * and button set in the panel had no effect at all. It now renders the slide
 * rows themselves.
 */
const FALLBACK = {
  image_url: '/img/slides/godrej.jpg',
  title: 'Your Trusted Partner in Industrial Chemicals',
  subtitle: 'Exclusive distributors of quality oleo & specialty chemicals for 20+ industries across India.',
  cta_text: 'View Products',
  cta_link: '/products',
};

export default function HeroSlider({ items = [] }) {
  const slides = items.length ? items : [FALLBACK];
  const [active, setActive] = useState(0);

  // a shortened list must not leave `active` pointing past the end
  useEffect(() => { setActive((a) => (a < slides.length ? a : 0)); }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  const go = (n) => setActive((n + slides.length) % slides.length);
  const cur = slides[active] || slides[0];
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="hero hero-slider">
      {slides.map((s, i) => (
        <div
          key={s.id ?? i}
          className={`hero-bg ${i === active ? 'on' : ''}`}
          style={{ backgroundImage: `url(${s.image_url || FALLBACK.image_url})` }}
        />
      ))}
      <div className="hero-overlay" />

      <div className="container hero-content">
        <div className="hero-text" key={active}>
          <span className="eyebrow" style={{ color: '#cccccc' }}>
            Exclusive Distributor · {pad(active + 1)} / {pad(slides.length)}
          </span>
          <h2 className="hero-title">{cur.title || FALLBACK.title}</h2>
          {(cur.subtitle || FALLBACK.subtitle) && <p>{cur.subtitle || FALLBACK.subtitle}</p>}
          <div className="hero-btns">
            <Link to={cur.cta_link || FALLBACK.cta_link} className="btn btn-primary">
              {cur.cta_text || FALLBACK.cta_text} <span>→</span>
            </Link>
            <Link to="/contact" className="btn btn-ghost-light">Contact Us</Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button className="hero-arrow prev" onClick={() => go(active - 1)} aria-label="Previous">‹</button>
          <button className="hero-arrow next" onClick={() => go(active + 1)} aria-label="Next">›</button>
          <div className="hero-dots">
            {slides.map((s, i) => (
              <button key={s.id ?? i} className={i === active ? 'on' : ''}
                onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
