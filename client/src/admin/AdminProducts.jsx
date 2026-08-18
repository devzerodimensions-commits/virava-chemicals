import CrudManager from './CrudManager.jsx';
import api from '../api.js';

export default function AdminProducts() {
  return (
    <CrudManager
      title="Products"
      subtitle="Manage the chemical products shown under each category."
      resource="products"
      defaults={{ is_active: true, sort_order: 0, specs: {} }}
      loadOptions={async () => {
        const { data } = await api.get('/categories');
        return { category_id: data.map((c) => ({ value: c.id, label: c.name })) };
      }}
      columns={[
        { key: 'name', label: 'Name', render: (i) => <strong>{i.name}</strong> },
        { key: 'category_name', label: 'Category', render: (i) => i.category_name || '—' },
        { key: 'cas_no', label: 'CAS No.' },
        { key: 'grade', label: 'Grade' },
        { key: 'is_active', label: 'Active', render: (i) => i.is_active ? '✅' : '—' },
      ]}
      fields={[
        { key: 'name', label: 'Product Name', required: true, full: true },
        { key: 'slug', label: 'Slug (URL id, unique)', required: true },
        { key: 'category_id', label: 'Category', type: 'select', required: true },
        { key: 'cas_no', label: 'CAS Number' },
        { key: 'grade', label: 'Grade' },
        { key: 'packaging', label: 'Packaging' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'description', label: 'Description', type: 'textarea', full: true },
        { key: 'specs', label: 'Specification rows (shown on the product page)', type: 'keyvalue', full: true,
          hint: 'No extra rows yet — CAS Number, Grade and Packaging above are always shown.',
          suggestions: ['Feature', 'Benefits', 'Typical Properties', 'Application Details', 'INCI Name'] },
        { key: 'image_url', label: 'Image', type: 'image', full: true },
        { key: 'is_active', label: 'Status', type: 'checkbox', full: true },
      ]}
    />
  );
}
