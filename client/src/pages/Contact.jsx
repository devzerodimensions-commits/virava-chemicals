import { useState } from 'react';
import api from '../api.js';
import { useSettings } from '../components/PublicLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import './pages.css';

export default function Contact() {
  const settings = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/enquiries', form);
      setStatus('done');
      setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch { setStatus('error'); }
  };

  return (
    <>
      <PageHeader title="Contact Us" image="/img/banner4.jpg"
        subtitle="Reach out for product enquiries, specifications, samples and bulk supply."
        crumbs={[{ label: 'Contact' }]} />

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <span className="eyebrow">Get in Touch</span>
            <h2 className="section-title">Let's talk <span className="serif">business</span></h2>
            <p className="section-intro" style={{ marginBottom: 30 }}>
              Our team is ready to assist you with the right chemical solutions for your industry.
            </p>

            <div className="contact-item">
              <span className="ci-ic">📍</span>
              <div><strong>Office Address</strong><p>{settings.address ||
                "402 'Arista' - The Business Hub, Above Pantaloons, Nr. Madhur Hall, Anand Nagar Road, Satellite, Ahmedabad - 380015"}</p></div>
            </div>
            <div className="contact-item">
              <span className="ci-ic">✆</span>
              <div><strong>Phone</strong><p>{settings.phone1 || '+91-079-29708697'}<br />{settings.phone2 || '+91-079-29708688'}</p></div>
            </div>
            <div className="contact-item">
              <span className="ci-ic">✉</span>
              <div><strong>Email</strong><p><a href={`mailto:${settings.email || 'viravachemicals@gmail.com'}`}>{settings.email || 'viravachemicals@gmail.com'}</a></p></div>
            </div>
          </div>

          <div className="contact-form-card">
            <h3>Send us an enquiry</h3>
            {status === 'done' ? (
              <div className="modal-done">
                <span className="modal-check">✓</span>
                <h3>Thank you!</h3>
                <p>Your enquiry has been received. We'll get back to you shortly.</p>
                <button className="btn btn-navy" onClick={() => setStatus('')}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="contact-form">
                <div className="cf-row">
                  <input required placeholder="Your Name *" value={form.name} onChange={set('name')} />
                  <input required type="email" placeholder="Email *" value={form.email} onChange={set('email')} />
                </div>
                <div className="cf-row">
                  <input placeholder="Phone" value={form.phone} onChange={set('phone')} />
                  <input placeholder="Company" value={form.company} onChange={set('company')} />
                </div>
                <input placeholder="Subject" value={form.subject} onChange={set('subject')} />
                <textarea required rows="5" placeholder="Your Message *" value={form.message} onChange={set('message')} />
                {status === 'error' && <p className="modal-err">Something went wrong. Please try again.</p>}
                <button className="btn btn-primary" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send Enquiry'} <span>→</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {settings.map_embed && (
          <div className="container" style={{ marginTop: 60 }}>
            <div className="map-wrap">
              <iframe title="Virava Chemicals location" src={settings.map_embed}
                width="100%" height="380" style={{ border: 0 }} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
