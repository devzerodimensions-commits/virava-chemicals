import CrudManager from './CrudManager.jsx';

export default function AdminIndustries() {
  return (
    <CrudManager
      title="Industries"
      subtitle="Industries served, shown on the homepage and industries page."
      resource="industries"
      defaults={{ is_active: true, sort_order: 0 }}
      columns={[
        { key: 'image_url', label: 'Image', render: (i) => i.image_url
            ? <img src={i.image_url} className="cell-thumb" alt="" /> : '—' },
        { key: 'name', label: 'Name', render: (i) => <strong>{i.name}</strong> },
        { key: 'is_active', label: 'Active', render: (i) => i.is_active ? '✅' : '—' },
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'slug', label: 'Slug (unique)', required: true },
        { key: 'description', label: 'Description', type: 'textarea', full: true },
        { key: 'image_url', label: 'Image', type: 'image', full: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Status', type: 'checkbox' },
      ]}
    />
  );
}
