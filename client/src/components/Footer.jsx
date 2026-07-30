import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer({ settings = {} }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <div className="footer-brand">
            <span className="footer-mark"><img src="/img/mark.png" alt="Virava Chemicals" /></span>
            <span className="footer-lockup">
              <span className="footer-name">Virava</span>
              <span className="footer-tag">CHEMICALS</span>
            </span>
          </div>
          <p>{settings.about_short ||
            'Virava Chemicals is an agency house serving the industrial world with quality products from reputed manufacturers for more than five decades.'}</p>
          <div className="footer-socials">
            {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer">f</a>}
            {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noreferrer">in</a>}
            {settings.twitter && <a href={settings.twitter} target="_blank" rel="noreferrer">x</a>}
          </div>
        </div>

        <div className="footer-col">
          <h4>Our Products</h4>
          <ul>
            <li><Link to="/products/fatty-alcohols">Fatty Alcohols</Link></li>
            <li><Link to="/products/fatty-acids">Fatty Acids</Link></li>
            <li><Link to="/products/surfactants">Surfactants</Link></li>
            <li><Link to="/products/glycerine">Glycerine</Link></li>
            <li><Link to="/products/oleo-derivatives-and-specialty-chemicals">Oleo Derivatives</Link></li>
            <li><Link to="/products">All Products</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/about">Our Principals</Link></li>
            <li><Link to="/industries">Industries Served</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Get in Touch</h4>
          <ul className="footer-contact">
            <li><span className="fc-ic">📍</span>{settings.address ||
              "402 'Arista' - The Business Hub, Anand Nagar Road, Satellite, Ahmedabad - 380015"}</li>
            <li><span className="fc-ic">✆</span>{settings.phone1 || '+91-079-29708697'}<br />{settings.phone2}</li>
            <li><span className="fc-ic">✉</span><a href={`mailto:${settings.email || 'viravachemicals@gmail.com'}`}>{settings.email || 'viravachemicals@gmail.com'}</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {year} {settings.company_name || 'Virava Chemicals'}. All rights reserved.</p>
          <p>Exclusive distributors of Godrej oleo chemicals & specialty chemicals.</p>
        </div>
      </div>
    </footer>
  );
}
