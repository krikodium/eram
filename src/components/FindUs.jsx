// src/components/FindUs.jsx - Ultra Professional Find Us Section
import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaWhatsapp,
  FaDirections
} from 'react-icons/fa';
import './FindUs.css';

const contactInfo = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Dirección",
    primary: "Av. San Martín 7421",
    secondary: "CABA, Buenos Aires",
    action: "Ver en Google Maps",
    actionLink: "https://www.google.com/maps?q=Av.+San+Martin+7421+CABA+Buenos+Aires",
    color: "#D32F2F"
  },
  {
    icon: <FaPhone />,
    title: "Teléfonos",
    primary: "4753-7846 / 4754-8879",
    secondary: "Lun a Vie: 9:00 - 17:00",
    action: "Llamar Ahora",
    actionLink: "tel:+541147537846",
    color: "#1976D2"
  },
  {
    icon: <FaWhatsapp />,
    title: "WhatsApp",
    primary: "+54 9 11 3374-9000",
    secondary: "Consultas inmediatas",
    action: "Chatear",
    actionLink: "https://wa.me/5491133749000",
    color: "#25D366"
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    primary: "ventas@eram.com.ar",
    secondary: "Mail de contacto",
    action: "Enviar Email",
    actionLink: "mailto:ventas@eram.com.ar",
    color: "#FF6B35"
  }
];

function FindUs() {
  const [mapLoaded, setMapLoaded] = useState(false);

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
            
            {/* Location Header */}
            <div className="location-header">
              <div className="location-title">
                <FaMapMarkerAlt />
                <span>UBICACIÓN</span>
              </div>
            </div>

            {/* Location Content */}
            <div className="tab-content">
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
                      <div className="location-marker">
                        <div className="marker-icon">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="marker-info">
                          <h4>📍 Ubicación</h4>
                          <p><strong>ERAM S.R.L.</strong><br/>Av. San Martín 7421<br/>C1424 CABA, Buenos Aires</p>
                        </div>
                      </div>
                      
                      <div className="directions-section">
                        <h5>¿Cómo llegar?</h5>
                        <ul>
                          <li><strong>🚗 En Auto:</strong> Av. San Martín 7421, CABA</li>
                          <li><strong>🚂 En Tren:</strong> Estación San Martín (Línea Mitre)</li>
                          <li><strong>🚌 En Colectivo:</strong> Líneas 21, 57, 175</li>
                          <li><strong>🚇 En Subte:</strong> Línea B - Estación San Martín</li>
                        </ul>
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
                          href="https://www.google.com/maps/place/Av.+San+Mart%C3%ADn+7421,+C1424+CABA/@-34.5668501,-58.5463279,17z"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="directions-btn secondary"
                        >
                          <FaMapMarkerAlt />
                          Ver en Maps
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="findus-cta">
          <h3>¿Listo para visitarnos?</h3>
          <p>Nuestro equipo de expertos está esperándote</p>
          <div className="cta-buttons">
            <a href="https://wa.me/5491133749000" className="cta-btn primary">
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
