import CrudManager from './CrudManager.jsx';
import api from '../api.js';

export default function AdminCategories() {
  return (
    <CrudManager
      title="Categories"
      subtitle="Product categories. The principal decides which principal page a category appears on; the solution decides which Godrej solution page it appears on."
      resource="categories"
      defaults={{ is_active: true, sort_order: 0 }}
      loadOptions={async () => {
        const { data } = await api.get('/principals');
        return { principal_id: data.map((p) => ({ value: p.id, label: p.name })) };
      }}
      columns={[
        { key: 'image_url', label: 'Image', render: (i) => i.image_url
            ? <img src={i.image_url} className="cell-thumb" alt="" /> : '—' },
        { key: 'name', label: 'Name', render: (i) => <strong>{i.name}</strong> },
        { key: 'solution', label: 'Solution', render: (i) => i.solution || '—' },
        { key: 'tagline', label: 'Tagline' },
        { key: 'is_active', label: 'Active', render: (i) => i.is_active ? '✅' : '—' },
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'slug', label: 'Slug (unique)', required: true },
        { key: 'principal_id', label: 'Principal', type: 'select' },
        { key: 'solution', label: 'Godrej Solution', type: 'select', options: [
          { value: 'oleochemicals', label: 'Oleochemicals' },
          { value: 'surfactants', label: 'Surfactants' },
          { value: 'specialty-chemicals', label: 'Specialty Chemicals' },
          { value: 'biotech', label: 'Biotech' },
        ] },
        { key: 'tagline', label: 'Tagline', full: true },
        { key: 'description', label: 'Description', type: 'textarea', full: true },
        { key: 'image_url', label: 'Image', type: 'image', full: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Status', type: 'checkbox' },
      ]}
    />
  );
}
