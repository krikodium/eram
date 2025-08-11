// src/components/Navbar.jsx - Enhanced with Fixed Z-Index and Better Mobile Menu
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuote } from '../contexts/QuoteContext';
import ThemeToggle from '../shared/components/ThemeToggle';
import './Navbar.css';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useQuote();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
            ERAM
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Inicio
            </Link>
            <Link 
              to="/catalogo" 
              className={`nav-link ${isActive('/catalogo') ? 'active' : ''}`}
            >
              Catálogo
            </Link>
            <Link 
              to="/quienes-somos" 
              className={`nav-link ${isActive('/quienes-somos') ? 'active' : ''}`}
            >
              Quiénes Somos
            </Link>
            <Link 
              to="/ferias" 
              className={`nav-link ${isActive('/ferias') ? 'active' : ''}`}
            >
              Ferias
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {/* Quote Cart */}
            <Link to="/cotizacion" className="quote-link">
              🛒
              {items.length > 0 && (
                <span className="quote-badge">{items.length}</span>
              )}
            </Link>

            {/* Theme Toggle */}
            <div className="theme-toggle-wrapper">
              <ThemeToggle />
            </div>

            {/* Login/Logout */}
            {user ? (
              <button onClick={handleLogout} className="login-btn">
                Cerrar Sesión
              </button>
            ) : (
              <Link to="/login" className="login-btn">
                Proveedor
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className={`mobile-nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="nav-hamburger"></span>
              <span className="nav-hamburger"></span>
              <span className="nav-hamburger"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`nav-links mobile-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Inicio
        </Link>
        <Link 
          to="/catalogo" 
          className={`nav-link ${isActive('/catalogo') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Catálogo
        </Link>
        <Link 
          to="/quienes-somos" 
          className={`nav-link ${isActive('/quienes-somos') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Quiénes Somos
        </Link>
        <Link 
          to="/ferias" 
          className={`nav-link ${isActive('/ferias') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Ferias
        </Link>

        {/* Mobile Actions */}
        <div className="mobile-actions">
          <Link 
            to="/cotizacion" 
            className="nav-link quote-mobile"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Cotización ({items.length})
          </Link>
          
          {user ? (
            <button onClick={handleLogout} className="nav-link logout-mobile">
              Cerrar Sesión
            </button>
          ) : (
            <Link 
              to="/login" 
              className="nav-link login-mobile"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Área Proveedor
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)} />}
    </>
  );
}

export default Navbar;