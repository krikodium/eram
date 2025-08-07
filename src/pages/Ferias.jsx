// src/pages/Ferias.jsx - Ultra Professional Trade Shows Page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers,
  FaClock,
  FaGlobe,
  FaAward,
  FaHandshake,
  FaIndustry,
  FaBullhorn,
  FaChevronRight,
  FaExternalLinkAlt,
  FaPhone,
  FaEnvelope,
  FaTicketAlt,
  FaStar,
  FaEye,
  FaCertificate,
  FaTrophy,
  FaRocket
} from 'react-icons/fa';
import './Ferias.css';

const upcomingFairs = [
  {
    id: 1,
    name: "Expo Seguridad Industrial 2025",
    date: "15 - 18 Mayo 2025",
    location: "La Rural, Buenos Aires",
    description: "La feria más importante de seguridad industrial en Argentina. Presentamos nuestras nuevas líneas de protección personal y sistemas de seguridad vial con tecnología de vanguardia.",
    image: "/feria1.jpg",
    status: "featured",
    booth: "Pabellón 3 - Stand 145",
    category: "Seguridad Industrial",
    attendees: "25,000+",
    exhibitors: "500+",
    features: [
      "Lanzamiento de nuevos productos",
      "Demostraciones en vivo",
      "Capacitación especializada",
      "Networking profesional"
    ]
  },
  {
    id: 2,
    name: "Feria Internacional del Trabajo Seguro",
    date: "10 - 12 Junio 2025",
    location: "Centro Costa Salguero",
    description: "Evento internacional dedicado a las últimas innovaciones en seguridad laboral. Compartimos avances tecnológicos en señalización industrial y productos reflectivos.",
    image: "/feria2.jpg",
    status: "upcoming",
    booth: "Sector B - Stand 87",
    category: "Trabajo Seguro",
    attendees: "15,000+",
    exhibitors: "300+",
    features: [
      "Productos reflectivos innovadores",
      "Señalización inteligente",
      "Consultorías técnicas",
      "Certificaciones internacionales"
    ]
  },
  {
    id: 3,
    name: "Expo Emergencias y Primeros Auxilios",
    date: "5 - 7 Septiembre 2025",
    location: "Predio Ferial Córdoba",
    description: "Feria especializada en equipamiento de emergencia y primeros auxilios. Destacamos nuestros kits de emergencia, botiquines y elementos para situaciones críticas.",
    image: "/feria3.jpg",
    status: "confirmed",
    booth: "Hall Central - Stand 23",
    category: "Emergencias Médicas",
    attendees: "12,000+",
    exhibitors: "200+",
    features: [
      "Kits de emergencia completos",
      "Simulacros de rescate",
      "Capacitación en primeros auxilios",
      "Equipos de última generación"
    ]
  }
];

const pastHighlights = [
  {
    year: "2024",
    event: "AIHA Argentina Conference",
    achievement: "Premio a la Innovación en EPP",
    attendees: "3,200+",
    description: "Reconocimiento por nuestro desarrollo en sistemas de protección respiratoria inteligente"
  },
  {
    year: "2023",
    event: "ExpoSeguridad Buenos Aires",
    achievement: "Stand Más Visitado",
    attendees: "8,500+",
    description: "Más de 2,000 visitantes en nuestro stand durante los 3 días del evento"
  },
  {
    year: "2023",
    event: "Feria Industrial Córdoba",
    achievement: "Mejor Propuesta Tecnológica",
    attendees: "5,800+",
    description: "Presentación exitosa de nuestra línea de cascos inteligentes con sensores IoT"
  }
];

const fairBenefits = [
  {
    icon: <FaEye />,
    title: "Conocé Nuestras Novedades",
    description: "Sé el primero en ver nuestros productos más innovadores y tecnología de vanguardia"
  },
  {
    icon: <FaUsers />,
    title: "Asesoramiento Personalizado",
    description: "Consultá con nuestros expertos sobre las mejores soluciones para tu industria"
  },
  {
    icon: <FaCertificate />,
    title: "Capacitación Especializada",
    description: "Participá de talleres y demostraciones sobre el uso correcto de equipos de seguridad"
  },
  {
    icon: <FaHandshake />,
    title: "Networking Profesional",
    description: "Conectá con otros profesionales de la seguridad industrial y expandí tu red"
  }
];

