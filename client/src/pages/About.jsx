import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import { useSettings } from '../components/PublicLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Counter from '../components/Counter.jsx';
import './pages.css';

export default function About() {
  const settings = useSettings();
  const [principals, setPrincipals] = useState([]);
  useEffect(() => { api.get('/principals').then((r) => setPrincipals(r.data)).catch(() => {}); }, []);
  useReveal([principals]);

  const values = [
    ['Quality', 'Products from the country\'s most reputed and certified manufacturers.'],
    ['Transparency', 'Honest, transparent dealings with customers and principals alike.'],
    ['Reliability', 'Consistent, on-time supply built on five decades of experience.'],
    ['Partnership', 'Long-term relationships that grow with our customers\' businesses.'],
  ];

  return (
    <>
      <PageHeader title="About Virava Chemicals" image="/img/banner3.jpg"
        subtitle="A trusted agency house serving the industrial world of India for over five decades."
        crumbs={[{ label: 'About Us' }]} />

      {/* Company profile */}
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
            <span className="eyebrow">Company Profile</span>
            <h2 className="section-title">Determined with direction since <span className="serif">three generations</span></h2>
            <p>Virava Chemicals is a closely held partnership firm established and run by {settings.founder || 'Mr. Siddharth S. Shah'}, a science graduate with vast experience in marketing, trading and agency business spanning 50 years.</p>
            <p>{settings.about_full ||
              'We are an agency house serving the industrial world with quality products from reputed manufacturers for more than five decades. We are a valued business partner of Godrej Industries Ltd, a leader in oleo chemicals.'}</p>
            <p>Formed in {settings.established || '1997'}, the main activity of the concern is trading of goods manufactured by Godrej Industries Limited, HPL Additives Limited, Oriental Carbon &amp; Chemicals Limited and The Standard Chemicals Co. Pvt. Ltd.</p>
            <Link to="/contact" className="btn btn-navy">Get in Touch <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* Mission / Why */}
      <section className="section section-soft">
        <div className="container mv-grid">
          <div className="mv-card reveal">
            <span className="mv-ic">🎯</span>
            <h3>Our Mission</h3>
            <p>To be the most trusted partner for industrial chemicals in India — delivering quality products, technical support and dependable service that help our customers succeed.</p>
          </div>
          <div className="mv-card reveal">
            <span className="mv-ic">💡</span>
            <h3>Why Virava Chemicals</h3>
            <ul className="tick-list">
              <li>Exclusive distributor of Godrej oleo chemicals</li>
              <li>Five decades of industry experience</li>
              <li>Wide, quality-assured product portfolio</li>
              <li>Strong logistics & timely supply</li>
              <li>3000+ satisfied customers</li>
            </ul>
          </div>
          <div className="mv-card reveal">
            <span className="mv-ic">🏢</span>
            <h3>Infrastructure</h3>
            <p>Backed by well-established warehousing, a strong distribution network and experienced staff, Virava ensures efficient handling and prompt delivery of chemicals across industries.</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">What Drives Us</span>
            <h2 className="section-title">Our core <span className="serif">values</span></h2>
          </div>
          <div className="values-grid">
            {values.map(([t, d], i) => (
              <div className="value-card reveal" key={t}>
                <span className="value-num">0{i + 1}</span>
                <h4>{t}</h4>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principals */}
      <section className="section principals-sec">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow" style={{ color: '#ffb3b6' }}>Our Principals</span>
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
