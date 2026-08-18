import CrudManager from './CrudManager.jsx';

export default function AdminHighlights() {
  return (
    <CrudManager
      title="Highlights"
      subtitle="The four-card strip directly under the hero slider on the home page."
      resource="highlights"
      defaults={{ is_active: true, sort_order: 0, icon: 'awards' }}
      columns={[
        { key: 'icon', label: 'Icon' },
        { key: 'title', label: 'Title', render: (i) => <strong>{i.title}</strong> },
        { key: 'subtitle', label: 'Subtitle' },
        { key: 'is_active', label: 'Active', render: (i) => i.is_active ? '✅' : '—' },
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'icon', label: 'Icon', type: 'select', options: [
          { value: 'awards', label: 'Trophy — awards' },
          { value: 'partner', label: 'Link — partnership' },
          { value: 'industries', label: 'Factory — industries' },
          { value: 'generations', label: 'Hourglass — years / generations' },
        ] },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2, full: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Status', type: 'checkbox' },
      ]}
    />
  );
}
