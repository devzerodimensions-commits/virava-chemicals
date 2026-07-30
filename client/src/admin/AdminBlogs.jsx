import CrudManager from './CrudManager.jsx';

export default function AdminBlogs() {
  return (
    <CrudManager
      title="Blogs"
      subtitle="Articles shown in the 'Latest Insights' section on the home page."
      resource="blogs"
      defaults={{ is_active: true, sort_order: 0, author: 'Virava Team' }}
      columns={[
        { key: 'image_url', label: 'Image', render: (i) => i.image_url
            ? <img src={i.image_url} className="cell-thumb" alt="" /> : '—' },
        { key: 'title', label: 'Title', render: (i) => <strong>{i.title}</strong> },
        { key: 'category', label: 'Category' },
        { key: 'is_active', label: 'Active', render: (i) => i.is_active ? '✅' : '—' },
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true, full: true },
        { key: 'slug', label: 'Slug (unique)', required: true },
        { key: 'category', label: 'Category' },
        { key: 'author', label: 'Author' },
        { key: 'published_at', label: 'Published Date', type: 'date' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'excerpt', label: 'Excerpt (shown on card)', type: 'textarea', full: true },
        { key: 'content', label: 'Full Content', type: 'textarea', rows: 5, full: true },
        { key: 'image_url', label: 'Image', type: 'image', full: true },
        { key: 'is_active', label: 'Status', type: 'checkbox', full: true },
      ]}
    />
  );
}
