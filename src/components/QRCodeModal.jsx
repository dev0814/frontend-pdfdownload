import { useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function QRCodeModal({ isOpen, pdf, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isOpen]);

  if (!isOpen || !pdf) return null;

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  const qrValue = `${frontendUrl.replace(/\/$/, '')}/download/${encodeURIComponent(pdf.id)}`;

  function handleDownloadQR() {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pdf.id.replace(/[^a-zA-Z0-9_-]/g, '_') || 'qrcode'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal qr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="qr-modal-title" className="modal-title">
              QR Code: {pdf.name}
            </h2>
            <p className="modal-subtitle">
              Scan this QR code to open the download page on any device.
            </p>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className="modal-body qr-modal-body">
          <div className="qr-code-wrapper" ref={canvasRef}>
            <QRCodeCanvas
              value={qrValue}
              size={256}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#0f172a"
            />
          </div>

          <div className="qr-url-label">
            <span className="qr-url-label-text">URL:</span>
            <code className="qr-url-value">{qrValue}</code>
          </div>

          <div className="form-actions qr-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDownloadQR}
            >
              <span>⬇</span> Download QR
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodeModal;
