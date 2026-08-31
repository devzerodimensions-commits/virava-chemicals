import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import api from '../api.js';
import './Navbar.css';

const productLinks = [
  ['Fatty Alcohols', '/products/fatty-alcohols'],
  ['Fatty Acids', '/products/fatty-acids'],
  ['Surfactants', '/products/surfactants'],
  ['Glycerine', '/products/glycerine'],
  ['Oleo Derivatives', '/products/oleo-derivatives-and-specialty-chemicals'],
  ['HPL Products', '/products/hpl-products'],
  ['OCCL Products', '/products/occl-products'],
  ['STD Products', '/products/std-products'],
];

const GODREJ = '/principals/godrej-industries-limited';

// Fallback until /solutions resolves — the live list comes from the admin panel
const FALLBACK_SOLUTION_LINKS = [
  ['Oleochemicals', 'oleochemicals'],
  ['Surfactants', 'surfactants'],
  ['Specialty Chemicals', 'specialty-chemicals'],
  ['Biotech', 'biotech'],
];

const otherPrincipals = [
  ['HPL Additives Limited', '/principals/hpl-additives-limited', '/img/partners/logo2.png'],
  ['Oriental Carbon & Chemicals', '/principals/oriental-carbon-and-chemicals-limited', '/img/partners/logo3.png'],
  ['The Standard Chemicals Co.', '/principals/the-standard-chemicals-co-pvt-ltd', '/img/partners/logo4.png'],
];

export default function Navbar({ settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [solutionLinks, setSolutionLinks] = useState(FALLBACK_SOLUTION_LINKS);
  const loc = useLocation();

  useEffect(() => {
    api.get('/solutions')
      .then((r) => {
        if (r.data?.length) setSolutionLinks(r.data.map((s) => [s.name, s.slug]));
      })
      .catch(() => {});
  }, []);

  const principalLinks = [
    ['Godrej Industries Limited', `${GODREJ}/${solutionLinks[0]?.[1] || 'oleochemicals'}`,
      '/img/partners/logo1.png',
      solutionLinks.map(([label, slug]) => [label, `${GODREJ}/${slug}`])],
    ...otherPrincipals,
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span><i className="ic">✉</i> {settings?.email || 'viravachemicals@gmail.com'}</span>
          <span className="sep">|</span>
          <span><i className="ic">✆</i> {settings?.phone1 || '+91-079-29708697'}</span>
          <span className="topbar-tag">Trusted Chemical Distributors since {settings?.established || '1996'}</span>
        </div>
      </div>

      <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand" aria-label="Virava Chemicals">
            <img src="/img/mark.png" alt="" className="brand-mark" />
            <span className="brand-lockup">
              <span className="brand-name">Virava</span>
              <span className="brand-tag">CHEMICALS</span>
            </span>
          </Link>

          <button className={`burger ${open ? 'on' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>

          <nav className={`menu ${open ? 'menu-open' : ''}`}>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <div className="has-drop">
              <Link to="/#principals">Principals <span className="caret">▾</span></Link>
              <div className="drop drop-wide">
                {principalLinks.map(([label, to, logo, subs]) => (
                  <div className="drop-row" key={label}>
                    <Link to={to} className="drop-item">
                      <img className="drop-logo" src={logo} alt="" />
                      <span>{label}</span>
                      {subs && <span className="drop-caret">›</span>}
                    </Link>
                    {subs && (
                      <div className="subdrop">
                        {subs.map(([sLabel, sTo]) => (
                          <Link key={sLabel} to={sTo} className="subdrop-item">{sLabel}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <NavLink to="/industries">Industries</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <Link to="/contact" className="btn btn-primary nav-cta">Enquire Now</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
