// src/pages/Ferias.jsx - Enhanced Trade Shows Page with Improved Layout
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers,
  FaGlobe,
  FaAward,
  FaHandshake,
  FaIndustry,
  FaChevronRight,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaEye,
  FaCertificate,
  FaTrophy,
  FaRocket,
  FaImages,
  FaChevronLeft,
  FaArrowRight,
  FaBuilding,
  FaFlag
} from 'react-icons/fa';
import './Ferias.css';

// Memoized data to prevent recreation on re-renders
const PAST_FAIRS = [
  {
    id: 1,
    name: "Expoferretera Buenos Aires 2023",
    year: "2023",
    location: "Buenos Aires, Argentina",
    country: "Argentina",
    category: "Ferretería Industrial",
    status: "exitosa",
    description: "Nuestra participación más exitosa en la exposición de ferretería industrial más importante de Argentina. Presentamos nuestra línea completa de productos de seguridad industrial con un stand completamente renovado.",
    images: [
      "/ferias/expo-ferretera-buenos-aires-2023-1.jpg",
      "/ferias/expo-ferretera-buenos-aires-2023-2.jpg", 
      "/ferias/expo-ferretera-buenos-aires-2023-3.jpg",
      "/ferias/expo-ferretera-buenos-aires-2023-4.jpg",
      "/ferias/expo-ferretera-buenos-aires-2023-5.jpg"
    ],
    highlights: [
      "Stand completamente renovado con diseño moderno e interactivo",
      "Más de 2,500 visitantes profesionales y nuevos contactos comerciales",
      "Lanzamiento exitoso de nuevos productos de protección personal",
      "Alianzas estratégicas firmadas con distribuidores regionales clave",
      "Reconocimiento por innovación en seguridad industrial",
      "Demostraciones en vivo de equipos de última generación"
    ],
    attendees: "2,500+",
    standSize: "36 m²",
    duration: "3 días"
  },
  {
    id: 2,
    name: "Feira Internacional de Segurança e Proteção 2022",
    year: "2022", 
    location: "São Paulo, Brasil",
    country: "Brasil",
    category: "Seguridad Internacional",
    status: "internacional",
    description: "Nuestra exitosa incursión en el mercado brasileño, participando en la feria más importante de seguridad y protección de América Latina. Un hito en nuestra expansión internacional.",
    images: [
      "/ferias/feira-sao-paulo-2022-1.jpg",
      "/ferias/feira-sao-paulo-2022-2.jpg"
    ],
    highlights: [
      "Primera participación internacional exitosa en el mercado brasileño",
      "Presentación de productos con certificaciones internacionales",
      "Establecimiento de contactos estratégicos con importadores locales",
      "Reconocimiento por calidad y cumplimiento de normas internacionales",
      "Apertura de nuevos canales de distribución en América Latina",
      "Validación de productos para mercados internacionales"
    ],
    attendees: "1,800+",
    standSize: "24 m²",
    duration: "4 días"
  },
  {
    id: 3,
    name: "Expoferretera Buenos Aires 2017",
    year: "2017",
    location: "Buenos Aires, Argentina", 
    country: "Argentina",
    category: "Ferretería Industrial",
    status: "fundacional",
    description: "Una de nuestras primeras participaciones importantes que marcó el crecimiento de ERAM en el sector ferretero argentino. Estableció las bases para nuestro liderazgo actual en el mercado.",
    images: [
      "/ferias/expo-ferretera-buenos-aires-2017-1.jpg"
    ],
    highlights: [
      "Consolidación definitiva de la marca ERAM en el mercado nacional",
      "Establecimiento de relaciones comerciales duraderas y estratégicas",
      "Presentación de productos innovadores que marcaron tendencia",
      "Base sólida establecida para futuras participaciones internacionales",
      "Reconocimiento como empresa emergente del sector",
      "Crecimiento del 150% en ventas post-feria"
    ],
    attendees: "1,200+",
    standSize: "18 m²",
    duration: "3 días"
  }
];

