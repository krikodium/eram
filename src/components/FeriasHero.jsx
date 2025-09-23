// src/components/FeriasHero.jsx - Optimized Hero Section for Trade Shows
import React from 'react';
import { FaCalendarAlt, FaUsers, FaHandshake } from 'react-icons/fa';
import './FeriasHero.css';

const FeriasHero = () => {
  const stats = [
    { number: "8+", label: "Años Experiencia", icon: <FaCalendarAlt /> },
    { number: "20+", label: "Ferias Participadas", icon: <FaGlobe /> },
    { number: "6K+", label: "Contactos Comerciales", icon: <FaUsers /> },
    
  ];

  return (
    <section className="ferias-hero-section">
      <div className="ferias-hero-background">
        <img 
          src="/ferias/expo-ferretera-buenos-aires-2023-1.jpg" 
          alt="ERAM en Ferias Internacionales" 
          className="hero-bg-image" 
          loading="eager"
        />
        <div className="hero-overlay"></div>
        <div className="hero-pattern"></div>
      </div>
      
      <div className="ferias-hero-content">
        <div className="hero-container">
          <div className="section-badge" data-aos="fade-down" data-aos-delay="200">
            <FaGlobe className="badge-icon" />
            <span>Presencia Nacional e Internacional</span>
          </div>
          
          <h1 className="ferias-hero-title" data-aos="fade-up" data-aos-delay="400">
            Nuestras
            <span className="title-highlight">Ferias</span>
          </h1>
          
          <p className="ferias-hero-subtitle" data-aos="fade-up" data-aos-delay="600">
            Desde 2017 participamos activamente en las ferias más importantes de Argentina y América Latina, 
            compartiendo nuestras innovaciones en seguridad industrial y fortaleciendo vínculos comerciales estratégicos.
          </p>

          <div className="hero-stats" data-aos="fade-up" data-aos-delay="800">
            {stats.map((stat, index) => (
              <div 
                key={`stat-${index}`} 
                className="stat-item"
                data-aos="zoom-in" 
                data-aos-delay={800 + (index * 100)}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="hero-actions" data-aos="fade-up" data-aos-delay="1200">
            <a href="#upcoming-fairs" className="hero-btn primary">
              <FaCalendarAlt />
              <span>Próximas Ferias</span>
            </a>
            <a href="#past-events" className="hero-btn secondary">
              <FaUsers />
              <span>Nuestra Trayectoria</span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-arrow"></div>
        <span>Deslizá para explorar</span>
      </div>
    </section>
  );
};

export default FeriasHero;
