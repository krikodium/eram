// src/components/FindUs.jsx - Ultra Professional Find Us Section
import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaWhatsapp,
  FaDirections,
  FaBuilding,
  FaParking,
  FaRoute,
  FaInfoCircle
} from 'react-icons/fa';
import './FindUs.css';

const contactInfo = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Dirección",
    primary: "Av. Industria 1234",
    secondary: "San Martín, Buenos Aires",
    action: "Ver en Google Maps",
    actionLink: "https://www.google.com/maps?q=Av.+Industria+1234+San+Martin+Buenos+Aires",
    color: "#D32F2F"
  },
  {
    icon: <FaPhone />,
    title: "Teléfono",
    primary: "+54 11 4567-8900",
    secondary: "Lun a Vie: 8:00 - 18:00",
    action: "Llamar Ahora",
    actionLink: "tel:+541145678900",
    color: "#1976D2"
  },
  {
    icon: <FaWhatsapp />,
    title: "WhatsApp",
    primary: "+54 9 11 2345-6789",
    secondary: "Consultas inmediatas",
    action: "Chatear",
    actionLink: "https://wa.me/5491123456789",
    color: "#25D366"
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    primary: "ventas@eram.com.ar",
    secondary: "info@eram.com.ar",
    action: "Enviar Email",
    actionLink: "mailto:ventas@eram.com.ar",
    color: "#FF6B35"
  }
];

const facilityFeatures = [
  { icon: <FaBuilding />, text: "Showroom de 500m²" },
  { icon: <FaParking />, text: "Estacionamiento gratuito" },
  { icon: <FaRoute />, text: "Fácil acceso desde autopistas" },
  { icon: <FaInfoCircle />, text: "Asesoramiento técnico presencial" }
];

