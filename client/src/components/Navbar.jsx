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

/* Carries the slug rather than a path, because the slug is needed twice: to
   build the menu link and to look up that principal's categories. */
const otherPrincipals = [
  ['HPL Additives Limited', 'hpl-additives-limited', '/img/partners/logo2.png'],
  ['Oriental Carbon & Chemicals', 'oriental-carbon-and-chemicals-limited', '/img/partners/logo3.png'],
  ['The Standard Chemicals Co.', 'the-standard-chemicals-co-pvt-ltd', '/img/partners/logo4.png'],
];

/* Only the parent "Principals" tab opens the product finder. Each principal
   named inside the menu goes to its own page, the same as everywhere else on
   the site — routing those to a filtered product list too skipped past the
   profile, logo and category detail people were looking for. */
const pageFor = (slug) => `/principals/${slug}`;

export default function Navbar({ settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [solutionLinks, setSolutionLinks] = useState(FALLBACK_SOLUTION_LINKS);
  const [principalCats, setPrincipalCats] = useState({});
  const loc = useLocation();

  useEffect(() => {
    api.get('/solutions')
      .then((r) => {
        if (r.data?.length) setSolutionLinks(r.data.map((s) => [s.name, s.slug]));
      })
      .catch(() => {});
  }, []);

  /* Godrej's sub-menu comes from its solutions. The other three had none at all,
     which was fine while they held two or three placeholder products — but HPL
     now has three real categories from the client's sheet and nothing in the
     menu showed them. Built from the API rather than hardcoded, so renaming a
     category in the admin panel updates the menu too. */
  useEffect(() => {
    Promise.all([api.get('/principals'), api.get('/categories')])
      .then(([pr, ct]) => {
        const slugOf = new Map((pr.data || []).map((p) => [p.id, p.slug]));
        const map = {};
        (ct.data || []).forEach((c) => {
          const s = slugOf.get(c.principal_id);
          if (!s) return;
          // the principal's own page, opened on that category's tab — these
          // pointed at the filtered product finder, which took people away from
          // the principal instead of into it
          (map[s] ||= []).push([c.name, `/principals/${s}?cat=${c.slug}`]);
        });
        setPrincipalCats(map);
      })
      .catch(() => {});
  }, []);

  const principalLinks = [
    // the name goes to Godrej's own page; the sub-entries keep their solution pages
    ['Godrej Industries Limited', pageFor('godrej-industries-limited'),
      '/img/partners/logo1.png',
      solutionLinks.map(([label, slug]) => [label, `${GODREJ}/${slug}`])],
    // a sub-menu only earns its place when there is more than one thing in it —
    // OCCL and Standard have a single category each and stay plain links
    ...otherPrincipals.map(([label, slug, logo]) => {
      const subs = principalCats[slug];
      return [label, pageFor(slug), logo, subs && subs.length > 1 ? subs : undefined];
    }),
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Mobile only. On desktop the dropdown opens on hover; inside the drawer it
     was permanently expanded, so the eight principal and solution links sat in
     the list at all times and buried Industries, Contact and the CTA below the
     fold. It now collapses. */
  const [dropOpen, setDropOpen] = useState(false);
  /* Second level: which principal has its solutions showing. Only Godrej has
     any, but this is keyed by label so it holds if another gains them. */
  const [subOpen, setSubOpen] = useState(null);

  useEffect(() => { setOpen(false); setDropOpen(false); setSubOpen(null); }, [loc.pathname]);
  useEffect(() => { if (!open) { setDropOpen(false); setSubOpen(null); } }, [open]);
  useEffect(() => { if (!dropOpen) setSubOpen(null); }, [dropOpen]);

  const isMobile = () => window.matchMedia('(max-width: 992px)').matches;

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
            <div className={`has-drop ${dropOpen ? 'drop-open' : ''}`}>
              {/* In the drawer this is a disclosure, not a link — tapping it there
                  would otherwise navigate away before the list could be read.
                  Desktop behaviour (hover to open, click to go) is untouched. */}
              {/* Was /#principals, which only jumped to a strip on the home page.
                  Opens the full product list now — the finder can be narrowed by
                  principal there, which is what someone clicking this wants. */}
              <Link
                to="/products"
                aria-expanded={dropOpen}
                onClick={(e) => {
                  if (isMobile()) { e.preventDefault(); setDropOpen((v) => !v); }
                }}
              >
                Principals <span className="caret">▾</span>
              </Link>
              <div className="drop drop-wide">
                {principalLinks.map(([label, to, logo, subs]) => (
                  <div className={`drop-row ${subOpen === label ? 'sub-open' : ''}`} key={label}>
                    {/* A principal that has solutions is a second disclosure on
                        mobile: the first tap reveals them rather than leaving the
                        menu. Principals without any stay ordinary links. */}
                    <Link
                      to={to}
                      className="drop-item"
                      aria-expanded={subs ? subOpen === label : undefined}
                      onClick={(e) => {
                        if (subs && isMobile()) {
                          e.preventDefault();
                          setSubOpen((v) => (v === label ? null : label));
                        }
                      }}
                    >
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
