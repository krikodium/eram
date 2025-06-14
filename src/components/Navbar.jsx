// ✅ src/components/Navbar.jsx (menú hamburguesa rediseñado y responsivo)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          ERAM
        </Link>

        {/* Botón hamburguesa */}
        <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          {menuOpen ? (
            <span className="close-icon">×</span>
          ) : (
            <>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </>
          )}
        </div>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/quienes-somos" className="nav-link" onClick={closeMenu}>Quiénes Somos</Link>
          <Link to="/ferias" className="nav-link" onClick={closeMenu}>Ferias</Link>
          <Link to="/catalogo" className="nav-link" onClick={closeMenu}>Catálogo</Link>
          <Link to="/contacto" className="nav-link btn btn-primary" onClick={closeMenu}>Contacto</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;