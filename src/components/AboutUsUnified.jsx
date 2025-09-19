// src/components/AboutUsUnified.jsx - Unified About Us Section
import React, { useEffect, useState } from 'react';
import { 
  FaFlag, 
  FaIndustry, 
  FaUsers,
  FaCertificate,
  FaAward,
  FaTrophy,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChartLine,
  FaShieldAlt,
  FaHandshake,
  FaGlobe,
  FaRocket,
  FaHeart
} from 'react-icons/fa';
import './AboutUsUnified.css';

const companyStory = {
  title: "Nuestra Historia",
  subtitle: "Más de medio siglo protegiendo la industria argentina",
  description: "Desde 1974, ERAM ha sido el referente indiscutible en seguridad industrial en Argentina. Nacimos con la misión de proteger a los trabajadores argentinos y hoy, con más de 50 años de experiencia, continuamos siendo líderes en innovación y calidad.",
  highlights: [
    {
      year: "1974",
      title: "Fundación",
      description: "ERAM nace con la visión de revolucionar la seguridad industrial en Argentina",
      icon: <FaRocket />
    },
    {
      year: "1990s",
      title: "Expansión Nacional",
      description: "Ampliamos nuestra cobertura a las 24 provincias del país",
      icon: <FaMapMarkerAlt />
    },
    {
      year: "2000s",
      title: "Certificaciones Internacionales",
      description: "Obtuvimos las primeras certificaciones ISO y comenzamos a exportar",
      icon: <FaCertificate />
    },
    {
      year: "2024",
      title: "Liderazgo Consolidado",
      description: "Más de 10,000 clientes activos y presencia en 15+ países",
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
    icon: <FaAward />,
    title: "Excelencia en Calidad",
    description: "Mantenemos los más altos estándares internacionales en todos nuestros procesos y productos",
    color: "#2E7D32"
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
    icon: <FaIndustry />,
    title: "Industria Petrolera",
    description: "Equipos especializados para refinerías y plataformas offshore",
    highlight: "15+ años"
  },
  {
    icon: <FaUsers />,
    title: "Construcción",
    description: "Protección integral para obras de gran envergadura",
    highlight: "500+ obras"
  },
  {
    icon: <FaChartLine />,
    title: "Minería",
    description: "Soluciones de seguridad para operaciones mineras",
    highlight: "20+ minas"
  },
  {
    icon: <FaGlobe />,
    title: "Exportación",
    description: "Presencia internacional en 15+ países",
    highlight: "5 continentes"
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
            <span>Empresa Nacional desde 1974</span>
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
                  <div className="expertise-highlight">{expertise.highlight}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="aboutus-cta">
          <h3 className="cta-title">¿Querés conocer más sobre nosotros?</h3>
          <p className="cta-description">
            Descubrí nuestra historia completa y conocé cómo podemos ayudarte
          </p>
          <div className="cta-buttons">
            <a href="/quienes-somos" className="cta-btn primary">
              <FaUsers />
              Nuestra Historia
            </a>
            <a href="/contacto" className="cta-btn secondary">
              <FaHandshake />
              Contactanos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUsUnified;


