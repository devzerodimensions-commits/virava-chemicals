import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroSlider.css';

/* Self-created molecule artwork (no external images), varied per slide */
function Molecule({ i }) {
  const cx = 250, cy = 250, R = 120;
  const rot = (i * 26) * Math.PI / 180;
  const ring = Array.from({ length: 6 }, (_, k) => {
    const a = rot + k * Math.PI / 3;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  const branchNodes = [0, 2, 4].slice(0, 2 + (i % 2));
  const branches = branchNodes.map((k) => {
    const a = rot + k * Math.PI / 3;
    return { from: k, x: cx + (R + 80) * Math.cos(a), y: cy + (R + 80) * Math.sin(a) };
  });
  return (
    <svg className="hero-molecule" viewBox="0 0 500 500" aria-hidden="true">
      {ring.map((n, k) => {
        const m = ring[(k + 1) % 6];
        return <line key={`r${k}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y} className="hero-bond" />;
      })}
      {branches.map((b, k) => (
        <line key={`b${k}`} x1={ring[b.from].x} y1={ring[b.from].y} x2={b.x} y2={b.y} className="hero-bond" />
      ))}
      {branches.map((b, k) => <circle key={`ba${k}`} cx={b.x} cy={b.y} r="11" className="hero-atom" />)}
      {ring.map((n, k) => <circle key={`a${k}`} cx={n.x} cy={n.y} r="15" className="hero-atom" />)}
      <circle cx={ring[0].x} cy={ring[0].y} r="17" className="hero-atom-accent" />
    </svg>
  );
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
    <section className="hero">
      <video className="hero-video" autoPlay muted loop playsInline preload="auto" poster="/img/banner3.jpg">
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />

      {cur && <Molecule i={active} />}

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