function FindUs() {
  const [activeTab, setActiveTab] = useState('ubicacion');
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className="findus-section" id="findus">
      <div className="findus-container">
        
        {/* Header Section */}
        <div className="findus-header">
          <div className="section-badge">
            <FaMapMarkerAlt />
            <span>Visitanos</span>
          </div>
          
          <h2 className="findus-title">
            Nuestra Sede en
            <span className="title-highlight">Buenos Aires</span>
          </h2>
          
          <p className="findus-subtitle">
            Te esperamos en nuestras modernas instalaciones para brindarte 
            asesoramiento personalizado y conocer toda nuestra línea de productos.
          </p>
        </div>

        {/* Main Content */}
        <div className="findus-content">
          
          {/* Contact Cards */}
          <div className="contact-cards">
            {contactInfo.map((contact, index) => (
              <div 
                key={index} 
                className="contact-card"
                style={{ '--contact-color': contact.color }}
              >
                <div className="contact-icon">
                  {contact.icon}
                </div>
                <div className="contact-info">
                  <h4>{contact.title}</h4>
                  <div className="contact-primary">{contact.primary}</div>
                  <div className="contact-secondary">{contact.secondary}</div>
                  <a 
                    href={contact.actionLink} 
                    className="contact-action"
                    target={contact.actionLink.startsWith('http') ? '_blank' : undefined}
                    rel={contact.actionLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {contact.action}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Map and Info Section */}
          <div className="location-section">
            
            {/* Tab Navigation */}
            <div className="location-tabs">
              <button 
                className={`tab-button ${activeTab === 'ubicacion' ? 'active' : ''}`}
                onClick={() => handleTabChange('ubicacion')}
              >
                <FaMapMarkerAlt />
                Ubicación
              </button>
              <button 
                className={`tab-button ${activeTab === 'instalaciones' ? 'active' : ''}`}
                onClick={() => handleTabChange('instalaciones')}
              >
                <FaBuilding />
                Instalaciones
              </button>
              <button 
                className={`tab-button ${activeTab === 'horarios' ? 'active' : ''}`}
                onClick={() => handleTabChange('horarios')}
              >
                <FaClock />
                Horarios
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              
              {/* Ubicación Tab */}
              {activeTab === 'ubicacion' && (
                <div className="tab-panel ubicacion-panel">
                  <div className="map-container">
                    <div className="map-wrapper">
                      {!mapLoaded && (
                        <div className="map-loading">
                          <div className="loading-spinner"></div>
                          <span>Cargando mapa...</span>
                        </div>
                      )}
                      <iframe
                        title="Ubicación ERAM - San Martín, Buenos Aires"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13127.223152964826!2d-58.5463279!3d-34.5668501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb8301059d3cf%3A0x2cb12c5411cfa34a!2sERAM!5e0!3m2!1ses-419!2sar!4v1718200000000!5m2!1ses-419!2sar"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        onLoad={() => setMapLoaded(true)}
                        className={mapLoaded ? 'loaded' : ''}
                      />
                    </div>
                    
                    <div className="map-info">
                      <h4>¿Cómo llegar?</h4>
                      <ul>
                        <li><strong>En Auto:</strong> Acceso directo desde Panamericana</li>
                        <li><strong>En Tren:</strong> Estación San Martín (Línea Mitre)</li>
                        <li><strong>En Colectivo:</strong> Líneas 21, 57, 175</li>
                      </ul>
                      
                      <a 
                        href="https://www.google.com/maps/dir//Av.+Industria+1234+San+Martin+Buenos+Aires"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="directions-btn"
                      >
                        <FaDirections />
                        Cómo llegar
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Instalaciones Tab */}
              {activeTab === 'instalaciones' && (
                <div className="tab-panel instalaciones-panel">
                  <div className="facility-grid">
                    <div className="facility-image">
                      <img src="/industria.jpg" alt="Instalaciones ERAM" loading="lazy" />
                      <div className="facility-overlay">
                        <h4>Instalaciones Modernas</h4>
                        <p>Diseñadas para brindarte la mejor experiencia</p>
                      </div>
                    </div>
                    
                    <div className="facility-info">
                      <h4>Nuestras Instalaciones</h4>
                      <p>
                        Contamos con un moderno showroom donde podrás ver y probar 
                        todos nuestros productos de seguridad industrial.
                      </p>
                      
                      <div className="facility-features">
                        {facilityFeatures.map((feature, index) => (
                          <div key={index} className="facility-feature">
                            <span className="feature-icon">{feature.icon}</span>
                            <span className="feature-text">{feature.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Horarios Tab */}
              {activeTab === 'horarios' && (
                <div className="tab-panel horarios-panel">
                  <div className="schedule-grid">
                    <div className="schedule-card">
                      <h4>Horarios de Atención</h4>
                      <div className="schedule-list">
                        <div className="schedule-item">
                          <span className="day">Lunes a Viernes</span>
                          <span className="time">8:00 - 18:00</span>
                        </div>
                        <div className="schedule-item">
                          <span className="day">Sábados</span>
                          <span className="time">9:00 - 13:00</span>
                        </div>
                        <div className="schedule-item closed">
                          <span className="day">Domingos</span>
                          <span className="time">Cerrado</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="schedule-card">
                      <h4>Servicios Disponibles</h4>
                      <ul className="services-list">
                        <li>Asesoramiento técnico personalizado</li>
                        <li>Prueba de equipos de protección</li>
                        <li>Capacitación en uso correcto</li>
                        <li>Retiro de productos en sucursal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="findus-cta">
          <h3>¿Listo para visitarnos?</h3>
          <p>Nuestro equipo de expertos está esperándote</p>
          <div className="cta-buttons">
            <a href="https://wa.me/5491123456789" className="cta-btn primary">
              <FaWhatsapp />
              Consultar Ahora
            </a>
            <a href="mailto:ventas@eram.com.ar" className="cta-btn secondary">
              <FaEnvelope />
              Solicitar Cita
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FindUs;

export default FindUs;
