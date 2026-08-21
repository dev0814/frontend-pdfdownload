function DocumentCard({ pdf, onDownload }) {
  return (
    <div className="document-card">
      <div className="document-icon">
        <span>📘</span>
      </div>
      <h3 className="document-title">{pdf.name}</h3>
      <p className="document-description">{pdf.description}</p>
      <button
        type="button"
        className="btn btn-primary btn-download"
        onClick={() => onDownload(pdf)}
      >
        <span>⬇</span> Download PDF
      </button>
    </div>
  );
}

export default DocumentCard;
