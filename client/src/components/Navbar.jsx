import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
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

export default function Navbar({ settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

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
          <span className="topbar-tag">Trusted Chemical Distributors since {settings?.established || '1997'}</span>
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
              <NavLink to="/products">Products <span className="caret">▾</span></NavLink>
              <div className="drop">
                {productLinks.map(([label, to]) => (
                  <Link key={to} to={to}>{label}</Link>
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
