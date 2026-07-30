import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import PageHeader from '../components/PageHeader.jsx';
import './pages.css';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [others, setOthers] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setBlog(null); setNotFound(false);
    api.get(`/blogs/${slug}`).then((r) => setBlog(r.data)).catch(() => setNotFound(true));
    api.get('/blogs').then((r) => setOthers(r.data)).catch(() => {});
  }, [slug]);

  useReveal([blog]);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (notFound) return (
    <div className="container section center">
      <h2>Article not found</h2>
      <Link to="/" className="btn btn-navy">Back to Home</Link>
    </div>
  );
  if (!blog) return <div className="container section center"><p>Loading…</p></div>;

  const paragraphs = (blog.content || '').split(/\n{2,}|\n/).filter(Boolean);
  const related = others.filter((b) => b.slug !== blog.slug).slice(0, 3);

  return (
    <>
      <PageHeader title={blog.title} image={blog.image_url || '/img/banner3.jpg'}
        subtitle={blog.category} crumbs={[{ label: 'Insights' }, { label: blog.title }]} />

      <section className="section">
        <div className="container blog-detail">
          <div className="blog-detail-meta">
            {blog.category && <span className="bd-cat">{blog.category}</span>}
            <span>📅 {fmtDate(blog.published_at)}</span>
            {blog.author && <span>✍ {blog.author}</span>}
          </div>

          {blog.image_url && (
            <div className="blog-detail-hero reveal"><img src={blog.image_url} alt={blog.title} /></div>
          )}

          <div className="blog-detail-body reveal">
            {blog.excerpt && <p className="blog-detail-lead">{blog.excerpt}</p>}
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className="blog-detail-cta reveal">
            <p>Have a question about our products? Our team is happy to help.</p>
            <Link to="/contact" className="btn btn-primary">Contact Us <span>→</span></Link>
          </div>

          <Link to="/" className="blog-back">← Back to Home</Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section-soft">
          <div className="container">
            <div className="center reveal">
              <span className="eyebrow">Keep Reading</span>
              <h2 className="section-title">More <span className="serif">insights</span></h2>
            </div>
            <div className="blog-grid">
              {related.map((b) => (
                <Link to={`/blog/${b.slug}`} className="blog-card reveal" key={b.id}>
                  <div className="blog-img">
                    <img src={b.image_url} alt={b.title} />
                    {b.category && <span className="blog-tag">{b.category}</span>}
                  </div>
                  <div className="blog-body">
                    <div className="blog-meta"><span>📅 {fmtDate(b.published_at)}</span></div>
                    <h3>{b.title}</h3>
                    <p>{b.excerpt}</p>
                    <span className="cat-link">Read More →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
