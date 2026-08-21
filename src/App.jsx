import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DocumentCard from './components/DocumentCard';
import DownloadModal from './components/DownloadModal';
import { fetchPdfs, submitDownload } from './services/api';
import './App.css';

function App() {
  const [pdfs, setPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadPdfs();
  }, []);

  async function loadPdfs() {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await fetchPdfs();
      setPdfs(data || []);
    } catch (err) {
      setLoadError(err.message || 'Failed to load PDFs.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDownloadClick(pdf) {
    setSelectedPdf(pdf);
    setSubmitError('');
    setSuccessMessage('');
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPdf(null);
      setSubmitError('');
      setSuccessMessage('');
    }, 200);
  }

  function triggerDownload(url, filename) {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      if (filename) {
        link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Auto-download trigger failed, opening in new tab:', err);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  async function handleFormSubmit(formData) {
    if (!selectedPdf) return;
    setIsSubmitting(true);
    setSubmitError('');
    setSuccessMessage('');

    try {
      const payload = { pdfId: selectedPdf.id, ...formData };
      const result = await submitDownload(payload);

      if (result && result.downloadUrl) {
        setSuccessMessage(
          result.message ||
            'Your details have been saved. Starting download...'
        );
        setTimeout(() => {
          triggerDownload(result.downloadUrl, result.pdfName || selectedPdf.name);
        }, 400);
      } else {
        setSubmitError('Unexpected response from server. Please try again.');
      }
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app">
      <Header />

      <main className="main">
        <section className="hero-section">
          <div className="hero-inner">
            <h1 className="hero-title">Free PDF Resources</h1>
            <p className="hero-subtitle">
              Download our curated catalogues, whitepapers and case studies.
              Simply share your details and get instant access.
            </p>
          </div>
        </section>

        <section id="resources" className="resources-section">
          <div className="section-header">
            <h2>Available Downloads</h2>
            <p>Click on any card below to request your copy.</p>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner spinner-large"></div>
              <p>Loading resources...</p>
            </div>
          ) : loadError ? (
            <div className="error-state">
              <div className="alert alert-error">{loadError}</div>
              <button className="btn btn-primary" onClick={loadPdfs}>
                Try Again
              </button>
            </div>
          ) : pdfs.length === 0 ? (
            <div className="empty-state">
              <p>No PDFs available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="card-grid">
              {pdfs.map((pdf) => (
                <DocumentCard
                  key={pdf.id}
                  pdf={pdf}
                  onDownload={handleDownloadClick}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <DownloadModal
        isOpen={isModalOpen}
        pdf={selectedPdf}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        error={submitError}
        successMessage={successMessage}
      />
    </div>
  );
}

export default App;
