// src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // El estado 'scrolled' es true solo si bajamos más de 10px
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    // La clase cambia dinámicamente: 'navbar' o 'navbar scrolled'
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          {/* <img src={logoEram} alt="Logo ERAM" className="logo-image" /> */}
          {/* Si no tienes imagen, deja el texto ERAM como estaba. El CSS lo ajustará. */}
          ERAM
        </Link>

        <div className={`hamburger-menu ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
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