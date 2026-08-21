import { useEffect } from 'react';
import DownloadForm from './DownloadForm';

function DownloadModal({
  isOpen,
  pdf,
  onClose,
  onSubmit,
  isLoading,
  error,
  successMessage
}) {
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape' && !isLoading && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isLoading, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isLoading ? undefined : onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="modal-title" className="modal-title">
              Download: {pdf?.name}
            </h2>
            <p className="modal-subtitle">
              Please share your details to download the PDF instantly.
            </p>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {successMessage ? (
            <div className="success-box">
              <div className="success-icon">✅</div>
              <h3>Thank you!</h3>
              <p>{successMessage}</p>
              <p className="success-hint">
                Your download should begin automatically.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          ) : (
            <DownloadForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              generalError={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DownloadModal;
