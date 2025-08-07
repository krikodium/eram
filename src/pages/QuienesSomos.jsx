// src/pages/QuienesSomos.jsx - Ultra Professional About Us Page
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaIndustry, 
  FaUsers,
  FaCertificate,
  FaAward,
  FaTrophy,
  FaFlag,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChartLine,
  FaRegLightbulb, 
  FaHandshake,
  FaTools,
  FaHeart,
  FaLeaf,
  FaGlobeAmericas,
  FaRocket,
  FaEye,
  FaBullseye,
  FaHistory,
  FaCheckCircle
} from 'react-icons/fa';
import './QuienesSomos.css';

const companyMilestones = [
  {
    year: "1974",
    title: "Fundación de ERAM",
    description: "Nace ERAM con la visión de liderar la seguridad industrial en Argentina",
    icon: <FaHistory />,
    color: "#D32F2F"
  },
  {
    year: "1985",
    title: "Primera Expansión",
    description: "Ampliamos nuestra línea de productos y abrimos nuevas sucursales",
    icon: <FaChartLine />,
    color: "#1976D2"
  },
  {
    year: "2000",
    title: "Certificación ISO",
    description: "Obtuvimos la certificación ISO 9001, garantizando la máxima calidad",
    icon: <FaCertificate />,
    color: "#2E7D32"
  },
  {
    year: "2015",
    title: "Líderes del Mercado",
    description: "Nos consolidamos como referentes en seguridad industrial",
    icon: <FaTrophy />,
    color: "#FF6B35"
  },
  {
    year: "2024",
    title: "50 Años de Trayectoria",
    description: "Celebramos cinco décadas protegiendo la industria argentina",
    icon: <FaAward />,
    color: "#7B1FA2"
  }
];

const companyStats = [
  {
    icon: <FaCalendarAlt />,
    number: "50+",
    label: "Años de Experiencia",
    description: "Desde 1974 protegiendo trabajadores argentinos",
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
    icon: <FaShieldAlt />,
    number: "100%",
    label: "Productos Certificados",
    description: "Cumplimos con los más altos estándares",
    color: "#2E7D32"
  },
  {
    icon: <FaMapMarkerAlt />,
    number: "24",
    label: "Provincias Alcanzadas",
    description: "Cobertura en todo el territorio nacional",
    color: "#FF6B35"
  }
];

const coreValues = [
  {
    icon: <FaRegLightbulb />,
    title: "Innovación",
    description: "Nos adaptamos constantemente a las nuevas tecnologías y exigencias del mercado, manteniéndonos a la vanguardia.",
    features: ["Tecnología de punta", "Investigación continua", "Actualización constante"],
    color: "#FFB74D"
  },
  {
    icon: <FaHandshake />,
    title: "Compromiso",
    description: "Trabajamos con responsabilidad y ética, priorizando la confianza y relaciones duraderas con nuestros clientes.",
    features: ["Ética profesional", "Relaciones duraderas", "Servicio personalizado"],
    color: "#64B5F6"
  },
  {
    icon: <FaShieldAlt />,
    title: "Seguridad",
    description: "Es nuestro eje central. Garantizamos productos certificados y un servicio que realmente protege a las personas.",
    features: ["Productos certificados", "Asesoramiento técnico", "Garantía total"],
    color: "#81C784"
  },
  {
    icon: <FaHeart />,
    title: "Calidad Humana",
    description: "Entendemos que detrás de cada equipo de seguridad hay una familia que espera el regreso de su ser querido.",
    features: ["Atención personalizada", "Capacitación incluida", "Soporte 24/7"],
    color: "#F06292"
  }
];

