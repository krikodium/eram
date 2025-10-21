// src/components/ContactUnified.jsx - Unified Contact Section
import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaWhatsapp,
  FaDirections,
  FaHandshake
} from 'react-icons/fa';
import './ContactUnified.css';

const contactMethods = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Ubicación",
    primary: "Av. San Martín 7421",
    secondary: "CABA, Buenos Aires",
    action: "Ver en Google Maps",
    actionLink: "https://www.google.com/maps?q=Av.+San+Martin+7421+CABA+Buenos+Aires",
    color: "#D32F2F",
    description: "Visitanos en nuestras modernas instalaciones"
  },
  {
    icon: <FaPhone />,
    title: "Teléfonos",
    primary: "4753-7846 / 4754-8879",
    secondary: "Lun a Vie: 9:00 - 17:00",
    action: "Llamar Ahora",
    actionLink: "tel:+541147537846",
    color: "#1976D2",
    description: "Atención personalizada de lunes a viernes"
  },
  {
    icon: <FaWhatsapp />,
    title: "WhatsApp",
    primary: "+54 9 11 3374-9000",
    secondary: "Consultas inmediatas",
    action: "Chatear",
    actionLink: "https://wa.me/5491133749000",
    color: "#25D366",
    description: "Consultas inmediatas"
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    primary: "ventas@eram.com.ar",
    secondary: "Mail de contacto",
    action: "Enviar Email",
    actionLink: "mailto:ventas@eram.com.ar",
    color: "#FF6B35",
    description: "Soporte técnico especializado"
  }
];


function ContactUnified() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section className="contact-unified-section" id="contacto">
      <div className="contact-unified-container">
        
        {/* Header Section */}
        <div className="contact-unified-header">
          <div className="section-badge">
            <FaHandshake className="badge-icon" />
            <span>Contactanos</span>
          </div>
          
          <h2 className="contact-unified-title">
            Estamos aquí para
            <span className="title-highlight">Ayudarte</span>
          </h2>
          
          <p className="contact-unified-subtitle">
            Nuestro equipo de expertos está listo para brindarte el mejor asesoramiento 
            y acompañarte en cada paso de tu compra.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="contact-methods">
          {contactMethods.map((method, index) => (
            <div 
              key={index} 
              className="contact-method-card"
              style={{ '--method-color': method.color }}
            >
              <div className="contact-method-inner">
                <div className="method-icon">
                  {method.icon}
                </div>
                
                <div className="method-content">
                  <h3 className="method-title">{method.title}</h3>
                  <p className="method-description">{method.description}</p>
                  
                  <div className="method-details">
                    <div className="method-primary">{method.primary}</div>
                    <div className="method-secondary">{method.secondary}</div>
                  </div>
                  
                  <a 
                    href={method.actionLink} 
                    className="method-action"
                    target={method.actionLink.startsWith('http') ? '_blank' : undefined}
                    rel={method.actionLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {method.action}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="contact-main-content">
          
          {/* Location Header */}
          <div className="contact-location-header">
            <div className="location-title">
              <FaMapMarkerAlt />
              <span>UBICACIÓN</span>
            </div>
          </div>

          {/* Tab Content */}
          <div className="contact-tab-content">
            
            {/* Ubicación Content */}
            <div className="contact-tab-panel ubicacion-panel">
                <div className="map-section">
                  <div className="map-container">
                    <div className="map-wrapper">
                      {!mapLoaded && (
                        <div className="map-loading">
                          <div className="loading-spinner"></div>
                          <span>Cargando mapa...</span>
                        </div>
                      )}
                      <iframe
                        title="Ubicación ERAM S.R.L. - Av. San Martín 7421, CABA, Buenos Aires"
                        src="https://maps.google.com/maps?q=Av%20San%20Martin%207421%2C%20CABA%2C%20Buenos%20Aires%2C%20Argentina&output=embed&z=16"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        onLoad={() => setMapLoaded(true)}
                        className={mapLoaded ? 'loaded' : ''}
                        style={{
                          filter: 'grayscale(20%) contrast(110%) saturate(120%)',
                          borderRadius: '16px'
                        }}
                      />
                    </div>
                    
                    <div className="map-info">
                      <div className="location-header">
                        <h4>📍 Ubicación</h4>
                        <p><strong>ERAM S.R.L.</strong><br/>Av. San Martín 7421<br/>C1424 CABA, Buenos Aires</p>
                      </div>
                      
                      <div className="contact-details">
                        <h5>Información de Contacto</h5>
                        <div className="contact-item">
                          <strong>📞 Teléfonos:</strong><br/>
                          4753-7846 / 4754-8879
                        </div>
                        <div className="contact-item">
                          <strong>📧 Email:</strong><br/>
                          ventas@eram.com.ar
                        </div>
                        <div className="contact-item">
                          <strong>🕒 Horarios:</strong><br/>
                          Lun a Vie: 9:00 - 17:00
                        </div>
                      </div>
                      
                      <div className="map-actions">
                        <a 
                          href="https://www.google.com/maps/dir//Av.+San+Martin+7421+CABA+Buenos+Aires"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="directions-btn primary"
                        >
                          <FaDirections />
                          Cómo llegar
                        </a>
                        <a 
                          href="https://wa.me/5491133749000"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="directions-btn secondary"
                        >
                          <FaWhatsapp />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* CTA removed as requested */}
      </div>
    </section>
  );
}

export default ContactUnified;

