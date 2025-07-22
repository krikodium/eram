// src/components/HeroCarousel.jsx
import React from 'react';
import './HeroCarousel.css'; // El CSS se mantiene con el mismo nombre

function HeroCarousel() {
  return (
    <header className="hero-section">
      <div className="hero-background"></div>
      <div className="hero-content">
        <div className="hero-text-container">
          <p className="hero-slogan">Desde 1974 apostando a la</p>
          <h1 className="hero-title">INDUSTRIA NACIONAL</h1>
        </div>
      </div>
      <div className="hero-bottom-bar">
        <span className="hero-bar-text">NACIONALES</span>
      </div>
    </header>
  );
}

export default HeroCarousel;