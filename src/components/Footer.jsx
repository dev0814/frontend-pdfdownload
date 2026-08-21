function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-section">
          <div className="logo">
            <span className="logo-icon">📄</span>
            <span className="logo-text">PDF Hub</span>
          </div>
          <p className="footer-tagline">
            Download curated resources instantly after sharing your details.
          </p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#resources">PDF Resources</a></li>
            
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>Email: contact@example.com</li>
            <li>Phone: +91 1234567890</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {year} PDF Hub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
