function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          {/* <span className="logo-icon">📄</span> */}
          <span className="logo-text">PDF Hub</span>
        </div>
        <nav className="nav">
          <a href="#resources">Resources</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
