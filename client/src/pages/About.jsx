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

/* Quoted verbatim from the client's document — wording, punctuation and all.
   Earlier these were lightly reworded, which is not ours to do. */
const PRINCIPLES = [
  'Reach as many customers as possible to make them aware of our products',
  'Suggest customers with the best chemicals that caters to their need.',
  'Provide best service (pre and post-sale)',
  'Conduct the business in the most transparent manner with both our customers and our principles.',
  'Do all of the above in the most cost-effective manner.',
];

/* Client-provided photographs with their captions, quoted as supplied. The 1985
   Fatty Alcohol Meet archive set first, then the recent ones, in date order. */
const LEGACY_PHOTOS = [
  { src: '/img/about/founder-1.webp',
    caption: 'Mr. Siddharth Shah giving a presentation at the Fatty Alcohol Meet in the year 1985. Mr. Adi Godrej (centre), Mr. Eipe (left) and Mr. Pinto (second from right) graced the occasion with their presence.' },
  { src: '/img/about/founder-2.webp',
    caption: 'Mr. Siddharth Shah (right) and Mr. Ashok Shah (left) receiving Mr. Adi Godrej for the Fatty Alcohols Meet in the year 1985.' },
  { src: '/img/about/founder-3.webp',
    caption: 'Mr. Siddharth Shah giving his respects to Mr. S. P. Godrej (Indian industrialist and a member of the Godrej family).' },
  { src: '/img/about/founder-4.webp',
    caption: 'Mr. Adi Godrej speaking at the occasion of the Fatty Alcohol Meet in Ahmedabad, 1985.' },
  /* portrait: this one is 960x1280, so its crop window is nudged upward to keep
     both faces and the award in frame — see .legacy-img.is-portrait. */
  { src: '/img/about/godrej-visit-1.webp', portrait: true,
    caption: 'Mr Vishal Sharma (Current CEO of Godrej Chemicals) at Virava Chemicals office in Ahmedabad.' },
  { src: '/img/about/godrej-visit-2.webp',
    caption: 'Mr Vishal Sharma (CEO of Godrej Chemicals) along with the Virava Chemicals Family' },
  { src: '/img/about/godrej-visit-3.webp',
    caption: 'Virava Chemicals receiving best performance award (Silver) from Godrej Industries for the year 2025-26.' },
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
              In 1996, when the renowned Rollwalla group of Ahmedabad was split, our founder
              Mr. Siddharth Shah (2nd generation entrepreneur) decided to take the responsibility of
              running the business of Virava Chemicals on his shoulders single handedly. With this
              persistent hard work, financial discipline and foresight Virava chemicals has grown its
              turnover at 30% CAGR. From a very humble beginning of handful of customers today we
              cater and serve over 2500+ customers in the Gujarat state.
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

      {/* Legacy — client-provided photos: the 1985 archive set plus recent ones */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Our Legacy</span>
            <h2 className="section-title">Moments from our <span className="serif">journey</span></h2>
            <p className="section-intro">From the Fatty Alcohol Meet of 1985 to the present day — reflecting Virava's long-standing association with Godrej Industries.</p>
          </div>
          <div className="legacy-grid">
            {LEGACY_PHOTOS.map((p) => (
              <figure className="legacy-card reveal" key={p.src}>
                <div className={p.portrait ? 'legacy-img is-portrait' : 'legacy-img'}><img src={p.src} alt={p.caption} loading="lazy" /></div>
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
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
              “At Virava Chemicals, our mission is to supply best quality chemicals to the
              manufactures at the very cost effective and competitive rates. We truly believe that
              our customers, not matter how small, are our backbone and we want to keep them happy
              and satisfied with the best products and quality services in a very transparent manner.
              We want to do this by ensuring reasonable growth of Virava Chemicals and its trusted
              Principles.”
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
            <p className="section-intro">Our philosophy and guiding principles are simple —</p>
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
              We have immense gratitude not only for our Principles and Customers but also for all
              the employees of Virava. We take pride in saying that most of our employees currently
              at Virava are there since the inception. Virava Chemicals would not have achieved this
              growth without the hard work and dedication of its employees.
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

      {/* Principals — deliberately the same markup and classes as the home page's
          version, so the two sections look identical rather than diverging */}
      <section className="section section-soft principals-sec">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Our Principals</span>
            <h2 className="section-title">Manufacturers we <span className="serif">represent</span></h2>
            <p className="section-intro">The country's most reputed manufacturers whom we proudly represent.</p>
          </div>
          <div className="principals-list">
            {principals.map((p, i) => (
              <Link to={`/principals/${p.slug}`} className="principal-row reveal" key={p.id}>
                <div className="pr-logo"><img src={p.logo_url} alt={p.name} /></div>
                <div className="pr-info">
                  <span className="pr-num">Principal 0{i + 1}</span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <span className="cat-link">View details →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
