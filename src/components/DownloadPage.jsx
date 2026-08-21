
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import DownloadForm from './DownloadForm';
import { fetchPdfById, submitDownload } from '../services/api';

function triggerBlobDownload(blob, filename) {
  try {
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename.endsWith('.pdf')
      ? filename
      : `${filename}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the temporary object URL
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);
  } catch (err) {
    console.error('PDF download failed:', err);
    throw new Error('Failed to download PDF. Please try again.');
  }
}

function DownloadPage() {
  const { pdfId } = useParams();
  const [pdf, setPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function loadPdf() {
      if (!pdfId) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError('');
      setNotFound(false);

      try {
        const decodedId = decodeURIComponent(pdfId);
        const data = await fetchPdfById(decodedId);
        setPdf(data);
      } catch (err) {
        if (err.message && err.message.includes('not found')) {
          setNotFound(true);
        } else {
          setLoadError(err.message || 'Failed to load PDF.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPdf();
  }, [pdfId]);

  async function handleFormSubmit(formData) {
    if (!pdf) return;

    setIsSubmitting(true);
    setSubmitError('');
    setSuccessMessage('');

    try {
      const payload = {
        pdfId: pdf.id,
        ...formData
      };

      // Backend now returns the actual PDF Blob,
      // not a Google Drive URL.
      const result = await submitDownload(payload);

      if (!result || !result.blob) {
        throw new Error('PDF data was not received from the server.');
      }

      setSuccessMessage(
        'Your details have been saved. Your download is starting...'
      );

      // Give the success message a moment to appear
      setTimeout(() => {
        try {
          triggerBlobDownload(
            result.blob,
            result.filename || pdf.name
          );
        } catch (err) {
          setSubmitError(
            err.message || 'Failed to download PDF. Please try again.'
          );
        }
      }, 400);
    } catch (err) {
      setSubmitError(
        err.message || 'Submission failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app">
      <Header />

      <main className="main">
        <section className="download-page">
          <div className="download-page-inner">
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner spinner-large"></div>
                <p>Loading PDF information...</p>
              </div>
            ) : notFound ? (
              <div className="error-state download-not-found">
                <div className="not-found-icon">📭</div>

                <h2 className="not-found-title">
                  PDF Not Found
                </h2>

                <p className="not-found-message">
                  The requested PDF could not be found.
                </p>

                <Link to="/" className="btn btn-primary">
                  Return to PDF Listing
                </Link>
              </div>
            ) : loadError ? (
              <div className="error-state">
                <div className="alert alert-error">
                  {loadError}
                </div>

                <Link to="/" className="btn btn-primary">
                  Return to PDF Listing
                </Link>
              </div>
            ) : pdf ? (
              <div className="download-content">
                <div className="download-pdf-info">
                  <div className="document-icon document-icon-large">
                    <span>📘</span>
                  </div>

                  <h1 className="download-pdf-title">
                    {pdf.name}
                  </h1>

                  <p className="download-pdf-description">
                    {pdf.description}
                  </p>
                </div>

                <div className="download-form-container">
                  <h3 className="download-form-heading">
                    Request your download
                  </h3>

                  <p className="download-form-subheading">
                    Please share your details to download the PDF instantly.
                  </p>

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
                        onClick={() => window.location.reload()}
                      >
                        Refresh Page
                      </button>
                    </div>
                  ) : (
                    <DownloadForm
                      onSubmit={handleFormSubmit}
                      isLoading={isSubmitting}
                      generalError={submitError}
                    />
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default DownloadPage;



// import { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import Header from './Header';
// import Footer from './Footer';
// import DownloadForm from './DownloadForm';
// import { fetchPdfById, submitDownload } from '../services/api';

// function triggerDownload(url, filename) {
//   try {
//     const link = document.createElement('a');
//     link.href = url;
//     link.target = '_blank';
//     link.rel = 'noopener noreferrer';
//     if (filename) {
//       link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
//     }
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   } catch (err) {
//     console.warn('Auto-download trigger failed, opening in new tab:', err);
//     window.open(url, '_blank', 'noopener,noreferrer');
//   }
// }

// function DownloadPage() {
//   const { pdfId } = useParams();
//   const [pdf, setPdf] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState('');
//   const [notFound, setNotFound] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     async function loadPdf() {
//       if (!pdfId) {
//         setNotFound(true);
//         setIsLoading(false);
//         return;
//       }
//       setIsLoading(true);
//       setLoadError('');
//       setNotFound(false);
//       try {
//         const decodedId = decodeURIComponent(pdfId);
//         const data = await fetchPdfById(decodedId);
//         setPdf(data);
//       } catch (err) {
//         if (err.message && err.message.includes('not found')) {
//           setNotFound(true);
//         } else {
//           setLoadError(err.message || 'Failed to load PDF.');
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     loadPdf();
//   }, [pdfId]);

//   async function handleFormSubmit(formData) {
//     if (!pdf) return;
//     setIsSubmitting(true);
//     setSubmitError('');
//     setSuccessMessage('');

//     try {
//       const payload = { pdfId: pdf.id, ...formData };
//       const result = await submitDownload(payload);

//       if (result && result.downloadUrl) {
//         setSuccessMessage(
//           result.message ||
//             'Your details have been saved. Starting download...'
//         );
//         setTimeout(() => {
//           triggerDownload(result.downloadUrl, result.pdfName || pdf.name);
//         }, 400);
//       } else {
//         setSubmitError('Unexpected response from server. Please try again.');
//       }
//     } catch (err) {
//       setSubmitError(err.message || 'Submission failed. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <div className="app">
//       <Header />

//       <main className="main">
//         <section className="download-page">
//           <div className="download-page-inner">
//             {/* <Link to="/" className="back-link">
//               ← Back to PDF listing
//             </Link> */}

//             {isLoading ? (
//               <div className="loading-state">
//                 <div className="spinner spinner-large"></div>
//                 <p>Loading PDF information...</p>
//               </div>
//             ) : notFound ? (
//               <div className="error-state download-not-found">
//                 <div className="not-found-icon">📭</div>
//                 <h2 className="not-found-title">PDF Not Found</h2>
//                 <p className="not-found-message">
//                   The requested PDF could not be found.
//                 </p>
//                 <Link to="/" className="btn btn-primary">
//                   Return to PDF Listing
//                 </Link>
//               </div>
//             ) : loadError ? (
//               <div className="error-state">
//                 <div className="alert alert-error">{loadError}</div>
//                 <Link to="/" className="btn btn-primary">
//                   Return to PDF Listing
//                 </Link>
//               </div>
//             ) : pdf ? (
//               <div className="download-content">
//                 <div className="download-pdf-info">
//                   <div className="document-icon document-icon-large">
//                     <span>📘</span>
//                   </div>
//                   <h1 className="download-pdf-title">{pdf.name}</h1>
//                   <p className="download-pdf-description">{pdf.description}</p>
//                 </div>

//                 <div className="download-form-container">
//                   <h3 className="download-form-heading">
//                     Request your download
//                   </h3>
//                   <p className="download-form-subheading">
//                     Please share your details to download the PDF instantly.
//                   </p>

//                   {successMessage ? (
//                     <div className="success-box">
//                       <div className="success-icon">✅</div>
//                       <h3>Thank you!</h3>
//                       <p>{successMessage}</p>
//                       <p className="success-hint">
//                         Your download should begin automatically.
//                       </p>
//                       {/* <Link to="/" className="btn btn-primary">
//                         Back to Listing
//                       </Link> */}

//                       <button
//                         type="button"
//                         className="btn btn-primary"
//                         onClick={() => window.location.reload()}
//                       >
//                         Refresh Page
//                       </button>

//                     </div>
//                   ) : (
//                     <DownloadForm
//                       onSubmit={handleFormSubmit}
//                       isLoading={isSubmitting}
//                       generalError={submitError}
//                     />
//                   )}
//                 </div>
//               </div>
//             ) : null}
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// }

// export default DownloadPage;
