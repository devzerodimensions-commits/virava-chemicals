import CrudManager from './CrudManager.jsx';

export default function AdminFaqs() {
  return (
    <CrudManager
      title="Why Virava"
      subtitle="The expandable Why Virava Chemicals? panel at the bottom of the products page."
      resource="faqs"
      defaults={{ is_active: true, sort_order: 0 }}
      columns={[
        { key: 'question', label: 'Heading', render: (i) => <strong>{i.question}</strong> },
        { key: 'answer', label: 'Answer', render: (i) =>
            (i.answer || '').length > 90 ? `${i.answer.slice(0, 90)}…` : (i.answer || '—') },
        { key: 'is_active', label: 'Active', render: (i) => i.is_active ? '✅' : '—' },
      ]}
      fields={[
        { key: 'question', label: 'Heading', required: true, full: true },
        { key: 'answer', label: 'Answer', type: 'textarea', rows: 5, full: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Status', type: 'checkbox' },
      ]}
    />
  );
}
