// src/components/PastEvents.jsx - Optimized Past Events Section
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaImages, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaFlag, 
  FaUsers, 
  FaBuilding,
  FaChevronRight,
  FaIndustry,
  FaChevronLeft,
  FaChevronRight as FaChevronRightIcon
} from 'react-icons/fa';
import './PastEvents.css';

const PastEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  // Memoized data to prevent recreation on re-renders
  const pastEvents = useMemo(() => [
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
      description: "Una de nuestras primeras participaciones importantes que marcó el crecimiento de ERAM S.R.L. en el sector ferretero argentino. Estableció las bases para nuestro liderazgo actual en el mercado.",
      images: [
        "/ferias/expo-ferretera-buenos-aires-2017-1.jpg"
      ],
      highlights: [
        "Consolidación definitiva de la marca ERAM S.R.L. en el mercado nacional",
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
  ], []);

  // Auto rotate images for selected event
  useEffect(() => {
    const interval = setInterval(() => {
      if (pastEvents[selectedEvent]?.images?.length > 1) {
        setCurrentImageIndex(prev => 
          (prev + 1) % pastEvents[selectedEvent].images.length
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedEvent, pastEvents]);

  // Reset image index when changing event
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedEvent]);

  // Handle event selection with smooth transition
  const handleEventChange = (index) => {
    if (index !== selectedEvent) {
      setImageLoading(true);
      setSelectedEvent(index);
      setCurrentImageIndex(0);
      
      // Scroll hacia arriba donde empieza la foto de la feria
      setTimeout(() => {
        const eventDetailsPanel = document.getElementById('event-details-panel');
        if (eventDetailsPanel) {
          // Detectar si es mobile para ajustar el scroll
          const isMobile = window.innerWidth <= 768;
          
          eventDetailsPanel.scrollIntoView({ 
            behavior: 'smooth', 
            block: isMobile ? 'center' : 'start',
            inline: 'nearest'
          });
        }
        setImageLoading(false);
      }, 100);
    }
  };

  // Handle image navigation
  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'exitosa': return 'EXITOSA';
      case 'internacional': return 'INTERNACIONAL';
      case 'fundacional': return 'FUNDACIONAL';
      default: return status.toUpperCase();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'exitosa': return 'var(--success-color)';
      case 'internacional': return 'var(--info-color)';
      case 'fundacional': return 'var(--warning-color)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <section id="past-events" className="past-events-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title">
            Ferias
            <span className="title-highlight"> Participadas</span>
          </h2>
          
          <p className="section-description">
            Descubrí nuestras participaciones más exitosas en las principales ferias del sector. 
            Cada evento representa un hito en nuestro crecimiento y expansión internacional.
          </p>
        </div>

        <div className="events-container">
          {/* Event Selection Cards */}
          <div className="events-selector" data-aos="fade-right" data-aos-delay="200">
            {pastEvents.map((event, index) => (
              <div 
                key={`past-event-${event.id}`}
                className={`event-card ${selectedEvent === index ? 'active' : ''}`}
                onClick={() => handleEventChange(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleEventChange(index)}
                aria-label={`Ver detalles de ${event.name}`}
              >
                <div className="event-card-image">
                  <img 
                    src={event.images[0]} 
                    alt={event.name} 
                    loading="lazy"
                    className="event-thumbnail"
                  />
                  <div 
                    className={`status-badge ${event.status}`}
                    style={{ '--status-color': getStatusColor(event.status) }}
                  >
                    {getStatusLabel(event.status)}
                  </div>
                  <div className="event-overlay"></div>
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

                <div className="event-indicator">
                  <FaChevronRight />
                </div>
              </div>
            ))}
          </div>

          {/* Event Details Panel */}
          <div id="event-details-panel" className="event-details-panel" data-aos="fade-left" data-aos-delay="400">
            {pastEvents[selectedEvent] && (
              <div 
                className={`detail-card ${imageLoading ? 'loading' : ''}`} 
                key={`event-detail-${pastEvents[selectedEvent].id}`}
              >
                {/* Detail Header with Image Gallery */}
                <div className="detail-header">
                  <div className="image-gallery-section">
                    <div className="main-image-container">
                      <img 
                        src={pastEvents[selectedEvent].images[currentImageIndex]} 
                        alt={`${pastEvents[selectedEvent].name} - Imagen ${currentImageIndex + 1}`}
                        className="main-image"
                        loading="lazy"
                      />
                      {pastEvents[selectedEvent].images.length > 1 && (
                        <>
                          <button 
                            className="gallery-nav prev"
                            onClick={() => handleImageChange(
                              currentImageIndex === 0 
                                ? pastEvents[selectedEvent].images.length - 1 
                                : currentImageIndex - 1
                            )}
                            aria-label="Imagen anterior"
                          >
                            <FaChevronLeft />
                          </button>
                          <button 
                            className="gallery-nav next"
                            onClick={() => handleImageChange(
                              (currentImageIndex + 1) % pastEvents[selectedEvent].images.length
                            )}
                            aria-label="Imagen siguiente"
                          >
                            <FaChevronRightIcon />
                          </button>
                          <div className="image-counter">
                            {currentImageIndex + 1} / {pastEvents[selectedEvent].images.length}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {pastEvents[selectedEvent].images.length > 1 && (
                      <div className="image-thumbnails">
                        {pastEvents[selectedEvent].images.map((image, index) => (
                          <button 
                            key={`thumbnail-${index}`}
                            className={`thumbnail-btn ${currentImageIndex === index ? 'active' : ''}`}
                            onClick={() => handleImageChange(index)}
                            aria-label={`Ver imagen ${index + 1}`}
                          >
                            <img 
                              src={image} 
                              alt={`Vista ${index + 1}`} 
                              loading="lazy"
                              className="thumbnail-image"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="event-info-section">
                    <div className="category-badge">
                      <FaIndustry />
                      <span>{pastEvents[selectedEvent].category}</span>
                    </div>
                    
                    <h3 className="event-name">{pastEvents[selectedEvent].name}</h3>
                    
                    <div className="event-metadata">
                      <div className="metadata-item">
                        <FaCalendarAlt className="metadata-icon" />
                        <span>{pastEvents[selectedEvent].year}</span>
                      </div>
                      <div className="metadata-item">
                        <FaMapMarkerAlt className="metadata-icon" />
                        <span>{pastEvents[selectedEvent].location}</span>
                      </div>
                      <div className="metadata-item">
                        <FaUsers className="metadata-icon" />
                        <span>{pastEvents[selectedEvent].attendees} visitantes</span>
                      </div>
                      <div className="metadata-item">
                        <FaBuilding className="metadata-icon" />
                        <span>Stand: {pastEvents[selectedEvent].standSize}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="detail-content">
                  <p className="event-description">
                    {pastEvents[selectedEvent].description}
                  </p>

                  <div className="achievements-section">
                    <h4 className="achievements-title">Logros destacados:</h4>
                    <div className="achievements-grid">
                      {pastEvents[selectedEvent].highlights.map((highlight, index) => (
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
      </div>
    </section>
  );
};

export default PastEvents;
