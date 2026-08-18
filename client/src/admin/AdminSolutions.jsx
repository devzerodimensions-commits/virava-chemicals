import CrudManager from './CrudManager.jsx';

export default function AdminSolutions() {
  return (
    <CrudManager
      title="Solutions"
      subtitle="Godrej's product solutions. Each one has its own page, and each appears as a card in the Our Product Range section on the home page."
      resource="solutions"
      defaults={{ is_active: true, sort_order: 0 }}
      columns={[
        { key: 'image_url', label: 'Image', render: (i) => i.image_url
            ? <img src={i.image_url} className="cell-thumb" alt="" /> : '—' },
        { key: 'name', label: 'Name', render: (i) => <strong>{i.name}</strong> },
        { key: 'slug', label: 'Slug' },
        { key: 'portfolio_title', label: 'Portfolio Heading' },
        { key: 'is_active', label: 'Active', render: (i) => i.is_active ? '✅' : '—' },
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'slug', label: 'Slug (used in the page URL)', required: true },
        { key: 'portfolio_title', label: 'Portfolio Heading', full: true },
        { key: 'headline', label: 'Page Headline — wrap a word in *asterisks* to italicise it', type: 'textarea', rows: 2, full: true },
        { key: 'lead', label: 'Lead paragraph (follows "Virava Chemicals supplies…")', type: 'textarea', full: true },
        { key: 'points', label: 'Highlight points — one per line', type: 'textarea', rows: 4, full: true },
        { key: 'blurb', label: 'Short blurb for the home page card', type: 'textarea', rows: 2, full: true },
        { key: 'image_url', label: 'Image', type: 'image', full: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Status', type: 'checkbox' },
      ]}
    />
  );
}
