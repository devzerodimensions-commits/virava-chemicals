import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import { useSettings } from '../components/PublicLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Counter from '../components/Counter.jsx';
import './pages.css';

/* Copy on this page comes from the client's own "Virava Chemicals.docx" — their
   mission statement and the five guiding principles are quoted as written, aside
   from a few plain typos (manufactures → manufacturers, not matter → no matter,
   Principles → Principals, which they use to mean the companies they represent). */

const PRINCIPLES = [
  'Reach as many customers as possible to make them aware of our products.',
  'Suggest customers the best chemicals that cater to their need.',
  'Provide the best service, pre and post-sale.',
  'Conduct the business in the most transparent manner with both our customers and our principals.',
  'Do all of the above in the most cost-effective manner.',
];

export default function About() {
  const settings = useSettings();
  const [principals, setPrincipals] = useState([]);
  useEffect(() => { api.get('/principals').then((r) => setPrincipals(r.data)).catch(() => {}); }, []);
  useReveal([principals]);

  const founded = settings.established || '1996';
  const founder = settings.founder || 'Mr. Siddharth Shah';
  const customers = settings.stat_customers || 2500;

  return (
    <>
      <PageHeader title="About Virava Chemicals" image="/img/banner3.jpg"
        subtitle="An agency house serving the industrial world of Gujarat for three generations."
        crumbs={[{ label: 'About Us' }]} />

      {/* Company profile — the origin story, in the client's own account */}
      <section className="section">
        <div className="container about-grid">
          <div className="about-media reveal">
            <img src="/img/about.jpg" alt="Virava Chemicals" />
            <div className="about-badge">
              <Counter end={settings.stat_experience || 50} suffix="+" />
              <span>Years of Trust</span>
            </div>
          </div>
          <div className="about-body reveal">
            <span className="eyebrow">Our Story</span>
            <h2 className="section-title">Built single-handedly, since <span className="serif">{founded}</span></h2>
            <p>
              In {founded}, when the renowned Rollwalla group of Ahmedabad was split, our founder
              {' '}{founder} — a second-generation entrepreneur — decided to take the responsibility
              of running the business of Virava Chemicals on his shoulders single handedly.
            </p>
            <p>
              With persistent hard work, financial discipline and foresight, Virava Chemicals has
              grown its turnover at 30% CAGR. From a very humble beginning of a handful of customers,
              today we cater to and serve over {customers}+ customers in the Gujarat state.
            </p>
            <p>
              The main activity of the concern is trading of goods manufactured by Godrej Industries
              Limited, HPL Additives Limited, Oriental Carbon &amp; Chemicals Limited and
              The Standard Chemicals Co. Pvt. Ltd.
            </p>
            <Link to="/contact" className="btn btn-navy">Get in Touch <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* Mission — quoted from the client's document */}
      <section className="section section-soft">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Our Mission</span>
          </div>
          <blockquote className="mission-quote reveal">
            <p>
              At Virava Chemicals, our mission is to supply the best quality chemicals to the
              manufacturers at very cost-effective and competitive rates. We truly believe that our
              customers, no matter how small, are our backbone, and we want to keep them happy and
              satisfied with the best products and quality services in a very transparent manner.
              We want to do this by ensuring reasonable growth of Virava Chemicals and its trusted
              principals.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Guiding principles — the client's five, replacing invented "core values" */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">What Drives Us</span>
            <h2 className="section-title">Our philosophy and <span className="serif">guiding principles</span></h2>
            <p className="section-intro">Simple, and unchanged since the beginning.</p>
          </div>
          <div className="values-grid">
            {PRINCIPLES.map((text, i) => (
              <div className="value-card reveal" key={text}>
                <span className="value-num">0{i + 1}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our people — the employee-retention point from the document */}
      <section className="section section-soft">
        <div className="container mv-grid">
          <div className="mv-card reveal">
            <h3>Our People</h3>
            <p>
              We have immense gratitude not only for our principals and customers, but also for all
              the employees of Virava. We take pride in saying that most of our employees currently
              at Virava have been here since the inception. Virava Chemicals would not have achieved
              this growth without their hard work and dedication.
            </p>
          </div>
          <div className="mv-card reveal">
            <h3>Why Virava Chemicals</h3>
            <ul className="tick-list">
              <li>Exclusive distributor of Godrej oleo chemicals</li>
              <li>Three generations of industry experience</li>
              <li>Wide, quality-assured product portfolio</li>
              <li>Strong logistics &amp; timely supply</li>
              <li>{customers}+ customers across Gujarat</li>
            </ul>
          </div>
          <div className="mv-card reveal">
            <h3>Infrastructure</h3>
            <p>
              Backed by well-established warehousing, a strong distribution network and experienced
              staff, Virava ensures efficient handling and prompt delivery of chemicals across
              industries.
            </p>
          </div>
        </div>
      </section>

      {/* Principals */}
      <section className="section principals-sec">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow" style={{ color: '#cccccc' }}>Our Principals</span>
            <h2 className="section-title" style={{ color: '#fff' }}>Manufacturers we <span className="serif">represent</span></h2>
          </div>
          <div className="principals-grid">
            {principals.map((p) => (
              <div className="principal-card reveal" key={p.id}>
                <div className="principal-logo"><img src={p.logo_url} alt={p.name} /></div>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
