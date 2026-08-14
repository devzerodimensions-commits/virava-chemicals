import { useState } from 'react';
import api from '../api.js';
import './EnquiryModal.css';

// `intent` distinguishes a sample request from a price enquiry — without it both
// buttons on the product page land in the inbox looking identical.
export default function EnquiryModal({ product, category, intent, onClose }) {
  const sample = intent === 'sample';
  const lead = sample ? 'Sample request' : 'Enquiry';
  const subject = product
    ? `${lead}: ${product.name}`
    : category ? `${lead}: ${category}` : 'Product Enquiry';
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    message: product
      ? (sample
          ? `I would like to request a sample of ${product.name}.`
          : `I would like to enquire about ${product.name}.`)
      : '',
  });
  const [status, setStatus] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/enquiries', {
        ...form, subject,
        product_id: product?.id || null,
        product_name: product?.name || category || '',
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {status === 'done' ? (
          <div className="modal-done">
            <span className="modal-check">✓</span>
            <h3>Enquiry Sent!</h3>
            <p>Thank you. Our team will get back to you shortly.</p>
            <button className="btn btn-navy" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h3>{subject}</h3>
            <p className="modal-sub">Fill in your details and we'll respond with specifications and pricing.</p>
            <form onSubmit={submit} className="modal-form">
              <input required placeholder="Your Name *" value={form.name} onChange={set('name')} />
              <input required type="email" placeholder="Email *" value={form.email} onChange={set('email')} />
              <input placeholder="Phone" value={form.phone} onChange={set('phone')} />
              <input placeholder="Company" value={form.company} onChange={set('company')} />
              <textarea required rows="3" placeholder="Message *" value={form.message} onChange={set('message')} />
              {status === 'error' && <p className="modal-err">Something went wrong. Please try again.</p>}
              <button className="btn btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
