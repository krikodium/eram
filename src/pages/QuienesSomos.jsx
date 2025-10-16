// src/pages/QuienesSomos.jsx - Ultra Professional About Us Page
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UpcomingFairs from '../components/UpcomingFairs';
import PastEvents from '../components/PastEvents';
import { 
  FaShieldAlt, 
  FaIndustry, 
  FaUsers,
  FaGlobeAmericas,
  FaTools,
  FaHandshake
} from 'react-icons/fa';
import './QuienesSomos.css';

// Removed unused constants to prevent reference errors and keep component minimal

function QuienesSomos() {
  const [activeTimeline, setActiveTimeline] = useState(2);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.querySelector('.quienes-somos-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`quienes-somos-section ${isVisible ? 'visible' : ''}`}>
      {/* Introducción de ERAM S.R.L. con fondo de video */}
      <section className="qs-intro-section">
        <div className="intro-video-background">
          <video 
            className="intro-video" 
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="/vids/forklift.mp4" type="video/mp4" />
          </video>
          <div className="intro-video-overlay"></div>
        </div>
        <div className="intro-container">
          <h1 className="intro-title">
            Conocé a
            <span className="title-highlight"> ERAM S.R.L.</span>
          </h1>
          <p className="intro-description">
            Desde 2003, ERAM S.R.L. es líder en la distribución de equipos de protección personal 
            y seguridad industrial en Argentina. Con más de 20 años de experiencia, 
            brindamos soluciones integrales para proteger a los trabajadores en las 
            industrias más exigentes del país. Contamos con certificaciones IRAM y UL, 
            además de licencias de productos a nombre propio de IRAM.
          </p>
        </div>
      </section>

      {/* Ferias participadas (primero) */}
      <section className="qs-past-section">
        <div className="section-content">
          <PastEvents />
        </div>
      </section>

      {/* Ferias por venir (temporalmente oculto) */}
      {/* <section className="qs-upcoming-section">
        <div className="section-content">
          <UpcomingFairs />
        </div>
      </section> */}

      {/* Beneficios */}
      <section className="qs-benefits-section">
        <div className="section-header">
          <h2 className="section-title">
            Beneficios de elegir <span className="title-highlight">ERAM S.R.L.</span>
          </h2>
          <p className="section-description">Por qué somos la mejor opción para tu empresa</p>
        </div>
        <div className="values-grid">
          {[
            { icon: <FaShieldAlt />, title: 'Protección Garantizada', desc: 'Equipos confiables para seguridad real en campo.' },
            { icon: <FaTools />, title: 'Asesoramiento Técnico', desc: 'Acompañamiento experto antes y después de la compra.' },
            { icon: <FaIndustry />, title: 'Soluciones Integrales', desc: 'Cobertura para múltiples industrias y necesidades.' },
            { icon: <FaUsers />, title: 'Atención Personalizada', desc: 'Relaciones de largo plazo con foco en tu operación.' },
          ].map((b, i) => (
            <div key={i} className="value-card" style={{ '--value-color': '#D32F2F' }}>
              <div className="value-header">
                <div className="value-icon">{b.icon}</div>
                <h4 className="value-title">{b.title}</h4>
              </div>
              <p className="value-description">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default QuienesSomos;