// Memoized upcoming fairs data
const UPCOMING_FAIRS = [
  {
    id: 1,
    name: "Expoferretera Buenos Aires 2025",
    date: "15 - 18 Mayo 2025",
    location: "La Rural, Buenos Aires",
    description: "Regresamos a la feria más importante de ferretería industrial de Argentina con nuestras últimas innovaciones en seguridad industrial y tecnología de protección personal.",
    image: "/ferias/expo-ferretera-buenos-aires-2023-1.jpg",
    status: "featured",
    booth: "Pabellón 3 - Stand 145-148",
    category: "Ferretería Industrial",
    attendees: "30,000+",
    exhibitors: "650+",
    features: [
      "Lanzamiento mundial de productos innovadores 2025",
      "Demostraciones interactivas con realidad aumentada",
      "Capacitación certificada gratuita para profesionales",
      "Promociones exclusivas y descuentos especiales para distribuidores"
    ]
  },
  {
    id: 2,
    name: "Feira Internacional de Segurança São Paulo 2025",
    date: "10 - 13 Junio 2025", 
    location: "Expo Center Norte, São Paulo",
    description: "Continuamos fortaleciendo nuestra presencia internacional regresando a Brasil con productos certificados y nuevas soluciones tecnológicas para el mercado latinoamericano.",
    image: "/ferias/feira-sao-paulo-2022-1.jpg",
    status: "upcoming",
    booth: "Pavilhão A - Stand 87-89",
    category: "Seguridad Internacional",
    attendees: "45,000+",
    exhibitors: "500+",
    features: [
      "Productos con nuevas certificaciones internacionales",
      "Red de distribuidores expandida en toda América Latina",
      "Tecnología IoT aplicada a seguridad industrial",
      "Servicio técnico especializado y soporte 24/7"
    ]
  }
];

const FAIR_BENEFITS = [
  {
    icon: <FaEye />,
    title: "Innovaciones Exclusivas",
    description: "Sé el primero en conocer nuestros productos más innovadores y tecnología de vanguardia antes de su lanzamiento comercial"
  },
  {
    icon: <FaUsers />,
    title: "Asesoramiento Especializado", 
    description: "Consultá directamente con nuestros ingenieros y expertos sobre las mejores soluciones para tu industria específica"
  },
  {
    icon: <FaCertificate />,
    title: "Capacitación Profesional",
    description: "Participá de talleres, demostraciones técnicas y certificaciones sobre el uso correcto de equipos de seguridad"
  },
  {
    icon: <FaHandshake />,
    title: "Networking Empresarial",
    description: "Conectá con profesionales del sector, distribuidores y expandí tu red comercial en un ambiente profesional"
  }
];

