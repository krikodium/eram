// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuote } from '../contexts/QuoteContext';
import ThemeToggle from '../shared/components/ThemeToggle';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useQuote();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const totalQuoteItems = getTotalItems();

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          ERAM
        </Link>

        <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/quienes-somos" className="nav-link" onClick={closeMenu}>Quiénes Somos</NavLink>
          <NavLink to="/ferias" className="nav-link" onClick={closeMenu}>Ferias</NavLink>
          <NavLink to="/catalogo" className="nav-link" onClick={closeMenu}>Catálogo</NavLink>
          
          {/* Quote Cart Icon */}
          <NavLink to="/cotizacion" className="nav-link quote-link" onClick={closeMenu}>
            <FaShoppingCart />
            {totalQuoteItems > 0 && (
              <span className="quote-badge">{totalQuoteItems}</span>
            )}
            <span className="quote-text">Cotización</span>
          </NavLink>
          
          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="auth-section">
              <span className="user-greeting">
                <FaUser /> {user?.name}
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Salir
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="nav-link auth-button" onClick={closeMenu}>
              Área Proveedores
            </NavLink>
          )}
          
          {/* Theme Toggle */}
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;