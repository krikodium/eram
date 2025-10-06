// src/components/IramCertificates.jsx - Professional IRAM Certificates Section
import React, { useEffect, useState } from 'react';
import { 
  FaCertificate, 
  FaShieldAlt, 
  FaCheckCircle,
  FaAward,
  FaIndustry,
  FaGlobeAmericas
} from 'react-icons/fa';
import './IramCertificates.css';

function IramCertificates() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = document.querySelector('.iram-certificates-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const certificates = [
    {
      icon: <FaCertificate />,
      title: "Certificación IRAM",
      description: "Todos nuestros productos cuentan con certificación IRAM Argentina, garantizando cumplimiento de normativas nacionales de seguridad.",
      highlight: "Normativa Nacional"
    },
    {
      icon: <FaShieldAlt />,
      title: "Licencias IRAM",
      description: "Licencias oficiales IRAM que avalan la calidad y seguridad de nuestros equipos de protección personal.",
      highlight: "Calidad Garantizada"
    },
    {
      icon: <FaAward />,
      title: "Certificado UL Argentina",
      description: "Certificación UL Argentina que respalda la excelencia técnica y confiabilidad de nuestros productos.",
      highlight: "Excelencia Técnica"
    }
  ];

  const benefits = [
    {
      icon: <FaCheckCircle />,
      text: "Cumplimiento normativo garantizado"
    },
    {
      icon: <FaIndustry />,
      text: "Aprobado para uso industrial"
    },
    {
      icon: <FaGlobeAmericas />,
      text: "Estándares internacionales"
    }
  ];

  return (
    <section className={`iram-certificates-section ${isVisible ? 'visible' : ''}`}>
      <div className="iram-certificates-container">
        
        {/* Header */}
        <div className="certificates-header">
          <div className="section-badge">
            <FaCertificate className="badge-icon" />
            <span>Certificaciones Especiales</span>
          </div>
          
          <h2 className="certificates-title">Productos con <span className="title-highlight"> Certificaciones IRAM</span></h2>
          
          <p className="certificates-subtitle">
            Nuestros equipos cuentan con las certificaciones más exigentes del mercado argentino, 
            garantizando máxima seguridad y cumplimiento normativo.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="certificates-grid">
          {certificates.map((cert, index) => (
            <div key={index} className="certificate-card" style={{ '--delay': `${index * 0.2}s` }}>
              <div className="certificate-icon">
                {cert.icon}
              </div>
              <div className="certificate-content">
                <h3 className="certificate-title">{cert.title}</h3>
                <p className="certificate-description">{cert.description}</p>
                <div className="certificate-highlight">{cert.highlight}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section - Professional Layout */}
        <div className="certificates-benefits">
          <div className="benefits-header">
            <h3 className="benefits-title">Beneficios de Nuestras Certificaciones</h3>
            <p className="benefits-subtitle">Garantías que respaldan la calidad de nuestros productos</p>
          </div>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon">
                    {benefit.icon}
                  </div>
                </div>
                <div className="benefit-content">
                  <h4 className="benefit-title">{benefit.text}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IRAM Logo Placeholder */}
        <div className="iram-logo-section">
          <div className="logo-container">
            <div className="logo-placeholder">
              <FaCertificate className="logo-icon" />
              <span className="logo-text">IRAM Argentina</span>
            </div>
            <p className="logo-description">
              Certificación oficial que respalda la calidad de nuestros productos
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default IramCertificates;

