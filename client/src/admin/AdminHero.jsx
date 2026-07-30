import CrudManager from './CrudManager.jsx';

export default function AdminHero() {
  return (
    <CrudManager
      title="Hero Slides"
      subtitle="Slides in the homepage banner carousel."
      resource="hero-slides"
      defaults={{ is_active: true, sort_order: 0 }}
      columns={[
        { key: 'image_url', label: 'Image', render: (i) => i.image_url
            ? <img src={i.image_url} className="cell-thumb wide" alt="" /> : '—' },
        { key: 'title', label: 'Title', render: (i) => <strong>{i.title}</strong> },
        { key: 'cta_text', label: 'Button' },
        { key: 'is_active', label: 'Active', render: (i) => i.is_active ? '✅' : '—' },
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true, full: true },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea', full: true },
        { key: 'image_url', label: 'Background Image', type: 'image', full: true },
        { key: 'cta_text', label: 'Button Text' },
        { key: 'cta_link', label: 'Button Link (e.g. /products)' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Status', type: 'checkbox' },
      ]}
    />
  );
}