function Ferias() {
  const [selectedFair, setSelectedFair] = useState(0);
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

    const section = document.querySelector('.ferias-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`ferias-section ${isVisible ? 'visible' : ''}`}>
      
      {/* Hero Section */}
      <section className="ferias-hero-section">
        <div className="ferias-hero-background">
          <img src="/feria.jpg" alt="ERAM en Ferias" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="ferias-hero-content">
          <div className="section-badge">
            <FaGlobe className="badge-icon" />
            <span>Presencia Internacional</span>
          </div>
          
          <h1 className="ferias-hero-title">
            Nuestras
            <span className="title-highlight">Ferias</span>
          </h1>
          
          <p className="ferias-hero-subtitle">
            Participamos activamente en las ferias más importantes del país, 
            compartiendo nuestras innovaciones en seguridad industrial y 
            fortaleciendo la conexión con profesionales del sector.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Ferias Anuales</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100K+</div>
              <div className="stat-label">Visitantes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">Premios Recibidos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Fairs Section */}
      <section className="upcoming-fairs-section">
        <div className="section-header">
          <div className="section-badge">
            <FaCalendarAlt />
            <span>Próximos Eventos</span>
          </div>
          
          <h2 className="section-title">
            Próximas
            <span className="title-highlight">Participaciones</span>
          </h2>
          
          <p className="section-description">
            Encontranos en los eventos más importantes de la industria. 
            Vení a conocer nuestras últimas innovaciones.
          </p>
        </div>

        <div className="fairs-showcase">
          {/* Fair Selection Cards */}
          <div className="fair-selector">
            {upcomingFairs.map((fair, index) => (
              <div 
                key={fair.id}
                className={`selector-card ${selectedFair === index ? 'active' : ''}`}
                onClick={() => setSelectedFair(index)}
              >
                <div className="selector-image">
                  <img src={fair.image} alt={fair.name} />
                  <div className={`status-badge ${fair.status}`}>
                    <FaStar />
                    {fair.status === 'featured' ? 'Destacada' : 
                     fair.status === 'upcoming' ? 'Próxima' : 'Confirmada'}
                  </div>
                </div>
                
                <div className="selector-info">
                  <h4>{fair.name}</h4>
                  <div className="selector-meta">
                    <span><FaCalendarAlt /> {fair.date}</span>
                    <span><FaMapMarkerAlt /> {fair.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Fair Details */}
          <div className="fair-details">
            {upcomingFairs[selectedFair] && (
              <div className="detail-card">
                <div className="detail-header">
                  <div className="detail-image">
                    <img 
                      src={upcomingFairs[selectedFair].image} 
                      alt={upcomingFairs[selectedFair].name} 
                    />
                    <div className="detail-overlay"></div>
                  </div>
                  
                  <div className="detail-info">
                    <div className="category-badge">
                      <FaIndustry />
                      {upcomingFairs[selectedFair].category}
                    </div>
                    
                    <h3>{upcomingFairs[selectedFair].name}</h3>
                    
                    <div className="detail-meta">
                      <div className="meta-item">
                        <FaCalendarAlt />
                        <span>{upcomingFairs[selectedFair].date}</span>
                      </div>
                      <div className="meta-item">
                        <FaMapMarkerAlt />
                        <span>{upcomingFairs[selectedFair].location}</span>
                      </div>
                      <div className="meta-item">
                        <FaTicketAlt />
                        <span>{upcomingFairs[selectedFair].booth}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-content">
                  <p className="detail-description">
                    {upcomingFairs[selectedFair].description}
                  </p>

                  <div className="fair-highlights">
                    <h4>Qué encontrarás en nuestro stand:</h4>
                    <div className="highlights-grid">
                      {upcomingFairs[selectedFair].features.map((feature, index) => (
                        <div key={index} className="highlight-item">
                          <FaChevronRight />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="fair-stats">
                    <div className="fair-stat">
                      <FaUsers />
                      <div>
                        <div className="stat-number">{upcomingFairs[selectedFair].attendees}</div>
                        <div className="stat-label">Visitantes Esperados</div>
                      </div>
                    </div>
                    <div className="fair-stat">
                      <FaBullhorn />
                      <div>
                        <div className="stat-number">{upcomingFairs[selectedFair].exhibitors}</div>
                        <div className="stat-label">Expositores</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-actions">
                    <a href="mailto:ferias@eram.com.ar" className="detail-btn primary">
                      <FaEnvelope />
                      Solicitar Reunión
                    </a>
                    <a href="https://wa.me/5491123456789" className="detail-btn secondary">
                      <FaPhone />
                      Más Información
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Visit Us Section */}
      <section className="visit-benefits-section">
        <div className="section-header">
          <h2 className="section-title">
            ¿Por qué visitarnos en
            <span className="title-highlight">Nuestro Stand?</span>
          </h2>
        </div>

        <div className="benefits-grid">
          {fairBenefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">
                {benefit.icon}
              </div>
              <h4 className="benefit-title">{benefit.title}</h4>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Past Highlights */}
      <section className="past-highlights-section">
        <div className="section-header">
          <div className="section-badge">
            <FaTrophy />
            <span>Logros Destacados</span>
          </div>
          
          <h2 className="section-title">
            Nuestros
            <span className="title-highlight">Éxitos</span>
          </h2>
          
          <p className="section-description">
            Los reconocimientos y logros que hemos obtenido en las ferias más importantes
          </p>
        </div>

        <div className="highlights-timeline">
          {pastHighlights.map((highlight, index) => (
            <div key={index} className="highlight-item">
              <div className="highlight-year">
                <div className="year-circle">
                  <FaAward />
                </div>
                <span>{highlight.year}</span>
              </div>
              
              <div className="highlight-content">
                <h4>{highlight.event}</h4>
                <div className="achievement-badge">
                  <FaTrophy />
                  {highlight.achievement}
                </div>
                <p>{highlight.description}</p>
                <div className="attendance-info">
                  <FaUsers />
                  <span>{highlight.attendees} asistentes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="ferias-cta-section">
        <div className="cta-background">
          <img src="/feria.jpg" alt="Visitanos en Ferias" className="cta-bg-image" />
          <div className="cta-overlay"></div>
        </div>
        
        <div className="cta-content">
          <div className="section-badge">
            <FaRocket />
            <span>¡Te Esperamos!</span>
          </div>
          
          <h2 className="cta-title">
            Encontranos en el
            <span className="title-highlight">Próximo Evento</span>
          </h2>
          
          <p className="cta-description">
            No te pierdas la oportunidad de conocer nuestras últimas innovaciones 
            y recibir asesoramiento personalizado de nuestros expertos.
          </p>
          
          <div className="cta-actions">
            <Link to="/catalogo" className="cta-btn primary">
              <FaEye />
              Ver Productos
            </Link>
            <a href="mailto:ferias@eram.com.ar" className="cta-btn secondary">
              <FaEnvelope />
              Agendar Reunión
            </a>
            <a href="https://wa.me/5491123456789" className="cta-btn tertiary">
              <FaPhone />
              Consultar Stand
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Ferias;
