import CrudManager from './CrudManager.jsx';

export default function AdminPrincipals() {
  return (
    <CrudManager
      title="Principals"
      subtitle="Manufacturers you distribute for (shown on Home & About)."
      resource="principals"
      defaults={{ is_active: true, sort_order: 0 }}
      columns={[
        { key: 'logo_url', label: 'Logo', render: (i) => i.logo_url
            ? <img src={i.logo_url} className="cell-thumb contain" alt="" /> : '—' },
        { key: 'name', label: 'Name', render: (i) => <strong>{i.name}</strong> },
        { key: 'website', label: 'Website' },
        { key: 'is_active', label: 'Active', render: (i) => i.is_active ? '✅' : '—' },
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'slug', label: 'Slug (unique)', required: true },
        { key: 'website', label: 'Website URL' },
        { key: 'description', label: 'Description', type: 'textarea', full: true },
        { key: 'logo_url', label: 'Logo', type: 'image', full: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Status', type: 'checkbox' },
      ]}
    />
  );
}
