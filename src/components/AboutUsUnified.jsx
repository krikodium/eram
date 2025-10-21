// src/components/AboutUsUnified.jsx - Unified About Us Section
import React, { useEffect, useState } from 'react';
import { 
  FaFlag, 
  FaIndustry, 
  FaUsers,
  FaTrophy,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChartLine,
  FaShieldAlt,
  FaGlobe,
  FaRocket,
  FaHeart,
  FaHandshake
} from 'react-icons/fa';
import './AboutUsUnified.css';

const companyStory = {
  title: "Nuestra Historia",
  subtitle: "Más de dos décadas protegiendo la industria argentina",
  description: "Desde 2003, ERAM S.R.L. ha sido el referente indiscutible en seguridad industrial en Argentina. Nacimos con la misión de proteger a los trabajadores argentinos y hoy, con más de 20 años de experiencia, continuamos siendo líderes en innovación y calidad.",
  highlights: [
    {
      year: "2003",
      title: "Fundación",
      description: "ERAM S.R.L. nace con la visión de revolucionar la seguridad industrial en Argentina",
      icon: <FaRocket />
    },
    {
      year: "2010",
      title: "Expansión Nacional",
      description: "Ampliamos nuestra cobertura a las 24 provincias del país",
      icon: <FaMapMarkerAlt />
    },
    // Removed certifications milestone
    {
      year: "2024",
      title: "Liderazgo Consolidado",
      description: "Más de 10,000 clientes activos a nivel nacional",
      icon: <FaTrophy />
    }
  ]
};

const companyValues = [
  {
    icon: <FaShieldAlt />,
    title: "Seguridad Primero",
    description: "Cada producto que desarrollamos tiene como objetivo proteger la vida y la integridad de los trabajadores",
    color: "#D32F2F"
  },
  {
    icon: <FaHeart />,
    title: "Compromiso Nacional",
    description: "Somos una empresa argentina que cree en el potencial de nuestra industria y nuestros trabajadores",
    color: "#1976D2"
  },
  {
    icon: <FaHandshake />,
    title: "Relaciones Duraderas",
    description: "Construimos relaciones de confianza a largo plazo con nuestros clientes y proveedores",
    color: "#FF6B35"
  }
];

const industryExpertise = [
  {
    icon: <FaUsers />,
    title: "Construcción",
    description: "Protección integral para obras de distintas escalas"
  },
  {
    icon: <FaChartLine />,
    title: "Minería",
    description: "Soluciones de seguridad para operaciones mineras"
  },
  {
    icon: <FaHandshake />,
    title: "Ferreterías",
    description: "Cobertura nacional de puntos de venta y distribución"
  }
];

function AboutUsUnified() {
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

    const section = document.querySelector('.aboutus-unified-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`aboutus-unified-section ${isVisible ? 'visible' : ''}`}>
      <div className="aboutus-unified-container">
        
        {/* Header Section */}
        <div className="aboutus-unified-header">
          <div className="section-badge">
            <FaFlag className="badge-icon" />
            <span>Empresa Nacional desde 2003</span>
          </div>
          
          <h2 className="aboutus-unified-title">
            Líderes en 
            <span className="title-highlight">Seguridad Industrial</span>
          </h2>
          
          <p className="aboutus-unified-subtitle">
            {companyStory.description}
          </p>
        </div>

        {/* Company Story Timeline */}
        <div className="company-story">
          <h3 className="story-title">{companyStory.title}</h3>
          <p className="story-subtitle">{companyStory.subtitle}</p>
          
          <div className="story-timeline">
            {companyStory.highlights.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="timeline-icon">
                    {milestone.icon}
                  </div>
                  <div className="timeline-year">{milestone.year}</div>
                </div>
                <div className="timeline-content">
                  <h4 className="timeline-title">{milestone.title}</h4>
                  <p className="timeline-description">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Values */}
        <div className="company-values">
          <h3 className="values-title">Nuestros Valores</h3>
          <div className="values-grid">
            {companyValues.map((value, index) => (
              <div 
                key={index} 
                className="value-card"
                style={{ '--value-color': value.color }}
              >
                <div className="value-icon">
                  {value.icon}
                </div>
                <div className="value-content">
                  <h4 className="value-title">{value.title}</h4>
                  <p className="value-description">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Expertise */}
        <div className="industry-expertise">
          <h3 className="expertise-title">Nuestra Experiencia</h3>
          <p className="expertise-subtitle">
            Especialización en múltiples sectores industriales
          </p>
          
          <div className="expertise-grid">
            {industryExpertise.map((expertise, index) => (
              <div key={index} className="expertise-card">
                <div className="expertise-icon">
                  {expertise.icon}
                </div>
                <div className="expertise-content">
                  <h4 className="expertise-title">{expertise.title}</h4>
                  <p className="expertise-description">{expertise.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA removed as requested */}
      </div>
    </section>
  );
}

export default AboutUsUnified;


