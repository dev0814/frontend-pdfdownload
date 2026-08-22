function DocumentCard({ pdf, onDownload, onGenerateQR }) {
  return (
    <div className="document-card">
      <div className="document-icon">
        <span>📘</span>
      </div>
      <h3 className="document-title">{pdf.name}</h3>
      <p className="document-description">{pdf.description}</p>
      <div className="card-actions">
        {/* <button
          type="button"
          className="btn btn-primary btn-download"
          onClick={() => onDownload(pdf)}
        >
          <span>⬇</span> Download PDF
        </button> */}
        <button
          type="button"
          className="btn btn-secondary btn-qr"
          onClick={() => onGenerateQR(pdf)}
        >
          <span>🔲</span> Generate QR Code
        </button>
      </div>
    </div>
  );
}

export default DocumentCard;
