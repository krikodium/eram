// src/components/CredibilitySection.jsx - Credibility and Trust Section
import React from 'react';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaShieldAlt, 
  FaMapMarkerAlt,
  FaChartLine,
  FaHandshake,
  FaGlobe
} from 'react-icons/fa';
import './CredibilitySection.css';

const credibilityData = [
  {
    icon: <FaCalendarAlt />,
    number: "20+",
    label: "Años de Trayectoria",
    description: "Desde 2003 protegiendo la industria argentina",
    color: "#D32F2F",
    bgColor: "rgba(211, 47, 47, 0.1)"
  },
  {
    icon: <FaUsers />,
    number: "10,000+",
    label: "Clientes Activos",
    description: "Empresas que confían en nuestra experiencia",
    color: "#D32F2F",
    bgColor: "rgba(211, 47, 47, 0.1)"
  },
  
  {
    icon: <FaMapMarkerAlt />,
    number: "24",
    label: "Provincias Alcanzadas",
    description: "Cobertura en todo el territorio nacional",
    color: "#D32F2F",
    bgColor: "rgba(211, 47, 47, 0.1)"
  }
];

const trustIndicators = [
  {
    icon: <FaHandshake />,
    title: "Compromiso Nacional",
    description: "Empresa argentina con valores locales"
  },
  {
    icon: <FaChartLine />,
    title: "Crecimiento Sostenido",
    description: "Expansión constante en el mercado"
  },
  
];

function CredibilitySection() {
  return (
    <section className="credibility-section">
      <div className="credibility-container">
        {/* Header */}
        <div className="credibility-header">
          <div className="section-badge">
            <FaShieldAlt className="badge-icon" />
            <span>Confianza y Experiencia</span>
          </div>
          
          <h2 className="credibility-title">
            <span>Más de dos décadas</span>
            <span className="title-highlight">de Experiencia</span>
          </h2>
          
          <p className="credibility-description">
            Nuestra trayectoria nos respalda como líderes indiscutibles en seguridad industrial
          </p>
        </div>

        {/* Main Credibility Cards */}
        <div className="credibility-cards">
          {credibilityData.map((item, index) => (
            <div 
              key={index} 
              className="credibility-card"
              style={{
                '--credibility-color': item.color,
                '--credibility-bg': item.bgColor
              }}
            >
              <div className="credibility-card-inner">
                <div className="credibility-icon-wrapper">
                  <div className="credibility-icon">
                    {item.icon}
                  </div>
                  <div className="credibility-icon-glow"></div>
                </div>
                
                <div className="credibility-content">
                  <div className="credibility-number">{item.number}</div>
                  <div className="credibility-label">{item.label}</div>
                  <div className="credibility-description">{item.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <h3 className="trust-title">Nuestros Compromisos</h3>
          <div className="trust-grid">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="trust-item">
                <div className="trust-icon">
                  {indicator.icon}
                </div>
                <div className="trust-content">
                  <h4>{indicator.title}</h4>
                  <p>{indicator.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CredibilitySection;


