import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../api.js';
import { useReveal } from '../hooks.js';
import PageHeader from '../components/PageHeader.jsx';
import './ProductFinder.css';

const WHY = [
  ['Application depth that helps customers move faster',
   'Five decades in the agency business means we know how these chemicals behave in the field. We help with grade selection, substitutions and troubleshooting across personal care, detergents, rubber, plastics, textiles and lubricants — not just quoting a price.'],
  ['A broad portfolio from reputed manufacturers',
   'As exclusive distributors of Godrej Industries Ltd, and representing HPL Additives, Oriental Carbon & Chemicals and The Standard Chemicals Co., we cover fatty alcohols, fatty acids, surfactants, glycerine, oleo derivatives and specialty additives from one supplier.'],
  ['Reliable supply backed by real warehousing',
   'Established warehousing, a strong distribution network and experienced staff mean consistent, on-time delivery — including bulk quantities and repeat scheduled supply.'],
  ['Quality and transparency across three generations',
   'Products come from certified manufacturers with documentation to match. Honest, transparent dealing with customers and principals alike is what the firm was built on.'],
];

/* /products/:slug used to be its own category page. It is now a pre-filtered
   view of the finder, so the old route redirects rather than 404s — the navbar
   dropdown, footer and home cards all still point at it. */
export function CategoryRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/products?category=${slug}`} replace />;
}

export default function ProductFinder() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [principals, setPrincipals] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const principal = params.get('principal') || '';

  useEffect(() => {
    Promise.all([
      api.get('/products').then((r) => r.data).catch(() => []),
      api.get('/categories').then((r) => r.data).catch(() => []),
      api.get('/principals').then((r) => r.data).catch(() => []),
    ]).then(([p, c, pr]) => {
      setProducts(p); setCats(c); setPrincipals(pr); setLoading(false);
    });
  }, []);

  // products carry their category, and categories carry their principal
  const principalOfCat = useMemo(() => {
    const byId = new Map(principals.map((p) => [p.id, p]));
    return new Map(cats.map((c) => [c.slug, byId.get(c.principal_id) || null]));
  }, [cats, principals]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (category && p.category_slug !== category) return false;
      if (principal && principalOfCat.get(p.category_slug)?.slug !== principal) return false;
      if (!needle) return true;
      return [p.name, p.description, p.cas_no, p.grade, p.category_name]
        .some((v) => (v || '').toLowerCase().includes(needle));
    });
  }, [products, q, category, principal, principalOfCat]);

  useReveal([shown]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  const chips = [
    category && ['category', cats.find((c) => c.slug === category)?.name || category],
    principal && ['principal', principals.find((p) => p.slug === principal)?.name || principal],
    q && ['q', `“${q}”`],
  ].filter(Boolean);

  return (
    <>
      <PageHeader title="Our Products" image="/img/categories/fatty-acids.jpg"
        subtitle="Browse our range by chemistry or principal to match your performance and compliance needs."
        crumbs={[{ label: 'Products' }]} />

      <section className="section pf">
        <div className="container">
          {/* ---------------- filters ---------------- */}
          <div className="pf-filters">
            <div className="pf-search">
              <input
                type="search"
                placeholder="Search products, CAS no. or grade"
                value={q}
                onChange={(e) => setParam('q', e.target.value)}
                aria-label="Search products"
              />
              <span className="pf-search-ic" aria-hidden="true">⌕</span>
            </div>

            <label className="pf-select">
              <span className="pf-select-label">Principal</span>
              <select value={principal} onChange={(e) => setParam('principal', e.target.value)}>
                <option value="">All principals</option>
                {principals.map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
              </select>
            </label>

            <label className="pf-select">
              <span className="pf-select-label">Category</span>
              <select value={category} onChange={(e) => setParam('category', e.target.value)}>
                <option value="">All categories</option>
                {cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
          </div>

          {/* ---------------- active filters ---------------- */}
          <div className="pf-status">
            <div className="pf-status-left">
              <span className="pf-count">
                Showing ({loading ? '…' : shown.length}) Product{shown.length === 1 ? '' : 's'}
                {chips.length > 0 && ' :'}
              </span>
              {chips.map(([key, label]) => (
                <button className="pf-chip" key={key} onClick={() => setParam(key, '')}>
                  {label} <span aria-hidden="true">×</span>
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
            </div>
            {chips.length > 0 && (
              <button className="pf-clear" onClick={() => setParams({}, { replace: true })}>
                Clear All
              </button>
            )}
          </div>

          {/* ---------------- results ---------------- */}
          {loading ? (
            <p className="center">Loading…</p>
          ) : shown.length === 0 ? (
            <div className="pf-empty">
              <h3>No products match those filters</h3>
              <p>Try a different search term, or clear the filters to see the full range.</p>
              <button className="btn btn-navy" onClick={() => setParams({}, { replace: true })}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="pf-grid">
              {shown.map((p) => {
                const pr = principalOfCat.get(p.category_slug);
                return (
                  <Link className="pf-card reveal" to={`/product/${p.slug}`} key={p.id}>
                    <div className="pf-card-img">
                      {p.image_url && <img src={p.image_url} alt={p.name} loading="lazy" />}
                      <div className="pf-card-cap">
                        <h3>{p.name}</h3>
                        <span className="pf-card-arrow">›</span>
                      </div>
                    </div>
                    <span className="pf-card-meta">
                      {[pr?.name, p.category_name].filter(Boolean).join('  |  ')}
                    </span>
                    {p.description && <p className="pf-card-desc">{p.description}</p>}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- why us ---------------- */}
      <section className="section section-soft">
        <div className="container pf-why">
          <div className="pf-why-media reveal">
            <img src="/img/categories/oleo-derivatives.jpg" alt="Virava Chemicals" loading="lazy" />
          </div>
          <div className="pf-why-body reveal">
            <h2 className="pf-why-title">Why Virava Chemicals?</h2>
            {WHY.map(([q2, a]) => (
              <details className="pf-acc" key={q2}>
                <summary>{q2}<span className="pf-acc-ic" aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