const businessPillars = [
  {
    title: "Nuestra Historia",
    subtitle: "50 Años de Liderazgo",
    description: "Desde 1974, ERAM ha sido sinónimo de excelencia en seguridad industrial. Fundada con la visión de proteger a los trabajadores argentinos, hemos crecido junto a nuestros clientes, incorporando tecnología de vanguardia y manteniéndonos siempre a la altura de las más exigentes normativas internacionales.",
    image: "/industria.jpg",
    achievements: [
      "Primera empresa en importar equipos de protección respiratoria avanzada",
      "Pioneros en capacitación técnica especializada",
      "Desarrollo de soluciones personalizadas para cada industria"
    ]
  },
  {
    title: "Nuestra Misión",
    subtitle: "Proteger Vidas, Impulsar Industrias",
    description: "Nuestra misión es clara: proteger al trabajador argentino brindando productos confiables, asesoramiento técnico especializado y stock permanente para garantizar la seguridad operativa en cada etapa de la producción industrial.",
    image: "/equipo.jpg",
    achievements: [
      "Productos de máxima calidad certificados internacionalmente",
      "Asesoramiento técnico por ingenieros especializados",
      "Stock permanente para disponibilidad inmediata"
    ]
  },
  {
    title: "Nuestra Visión",
    subtitle: "Líderes en Latinoamérica",
    description: "Aspiramos a ser la empresa de referencia en soluciones de protección industrial en toda Latinoamérica, promoviendo una cultura de prevención moderna, ágil y transparente que transforme positivamente el panorama de la seguridad laboral.",
    image: "/feria.jpg",
    achievements: [
      "Expansión estratégica en mercados regionales",
      "Desarrollo de programas de formación industrial",
      "Alianzas estratégicas con fabricantes mundiales"
    ]
  }
];

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
      
      {/* Hero Header Section */}
      <section className="qs-hero-section">
        <div className="qs-hero-background">
          <img src="/industria.jpg" alt="ERAM - Industria Argentina" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="qs-hero-content">
          <div className="section-badge">
            <FaFlag className="badge-icon" />
            <span>Empresa Argentina desde 1974</span>
          </div>
          
          <h1 className="qs-hero-title">
            Quiénes 
            <span className="title-highlight">Somos</span>
          </h1>
          
          <p className="qs-hero-subtitle">
            Somos ERAM, líderes en seguridad industrial con más de 50 años de experiencia 
            protegiendo la industria argentina. Brindamos soluciones profesionales de 
            máxima calidad para todo tipo de industrias.
          </p>

          <div className="hero-actions">
            <Link to="/catalogo" className="hero-btn primary">
              <FaShieldAlt />
              Explorar Productos
            </Link>
            <Link to="/contacto" className="hero-btn secondary">
              <FaUsers />
              Conocer al Equipo
            </Link>
          </div>
        </div>
      </section>

      {/* Company Statistics */}
      <section className="company-statistics">
        <div className="stats-container">
          {companyStats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card"
              style={{ '--stat-color': stat.color }}
            >
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline History */}
      <section className="timeline-section">
        <div className="section-header">
          <h2 className="section-title">
            Nuestra
            <span className="title-highlight">Historia</span>
          </h2>
          <p className="section-description">
            Cinco décadas de compromiso con la seguridad industrial argentina
          </p>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>
          {companyMilestones.map((milestone, index) => (
            <div 
              key={index}
              className={`timeline-item ${activeTimeline === index ? 'active' : ''}`}
              style={{ '--milestone-color': milestone.color }}
              onMouseEnter={() => setActiveTimeline(index)}
            >
              <div className="timeline-marker">
                <div className="timeline-icon">
                  {milestone.icon}
                </div>
              </div>
              <div className="timeline-content">
                <div className="timeline-year">{milestone.year}</div>
                <h4 className="timeline-title">{milestone.title}</h4>
                <p className="timeline-description">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Business Pillars */}
      <section className="business-pillars">
        {businessPillars.map((pillar, index) => (
          <div 
            key={index}
            className={`pillar-card ${index % 2 === 1 ? 'reverse' : ''}`}
          >
            <div className="pillar-image">
              <img src={pillar.image} alt={pillar.title} loading="lazy" />
              <div className="pillar-overlay">
                <div className="overlay-pattern"></div>
              </div>
            </div>
            
            <div className="pillar-content">
              <div className="pillar-badge">
                <FaBullseye />
                <span>{pillar.subtitle}</span>
              </div>
              
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-description">{pillar.description}</p>
              
              <div className="pillar-achievements">
                {pillar.achievements.map((achievement, achievementIndex) => (
                  <div key={achievementIndex} className="achievement-item">
                    <FaCheckCircle />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Core Values */}
      <section className="core-values-section">
        <div className="section-header">
          <div className="section-badge">
            <FaHeart />
            <span>Lo que nos define</span>
          </div>
          
          <h2 className="section-title">
            Nuestros
            <span className="title-highlight">Valores</span>
          </h2>
          
          <p className="section-description">
            Los principios que guían nuestro trabajo y definen nuestra identidad como empresa
          </p>
        </div>

        <div className="values-grid">
          {coreValues.map((value, index) => (
            <div 
              key={index}
              className="value-card"
              style={{ '--value-color': value.color }}
            >
              <div className="value-header">
                <div className="value-icon">
                  {value.icon}
                </div>
                <h4 className="value-title">{value.title}</h4>
              </div>
              
              <p className="value-description">{value.description}</p>
              
              <div className="value-features">
                {value.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="feature-item">
                    <FaCheckCircle />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="qs-cta-section">
        <div className="cta-background">
          <img src="/equipo.jpg" alt="Equipo ERAM" className="cta-bg-image" />
          <div className="cta-overlay"></div>
        </div>
        
        <div className="cta-content">
          <h2 className="cta-title">
            Sumá tu empresa a nuestra
            <span className="title-highlight">Historia de Éxito</span>
          </h2>
          
          <p className="cta-description">
            Más de 10,000 empresas ya confían en nosotros. 
            Descubrí cómo podemos ayudar a proteger a tu equipo.
          </p>
          
          <div className="cta-actions">
            <Link to="/catalogo" className="cta-btn primary">
              <FaShieldAlt />
              Ver Productos
            </Link>
            <Link to="/contacto" className="cta-btn secondary">
              <FaUsers />
              Contactar Asesor
            </Link>
            <Link to="/ferias" className="cta-btn tertiary">
              <FaGlobeAmericas />
              Nuestras Ferias
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default QuienesSomos;
