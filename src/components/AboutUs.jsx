// src/components/AboutUs.jsx - Ultra Professional About Us Section
import React, { useEffect, useState } from 'react';
import { 
  FaShieldAlt, 
  FaIndustry, 
  FaUsers,
  FaTrophy,
  FaFlag,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChartLine
} from 'react-icons/fa';
import './AboutUs.css';

const companyHighlights = [
  {
    icon: <FaCalendarAlt />,
    number: "50+",
    label: "Años de Trayectoria",
    description: "Desde 1974 protegiendo la industria argentina",
    color: "#D32F2F"
  },
  {
    icon: <FaUsers />,
    number: "10,000+",
    label: "Clientes Activos",
    description: "Empresas que confían en nuestra experiencia",
    color: "#1976D2"
  },
  
  {
    icon: <FaMapMarkerAlt />,
    number: "24",
    label: "Provincias Alcanzadas",
    description: "Cobertura en todo el territorio nacional",
    color: "#FF6B35"
  }
];

const industryExpertise = [
  {
    title: "Liderazgo en Seguridad Industrial",
    description: "Como empresa argentina con más de cinco décadas de experiencia, somos pioneros en la importación y distribución de equipos de protección personal de máxima calidad.",
    image: "/industria.jpg",
    features: [
      "Equipos de última generación",
      "Certificaciones internacionales", 
      "Asesoramiento técnico especializado"
    ]
  },
  {
    title: "Compromiso Nacional",
    description: "Apostamos al desarrollo de la industria nacional, ofreciendo soluciones integrales que protegen a los trabajadores argentinos en todos los sectores productivos.",
    image: "/equipo.jpg",
    features: [
      "Productos adaptados al mercado local",
      "Stock permanente garantizado",
      "Soporte técnico 24/7"
    ]
  },
  {
    title: "Innovación Constante",
    description: "Participamos en las ferias internacionales más prestigiosas del sector, manteniéndonos siempre a la vanguardia en tecnología y normativas de seguridad.",
    image: "/feria.jpg",
    features: [
      "Presencia en A+A Düsseldorf",
      "Investigación y desarrollo continuo",
      "Capacitación permanente del equipo"
    ]
  }
];

// Certifications removed as requested

function AboutUs() {
  const [activeCard, setActiveCard] = useState(0);
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

    const section = document.querySelector('.aboutus-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`aboutus-section ${isVisible ? 'visible' : ''}`}>
      {/* Header Section */}
      <div className="aboutus-header">
        <div className="section-badge">
          <FaFlag className="badge-icon" />
          <span>Empresa Nacional desde 1974</span>
        </div>
        
        <h2 className="aboutus-title">
          Líderes en 
          <span className="title-highlight">Seguridad Industrial</span>
        </h2>
        
        <p className="aboutus-subtitle">
          Más de medio siglo protegiendo la industria argentina con 
          equipos de protección personal de máxima calidad y tecnología de vanguardia.
        </p>
      </div>

      {/* Company Highlights */}
      <div className="company-highlights">
        {companyHighlights.map((highlight, index) => (
          <div 
            key={index} 
            className="highlight-card"
            style={{ '--highlight-color': highlight.color }}
          >
            <div className="highlight-icon">
              {highlight.icon}
            </div>
            <div className="highlight-content">
              <div className="highlight-number">{highlight.number}</div>
              <div className="highlight-label">{highlight.label}</div>
              <div className="highlight-description">{highlight.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Industry Expertise */}
      <div className="industry-expertise">
        {industryExpertise.map((item, index) => (
          <div 
            key={index}
            className={`expertise-card ${index % 2 === 1 ? 'reverse' : ''}`}
            onMouseEnter={() => setActiveCard(index)}
          >
            <div className="expertise-image">
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="expertise-overlay">
                <div className="overlay-pattern"></div>
              </div>
            </div>
            
            <div className="expertise-content">
              <h3 className="expertise-title">{item.title}</h3>
              <p className="expertise-description">{item.description}</p>
              
              <ul className="expertise-features">
                {item.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <FaShieldAlt className="feature-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="expertise-badge">
                <FaTrophy />
                <span>Excelencia Comprobada</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certifications section removed */}

      {/* CTA removed as requested */}
    </section>
  );
}

export default AboutUs;
