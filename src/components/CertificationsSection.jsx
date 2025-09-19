// src/components/CertificationsSection.jsx - Compact Certifications Section
import React from 'react';
import { 
  FaCertificate, 
  FaAward, 
  FaShieldAlt, 
  FaCheckCircle,
  FaGlobe,
  FaIndustry,
  FaStar,
  FaMedal
} from 'react-icons/fa';
import './CertificationsSection.css';

const certifications = [
  {
    icon: <FaCertificate />,
    title: "ISO 9001:2015",
    description: "Sistema de Gestión de Calidad",
    organization: "International Organization for Standardization",
    year: "2015",
    color: "#1976D2"
  },
  {
    icon: <FaShieldAlt />,
    title: "IRAM 14100",
    description: "Equipos de Protección Personal",
    organization: "Instituto Argentino de Normalización",
    year: "2020",
    color: "#D32F2F"
  },
  {
    icon: <FaAward />,
    title: "OHSAS 18001",
    description: "Sistema de Gestión de Seguridad y Salud Ocupacional",
    organization: "British Standards Institution",
    year: "2018",
    color: "#2E7D32"
  },
  {
    icon: <FaGlobe />,
    title: "CE Marking",
    description: "Conformidad Europea",
    organization: "European Union",
    year: "2022",
    color: "#FF6B35"
  }
];

const qualityIndicators = [
  {
    icon: <FaCheckCircle />,
    title: "100% Productos Certificados",
    description: "Todos nuestros productos cumplen con las normas internacionales"
  },
  {
    icon: <FaIndustry />,
    title: "Auditorías Regulares",
    description: "Controles de calidad cada 6 meses"
  },
  {
    icon: <FaStar />,
    title: "Calidad Premium",
    description: "Estándares superiores a los requeridos"
  },
  {
    icon: <FaMedal />,
    title: "Reconocimiento Nacional",
    description: "Premio a la Excelencia en Seguridad Industrial"
  }
];

function CertificationsSection() {
  return (
    <section className="certifications-section">
      <div className="certifications-container">
        
        {/* Header */}
        <div className="certifications-header">
          <div className="section-badge">
            <FaCertificate className="badge-icon" />
            <span>Certificaciones y Calidad</span>
          </div>
          
          <h2 className="certifications-title">
            Nuestros
            <span className="title-highlight">Certificados</span>
          </h2>
          
          <p className="certifications-description">
            Garantizamos la máxima calidad y cumplimiento de estándares internacionales
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="certifications-grid">
          {certifications.map((cert, index) => (
            <div 
              key={index} 
              className="certification-card"
              style={{ '--cert-color': cert.color }}
            >
              <div className="certification-card-inner">
                <div className="certification-icon">
                  {cert.icon}
                </div>
                
                <div className="certification-content">
                  <div className="certification-header">
                    <h3 className="certification-title">{cert.title}</h3>
                    <span className="certification-year">{cert.year}</span>
                  </div>
                  
                  <p className="certification-description">{cert.description}</p>
                  <p className="certification-organization">{cert.organization}</p>
                </div>
                
                <div className="certification-badge">
                  <FaCheckCircle />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Indicators */}
        <div className="quality-indicators">
          <h3 className="quality-title">Nuestros Compromisos de Calidad</h3>
          
          <div className="quality-grid">
            {qualityIndicators.map((indicator, index) => (
              <div key={index} className="quality-item">
                <div className="quality-icon">
                  {indicator.icon}
                </div>
                <div className="quality-content">
                  <h4 className="quality-item-title">{indicator.title}</h4>
                  <p className="quality-item-description">{indicator.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Statement */}
        <div className="trust-statement">
          <div className="trust-content">
            <h3 className="trust-title">Confianza Garantizada</h3>
            <p className="trust-description">
              Más de 50 años de experiencia respaldan nuestro compromiso con la calidad. 
              Cada producto que desarrollamos pasa por rigurosos controles de calidad 
              para garantizar la máxima protección y durabilidad.
            </p>
          </div>
          
          <div className="trust-visual">
            <div className="trust-icon">
              <FaShieldAlt />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CertificationsSection;


