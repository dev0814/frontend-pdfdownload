function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-section">
          <div className="logo">
            <span className="logo-icon">📄</span>
            <span className="logo-text">Efforts Consulting</span>
          </div>
          {/* <p className="footer-tagline">
            Download curated resources instantly after sharing your details.
          </p> */}
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            {/* <li><a href="#resources">PDF Resources</a></li> */}
            <li><a href= "https://effortsconsulting.com/">Efforts Consulting</a></li>
            
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>Website: www.effortsconsulting.com</li>
            <li>Email: info@effortsconsulting.com</li>
            <li>Phone: +91 9879391004</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {year} Efforts Consulting. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
