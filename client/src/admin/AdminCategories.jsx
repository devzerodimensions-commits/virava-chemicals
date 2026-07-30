import CrudManager from './CrudManager.jsx';

export default function AdminCategories() {
  return (
    <CrudManager
      title="Categories"
      subtitle="Product categories shown on the homepage and products page."
      resource="categories"
      defaults={{ is_active: true, sort_order: 0 }}
      columns={[
        { key: 'image_url', label: 'Image', render: (i) => i.image_url
            ? <img src={i.image_url} className="cell-thumb" alt="" /> : '—' },
        { key: 'name', label: 'Name', render: (i) => <strong>{i.name}</strong> },
        { key: 'tagline', label: 'Tagline' },
        { key: 'is_active', label: 'Active', render: (i) => i.is_active ? '✅' : '—' },
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'slug', label: 'Slug (unique)', required: true },
        { key: 'tagline', label: 'Tagline', full: true },
        { key: 'description', label: 'Description', type: 'textarea', full: true },
        { key: 'image_url', label: 'Image', type: 'image', full: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Status', type: 'checkbox' },
      ]}
    />
  );
}