function Ferias() {
  const [selectedFair, setSelectedFair] = useState(0);
  const [selectedPastEvent, setSelectedPastEvent] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const componentMountedRef = useRef(false);

  // Memoize data to prevent unnecessary re-renders
  const pastFairs = useMemo(() => PAST_FAIRS, []);
  const upcomingFairs = useMemo(() => UPCOMING_FAIRS, []);
  const fairBenefits = useMemo(() => FAIR_BENEFITS, []);

  useEffect(() => {
    if (componentMountedRef.current) return;
    componentMountedRef.current = true;

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

    return () => {
      observer.disconnect();
      componentMountedRef.current = false;
    };
  }, []);

  // Auto rotate images for past events
  useEffect(() => {
    const interval = setInterval(() => {
      if (pastFairs[selectedPastEvent]?.images?.length > 1) {
        setCurrentImageIndex(prev => 
          (prev + 1) % pastFairs[selectedPastEvent].images.length
        );
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedPastEvent, pastFairs]);

  // Reset image index when changing past event
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedPastEvent]);

  // Handle past event selection with smooth transition
  const handlePastEventChange = (index) => {
    if (index !== selectedPastEvent) {
      setImageLoading(true);
      setSelectedPastEvent(index);
      setCurrentImageIndex(0);
      setTimeout(() => setImageLoading(false), 300);
    }
  };

  // Handle upcoming fair selection with smooth transition
  const handleUpcomingFairChange = (index) => {
    if (index !== selectedFair) {
      setSelectedFair(index);
    }
  };

  return (
    <div className={`ferias-section ${isVisible ? 'visible' : ''}`}>
      
      {/* Hero Section */}
      <section className="ferias-hero-section">
        <div className="ferias-hero-background">
          <img src="/ferias/expo-ferretera-buenos-aires-2023-1.jpg" alt="ERAM en Ferias Internacionales" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="ferias-hero-content">
          <div className="section-badge">
            <FaGlobe className="badge-icon" />
            <span>Presencia Nacional e Internacional</span>
          </div>
          
          <h1 className="ferias-hero-title">
            Nuestras
            <span className="title-highlight">Ferias</span>
          </h1>
          
          <p className="ferias-hero-subtitle">
            Desde 2017 participamos activamente en las ferias más importantes de Argentina y América Latina, 
            compartiendo nuestras innovaciones en seguridad industrial y fortaleciendo vínculos comerciales estratégicos.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">8+</div>
              <div className="stat-label">Años Experiencia</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">20+</div>
              <div className="stat-label">Ferias Participadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6K+</div>
              <div className="stat-label">Contactos Comerciales</div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Participations Section */}
      <section className="past-participations-section">
        <div className="section-header">
          <div className="section-badge">
            <FaImages />
            <span>Nuestra Trayectoria</span>
          </div>
          
          <h2 className="section-title">
            Nuestras
            <span className="title-highlight">Participaciones</span>
          </h2>
          
          <p className="section-description">
            Revivé nuestras participaciones más destacadas en las ferias más importantes del sector. 
            Cada evento ha sido un hito en nuestro crecimiento y expansión internacional.
          </p>
        </div>

        <div className="participations-container">
          {/* Event Selection Cards */}
          <div className="events-selector">
            {pastFairs.map((event, index) => (
              <div 
                key={`past-event-${event.id}`}
                className={`event-card ${selectedPastEvent === index ? 'active' : ''}`}
                onClick={() => handlePastEventChange(index)}
              >
                <div className="event-card-image">
                  <img src={event.images[0]} alt={event.name} loading="lazy" />
                  <div className={`status-badge ${event.status}`}>
                    {event.status === 'exitosa' ? 'EXITOSA' : 
                     event.status === 'internacional' ? 'INTERNACIONAL' : 'FUNDACIONAL'}
                  </div>
                </div>
                
                <div className="event-card-content">
                  <h4 className="event-title">{event.name}</h4>
                  <div className="event-meta">
                    <div className="meta-item">
                      <FaCalendarAlt />
                      <span>{event.year}</span>
                    </div>
                    <div className="meta-item">
                      <FaMapMarkerAlt />
                      <span>{event.location}</span>
                    </div>
                    <div className="meta-item">
                      <FaFlag />
                      <span>{event.country}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Event Details Panel */}
          <div className="event-details-panel">
            {pastFairs[selectedPastEvent] && (
              <div className={`detail-card ${imageLoading ? 'loading' : ''}`} key={`event-detail-${pastFairs[selectedPastEvent].id}`}>
                
                {/* Detail Header with Image Gallery */}
                <div className="detail-header">
                  <div className="image-gallery-section">
                    <div className="main-image-container">
                      <img 
                        src={pastFairs[selectedPastEvent].images[currentImageIndex]} 
                        alt={`${pastFairs[selectedPastEvent].name} - Imagen ${currentImageIndex + 1}`}
                        className="main-image"
                        loading="lazy"
                      />
                      {pastFairs[selectedPastEvent].images.length > 1 && (
                        <div className="image-counter">
                          {currentImageIndex + 1} / {pastFairs[selectedPastEvent].images.length}
                        </div>
                      )}
                    </div>
                    
                    {pastFairs[selectedPastEvent].images.length > 1 && (
                      <div className="image-thumbnails">
                        {pastFairs[selectedPastEvent].images.map((image, index) => (
                          <button 
                            key={`thumbnail-${index}`}
                            className={`thumbnail-btn ${currentImageIndex === index ? 'active' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            <img src={image} alt={`Vista ${index + 1}`} loading="lazy" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="event-info-section">
                    <div className="category-badge">
                      <FaIndustry />
                      <span>{pastFairs[selectedPastEvent].category}</span>
                    </div>
                    
                    <h3 className="event-name">{pastFairs[selectedPastEvent].name}</h3>
                    
                    <div className="event-metadata">
                      <div className="metadata-item">
                        <FaCalendarAlt className="metadata-icon" />
                        <span>{pastFairs[selectedPastEvent].year}</span>
                      </div>
                      <div className="metadata-item">
                        <FaMapMarkerAlt className="metadata-icon" />
                        <span>{pastFairs[selectedPastEvent].location}</span>
                      </div>
                      <div className="metadata-item">
                        <FaUsers className="metadata-icon" />
                        <span>{pastFairs[selectedPastEvent].attendees} visitantes</span>
                      </div>
                      <div className="metadata-item">
                        <FaBuilding className="metadata-icon" />
                        <span>Stand: {pastFairs[selectedPastEvent].standSize}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="detail-content">
                  <p className="event-description">
                    {pastFairs[selectedPastEvent].description}
                  </p>

                  <div className="achievements-section">
                    <h4 className="achievements-title">Logros destacados:</h4>
                    <div className="achievements-grid">
                      {pastFairs[selectedPastEvent].highlights.map((highlight, index) => (
                        <div key={`highlight-${index}`} className="achievement-item">
                          <FaChevronRight className="achievement-icon" />
                          <span className="achievement-text">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Fairs Section */}
      <section className="upcoming-fairs-section" key="upcoming-section-unique">
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
            Encontranos en los próximos eventos internacionales. Vení a conocer nuestras últimas innovaciones 
            y aprovechá las promociones exclusivas para visitantes.
          </p>
        </div>

        <div className="upcoming-container">
          {/* Fair Selection Cards */}
          <div className="upcoming-selector">
            {upcomingFairs.map((fair, index) => (
              <div 
                key={`upcoming-fair-${fair.id}`}
                className={`upcoming-card ${selectedFair === index ? 'active' : ''}`}
                onClick={() => handleUpcomingFairChange(index)}
              >
                <div className="upcoming-card-image">
                  <img src={fair.image} alt={fair.name} loading="lazy" />
                  <div className={`status-badge ${fair.status}`}>
                    <FaStar />
                    <span>{fair.status === 'featured' ? 'DESTACADA' : 'PRÓXIMA'}</span>
                  </div>
                </div>
                
                <div className="upcoming-card-content">
                  <h4 className="upcoming-title">{fair.name}</h4>
                  <div className="upcoming-meta">
                    <div className="meta-item">
                      <FaCalendarAlt />
                      <span>{fair.date}</span>
                    </div>
                    <div className="meta-item">
                      <FaMapMarkerAlt />
                      <span>{fair.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Fair Details */}
          <div className="upcoming-details-panel">
            {upcomingFairs[selectedFair] && (
              <div className="upcoming-detail-card" key={`upcoming-detail-${upcomingFairs[selectedFair].id}`}>
                <div className="upcoming-header">
                  <div className="upcoming-image">
                    <img 
                      src={upcomingFairs[selectedFair].image} 
                      alt={upcomingFairs[selectedFair].name} 
                      loading="lazy"
                    />
                    <div className="upcoming-overlay"></div>
                  </div>
                  
                  <div className="upcoming-info">
                    <div className="category-badge">
                      <FaIndustry />
                      <span>{upcomingFairs[selectedFair].category}</span>
                    </div>
                    
                    <h3 className="upcoming-name">{upcomingFairs[selectedFair].name}</h3>
                    
                    <div className="upcoming-metadata">
                      <div className="metadata-item">
                        <FaCalendarAlt className="metadata-icon" />
                        <span>{upcomingFairs[selectedFair].date}</span>
                      </div>
                      <div className="metadata-item">
                        <FaMapMarkerAlt className="metadata-icon" />
                        <span>{upcomingFairs[selectedFair].location}</span>
                      </div>
                      <div className="metadata-item">
                        <FaBuilding className="metadata-icon" />
                        <span>{upcomingFairs[selectedFair].booth}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="upcoming-content">
                  <p className="upcoming-description">
                    {upcomingFairs[selectedFair].description}
                  </p>

                  <div className="features-section">
                    <h4 className="features-title">Qué encontrarás en nuestro stand:</h4>
                    <div className="features-grid">
                      {upcomingFairs[selectedFair].features.map((feature, index) => (
                        <div key={`feature-${index}`} className="feature-item">
                          <FaChevronRight className="feature-icon" />
                          <span className="feature-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="stats-section">
                    <div className="stat-card">
                      <FaUsers className="stat-icon" />
                      <div className="stat-content">
                        <div className="stat-number">{upcomingFairs[selectedFair].attendees}</div>
                        <div className="stat-label">Visitantes Esperados</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <FaIndustry className="stat-icon" />
                      <div className="stat-content">
                        <div className="stat-number">{upcomingFairs[selectedFair].exhibitors}</div>
                        <div className="stat-label">Expositores</div>
                      </div>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <a href="mailto:ferias@eram.com.ar" className="action-btn primary">
                      <FaEnvelope />
                      <span>Solicitar Reunión</span>
                    </a>
                    <a href="https://wa.me/5491123456789" className="action-btn secondary">
                      <FaPhone />
                      <span>Más Información</span>
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
          <p className="section-description">
            Descubrí todos los beneficios exclusivos de visitar nuestro stand en las ferias más importantes del sector
          </p>
        </div>

        <div className="benefits-grid">
          {fairBenefits.map((benefit, index) => (
            <div key={`benefit-${index}`} className="benefit-card">
              <div className="benefit-icon">
                {benefit.icon}
              </div>
              <h4 className="benefit-title">{benefit.title}</h4>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="ferias-cta-section">
        <div className="cta-background">
          <img src="/ferias/expo-ferretera-buenos-aires-2023-2.jpg" alt="Visitanos en Ferias" className="cta-bg-image" />
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
            No te pierdas la oportunidad de conocer nuestras últimas innovaciones, 
            recibir asesoramiento personalizado de nuestros expertos y aprovechar ofertas exclusivas.
          </p>
          
          <div className="cta-actions">
            <Link to="/catalogo" className="cta-btn primary">
              <FaEye />
              <span>Ver Productos</span>
            </Link>
            <a href="mailto:ferias@eram.com.ar" className="cta-btn secondary">
              <FaEnvelope />
              <span>Agendar Reunión</span>
            </a>
            <a href="https://wa.me/5491123456789" className="cta-btn tertiary">
              <FaPhone />
              <span>Consultar Stand</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Ferias;