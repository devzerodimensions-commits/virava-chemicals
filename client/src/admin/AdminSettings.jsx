import { useEffect, useState } from 'react';
import api from '../api.js';
import './admin.css';

const groups = [
  { title: 'Company', fields: [
    ['company_name', 'Company Name'], ['tagline', 'Tagline', 'textarea'],
    ['established', 'Established Year'], ['founder', 'Founder'],
  ]},
  { title: 'About Text', fields: [
    ['about_short', 'Short About (footer)', 'textarea'],
    ['about_full', 'Full About (about page)', 'textarea'],
  ]},
  { title: 'Contact', fields: [
    ['address', 'Address', 'textarea'], ['phone1', 'Phone 1'], ['phone2', 'Phone 2'],
    ['email', 'Email'], ['map_embed', 'Google Map Embed URL'],
  ]},
  { title: 'Statistics', fields: [
    ['stat_experience', 'Years Experience'], ['stat_awards', 'Awards Won'], ['stat_customers', 'Satisfied Customers'],
  ]},
  { title: 'Social Links', fields: [
    ['facebook', 'Facebook URL'], ['linkedin', 'LinkedIn URL'], ['twitter', 'Twitter / X URL'],
  ]},
];

export default function AdminSettings() {
  const [data, setData] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/admin/settings').then((r) => setData(r.data)); }, []);
  const set = (k) => (e) => { setData({ ...data, [k]: e.target.value }); setSaved(false); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await api.put('/admin/settings', data); setSaved(true); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-head">
        <div><h1>Settings</h1><p>Company information shown across the website.</p></div>
        <button className="btn btn-navy" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={save} className="settings-groups">
        {groups.map((g) => (
          <div className="panel" key={g.title}>
            <div className="panel-head"><h2>{g.title}</h2></div>
            <div className="settings-grid">
              {g.fields.map(([key, label, type]) => (
                <div className={`af-field ${type === 'textarea' ? 'af-full' : ''}`} key={key}>
                  <label>{label}</label>
                  {type === 'textarea'
                    ? <textarea rows="3" value={data[key] ?? ''} onChange={set(key)} />
                    : <input value={data[key] ?? ''} onChange={set(key)} />}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="settings-save">
          <button className="btn btn-navy" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
          {saved && <span className="saved-note">✓ All changes saved</span>}
        </div>
      </form>
    </div>
  );
}
