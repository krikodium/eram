// src/components/UpcomingFairs.jsx - Optimized Upcoming Fairs Section
import React, { useState, useMemo } from 'react';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaIndustry, 
  FaUsers, 
  FaBuilding,
  FaChevronRight,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaEye
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './UpcomingFairs.css';

const UpcomingFairs = () => {
  const [selectedFair, setSelectedFair] = useState(0);

  // Memoized upcoming fairs data
  const upcomingFairs = useMemo(() => [
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
  ], []);

  // Handle upcoming fair selection
  const handleFairChange = (index) => {
    if (index !== selectedFair) {
      setSelectedFair(index);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'featured': return 'DESTACADA';
      case 'upcoming': return 'PRÓXIMA';
      default: return status.toUpperCase();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'featured': return 'var(--warning-color)';
      case 'upcoming': return 'var(--info-color)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <section id="upcoming-fairs" className="upcoming-fairs-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title">
            Ferias por
            <span className="title-highlight"> Venir</span>
          </h2>
          <p className="section-description">
            Próximas participaciones donde presentaremos novedades, demos y asesoramiento técnico.
          </p>
        </div>

        <div className="upcoming-container">
          {/* Fair Selection Cards */}
          <div className="upcoming-selector" data-aos="fade-right" data-aos-delay="200">
            {upcomingFairs.map((fair, index) => (
              <div 
                key={`upcoming-fair-${fair.id}`}
                className={`upcoming-card ${selectedFair === index ? 'active' : ''}`}
                onClick={() => handleFairChange(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleFairChange(index)}
                aria-label={`Ver detalles de ${fair.name}`}
              >
                <div className="upcoming-card-image">
                  <img 
                    src={fair.image} 
                    alt={fair.name} 
                    loading="lazy"
                    className="fair-thumbnail"
                  />
                  <div 
                    className={`status-badge ${fair.status}`}
                    style={{ '--status-color': getStatusColor(fair.status) }}
                  >
                    <FaStar />
                    <span>{getStatusLabel(fair.status)}</span>
                  </div>
                  <div className="fair-overlay"></div>
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

                <div className="upcoming-indicator">
                  <FaChevronRight />
                </div>
              </div>
            ))}
          </div>

          {/* Selected Fair Details */}
          <div className="upcoming-details-panel" data-aos="fade-left" data-aos-delay="400">
            {upcomingFairs[selectedFair] && (
              <div className="upcoming-detail-card" key={`upcoming-detail-${upcomingFairs[selectedFair].id}`}>
                <div className="upcoming-header">
                  <div className="upcoming-image">
                    <img 
                      src={upcomingFairs[selectedFair].image} 
                      alt={upcomingFairs[selectedFair].name} 
                      loading="lazy"
                      className="fair-main-image"
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
                    <Link to="/catalogo" className="action-btn tertiary">
                      <FaEye />
                      <span>Ver Productos</span>
                    </Link>
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

export default UpcomingFairs;
