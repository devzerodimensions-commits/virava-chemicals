import './EnquiryModal.css';

export default function ProductModal({ product, categoryName, applications = [], onClose, onEnquire }) {
  const specs = [
    ['CAS Number', product.cas_no],
    ['Grade', product.grade],
    ['Packaging', product.packaging],
    ...Object.entries(product.specs || {}),
  ].filter(([, v]) => v);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {product.image_url && <div className="pm-img"><img src={product.image_url} alt={product.name} /></div>}
        <div className="pm-body">
          {categoryName && <span className="pm-cat">{categoryName}</span>}
          <h2>{product.name}</h2>
          {product.description && <p className="pm-desc">{product.description}</p>}

          {specs.length > 0 && (
            <div className="pm-section">
              <h3>Specifications</h3>
              <table className="pm-specs"><tbody>
                {specs.map(([k, v]) => (
                  <tr key={k}><th>{k}</th><td>{String(v)}</td></tr>
                ))}
              </tbody></table>
            </div>
          )}

          {applications.length > 0 && (
            <div className="pm-section">
              <h3>Applications</h3>
              <div className="pm-apps">{applications.map((a) => <span key={a}>{a}</span>)}</div>
            </div>
          )}

          <button className="btn btn-primary" onClick={() => onEnquire(product)}>
            Enquire about this product <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
