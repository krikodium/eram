// src/components/FeriasCTA.jsx - Optimized Final Call to Action Section
import React from 'react';
import { 
  FaCalendarAlt, 
  FaEnvelope, 
  FaPhone, 
  FaWhatsapp,
  FaMapMarkerAlt,
  FaGlobe,
  FaUsers,
  FaIndustry
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './FeriasCTA.css';

const FeriasCTA = () => {
  const contactMethods = [
    {
      icon: <FaEnvelope />,
      title: "Email Directo",
      value: "ferias@eram.com.ar",
      action: "mailto:ferias@eram.com.ar",
      description: "Enviá tu consulta directamente a nuestro equipo de ferias"
    },
    {
      icon: <FaWhatsapp />,
      title: "WhatsApp",
      value: "+54 9 11 3374-9000",
      action: "https://wa.me/5491133749000",
      description: "Contactanos por WhatsApp para respuestas inmediatas"
    },
    {
      icon: <FaPhone />,
      title: "Teléfono",
      value: "4753-7846 / 4754-8879",
      action: "tel:+5491147537846",
      description: "Llamanos para coordinar reuniones y visitas"
    }
  ];

  const quickActions = [
    {
      icon: <FaCalendarAlt />,
      title: "Ver Próximas Ferias",
      description: "Conocé dónde nos encontrarás próximamente",
      action: "#upcoming-fairs",
      variant: "primary"
    },
    {
      icon: <FaUsers />,
      title: "Nuestro Equipo",
      description: "Conocé a los profesionales que te atenderán",
      action: "/quienes-somos",
      variant: "secondary"
    },
    {
      icon: <FaIndustry />,
      title: "Ver Productos",
      description: "Explorá nuestro catálogo completo",
      action: "/catalogo",
      variant: "tertiary"
    }
  ];

  return (
    <section id="ferias-cta" className="ferias-cta-section">
      <div className="section-container">
        {/* Background Pattern */}
        <div className="cta-background">
          <div className="cta-pattern"></div>
          <div className="cta-overlay"></div>
        </div>

        {/* Main Content */}
        <div className="cta-content" data-aos="fade-up">
          <div className="cta-header">
            <div className="cta-badge">
              <FaGlobe />
              <span>Conectate con ERAM</span>
            </div>
            
            <h2 className="cta-title">
              ¿Listo para
              <span className="title-highlight">Conectarte?</span>
            </h2>
            
            <p className="cta-description">
              Nuestro equipo está listo para ayudarte a encontrar las mejores soluciones en seguridad industrial. 
              Contactanos hoy mismo y descubrí por qué ERAM es la elección de miles de profesionales.
            </p>
          </div>

          <div className="cta-grid">
            {/* Contact Methods */}
            <div className="contact-methods" data-aos="fade-right" data-aos-delay="200">
              <h3 className="methods-title">Métodos de Contacto</h3>
              <p className="methods-description">
                Elegí la forma que prefieras para contactarnos. Nuestro equipo responderá en menos de 24 horas.
              </p>
              
              <div className="methods-list">
                {contactMethods.map((method, index) => (
                  <a 
                    key={`contact-${index}`}
                    href={method.action}
                    className="contact-method"
                    target={method.action.startsWith('http') ? '_blank' : undefined}
                    rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <div className="method-icon">
                      {method.icon}
                    </div>
                    <div className="method-content">
                      <h4 className="method-title">{method.title}</h4>
                      <div className="method-value">{method.value}</div>
                      <p className="method-description">{method.description}</p>
                    </div>
                    <div className="method-arrow">
                      <FaGlobe />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions" data-aos="fade-left" data-aos-delay="400">
              <h3 className="actions-title">Acciones Rápidas</h3>
              <p className="actions-description">
                Accedé rápidamente a la información que necesitás sobre nuestras participaciones en ferias.
              </p>
              
              <div className="actions-list">
                {quickActions.map((action, index) => (
                  <Link 
                    key={`action-${index}`}
                    to={action.action}
                    className={`quick-action ${action.variant}`}
                  >
                    <div className="action-icon">
                      {action.icon}
                    </div>
                    <div className="action-content">
                      <h4 className="action-title">{action.title}</h4>
                      <p className="action-description">{action.description}</p>
                    </div>
                    <div className="action-arrow">
                      <FaGlobe />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="location-info" data-aos="fade-up" data-aos-delay="600">
            <div className="location-card">
              <div className="location-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="location-content">
                <h4 className="location-title">Visitanos en Nuestras Oficinas</h4>
                <p className="location-address">
                  Av. San Martín 7421, CABA<br />
                  Buenos Aires, Argentina
                </p>
                <div className="location-schedule">
                  <strong>Horarios:</strong> Lun a Vie: 9:00 - 17:00 | Sábados y Domingos: Cerrado
                </div>
              </div>
              <a 
                href="https://maps.google.com/?q=Av.+San+Martín+7421,+CABA"
                target="_blank"
                rel="noopener noreferrer"
                className="location-map-btn"
              >
                <FaGlobe />
                <span>Ver en Mapa</span>
              </a>
            </div>
          </div>

          {/* Final CTA */}
          <div className="final-cta" data-aos="fade-up" data-aos-delay="800">
            <div className="final-cta-content">
              <h3 className="final-cta-title">¿Todavía Tenés Dudas?</h3>
              <p className="final-cta-description">
                Nuestro equipo de especialistas está disponible para responder todas tus consultas 
                sobre productos, ferias o cualquier aspecto de nuestros servicios.
              </p>
              <div className="final-cta-actions">
                <a href="mailto:ferias@eram.com.ar" className="final-cta-btn primary">
                  <FaEnvelope />
                  <span>Enviar Consulta</span>
                </a>
                <a href="https://wa.me/5491133749000" className="final-cta-btn secondary">
                  <FaWhatsapp />
                  <span>Chatear por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeriasCTA;
