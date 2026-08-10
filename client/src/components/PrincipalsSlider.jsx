import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PrincipalsSlider.css';

/* Self-created decorative molecule artwork (no external images).
   Draws a hex ring of atoms + branches, varied per slide index. */
function Molecule({ i }) {
  const cx = 250, cy = 250, R = 118;
  const rot = (i * 26) * Math.PI / 180;
  const ring = Array.from({ length: 6 }, (_, k) => {
    const a = rot + k * Math.PI / 3;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  const branchNodes = [0, 2, 4].slice(0, 2 + (i % 2));
  const branches = branchNodes.map((k) => {
    const a = rot + k * Math.PI / 3;
    return { from: k, x: cx + (R + 78) * Math.cos(a), y: cy + (R + 78) * Math.sin(a) };
  });
  return (
    <svg className="psl-molecule" viewBox="0 0 500 500" aria-hidden="true">
      {ring.map((n, k) => {
        const m = ring[(k + 1) % 6];
        return <line key={`r${k}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y} className="psl-bond" />;
      })}
      {branches.map((b, k) => (
        <line key={`b${k}`} x1={ring[b.from].x} y1={ring[b.from].y} x2={b.x} y2={b.y} className="psl-bond" />
      ))}
      {branches.map((b, k) => <circle key={`ba${k}`} cx={b.x} cy={b.y} r="11" className="psl-atom" />)}
      {ring.map((n, k) => <circle key={`a${k}`} cx={n.x} cy={n.y} r="15" className="psl-atom" />)}
      <circle cx={ring[0].x} cy={ring[0].y} r="17" className="psl-atom-accent" />
    </svg>
  );
}

export default function PrincipalsSlider({ items = [] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items]);

  if (!items.length) return null;
  const go = (n) => setActive((n + items.length) % items.length);

  return (
    <section className="psl-sec">
      <div className="container psl-head">
        <span className="eyebrow" style={{ color: '#cccccc' }}>Our Principals</span>
        <h2 className="section-title" style={{ color: '#fff' }}>
          We are the exclusive <span className="serif">distributors</span> of
        </h2>
      </div>

      <div className="psl">
        {items.map((p, i) => (
          <div key={p.id} className={`psl-slide ${i === active ? 'on' : ''}`}>
            <div className="psl-grid" />
            <Molecule i={i} />
            <div className="container psl-inner">
              <div className="psl-text">
                <span className="psl-count">Principal 0{i + 1} / 0{items.length}</span>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <Link to="/products" className="btn btn-primary">View Products <span>→</span></Link>
              </div>
              <div className="psl-watermark">{(p.name.match(/[A-Z]/g) || []).slice(0, 4).join('')}</div>
            </div>
          </div>
        ))}

        <button className="psl-nav psl-prev" onClick={() => go(active - 1)} aria-label="Previous">‹</button>
        <button className="psl-nav psl-next" onClick={() => go(active + 1)} aria-label="Next">›</button>

        <div className="psl-dots">
          {items.map((_, i) => (
            <button key={i} className={i === active ? 'on' : ''} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
