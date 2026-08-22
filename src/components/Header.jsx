function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-icon"><a href= "https://effortsconsulting.com/"><img src="/logo-new-1.jpg" alt="Logo" /></a></span>
          {/* <span className="logo-text">Efforts Consulting</span> */}

          <span className="logo-text"><a href= "https://effortsconsulting.com/">Efforts Consulting</a></span>
          
        </div>
        {/* <nav className="nav">
          <a href="#resources">Resources</a>
        </nav> */}
      </div>
    </header>
  );
}

export default Header;
