// src/components/VisitBenefits.jsx - Optimized Visit Benefits Section
import React from 'react';
import { 
  FaShieldAlt, 
  FaHandshake, 
  FaLightbulb, 
  FaUsers,
  FaGift,
  FaGlobe,
  FaHeadset,
  FaCalendarAlt,
  FaEnvelope
} from 'react-icons/fa';
import './VisitBenefits.css';

const VisitBenefits = () => {
  const benefits = [
    {
      id: 1,
      icon: <FaShieldAlt />,
      title: "Protección Garantizada",
      description: "Toda nuestra línea cumple con estrictos estándares de seguridad y calidad.",
      highlight: "Calidad Comprobada"
    },
    {
      id: 2,
      icon: <FaHandshake />,
      title: "Asesoramiento Experto",
      description: "Nuestro equipo técnico especializado te guía en la selección del producto ideal para tu necesidad.",
      highlight: "Soporte 24/7"
    },
    {
      id: 3,
      icon: <FaLightbulb />,
      title: "Innovación Constante",
      description: "Descubrí las últimas tecnologías en seguridad industrial y protección personal.",
      highlight: "R&D Propio"
    },
    {
      id: 4,
      icon: <FaUsers />,
      title: "Red de Distribuidores",
      description: "Accedé a nuestra red nacional e internacional de distribuidores certificados.",
      highlight: "15+ Países"
    },
    {
      id: 5,
      icon: <FaGift />,
      title: "Promociones Exclusivas",
      description: "Aprovechá descuentos especiales y ofertas únicas solo para visitantes de ferias.",
      highlight: "Hasta 30% OFF"
    },
    {
      id: 6,
      icon: <FaHeadset />,
      title: "Capacitación Gratuita",
      description: "Entrenamiento sobre el uso correcto de nuestros productos.",
      highlight: "Incluida"
    },
    
    {
      id: 8,
      icon: <FaHeadset />,
      title: "Soporte Post-Venta",
      description: "Accedé a nuestro servicio técnico especializado y garantía extendida.",
      highlight: "Garantía 2 Años"
    }
  ];

  return (
    <section id="visit-benefits" className="visit-benefits-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header" data-aos="fade-up">
          <div className="section-badge">
            <FaUsers />
            <span>¿Por Qué Visitarnos?</span>
          </div>
          
          <h2 className="section-title">
            Beneficios
            <span className="title-highlight">Exclusivos</span>
          </h2>
          
          <p className="section-description">
            Descubrí por qué miles de profesionales eligen visitar nuestro stand en cada feria. 
            Ofrecemos experiencias únicas que van más allá de solo mostrar productos.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid" data-aos="fade-up" data-aos-delay="200">
          {benefits.map((benefit, index) => (
            <div 
              key={`benefit-${benefit.id}`}
              className="benefit-card"
              data-aos="zoom-in" 
              data-aos-delay={300 + (index * 100)}
            >
              <div className="benefit-card-inner">
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon">
                    {benefit.icon}
                  </div>
                </div>
                
                <div className="benefit-content">
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                  <div className="benefit-highlight">
                    {benefit.highlight}
                  </div>
                </div>

                <div className="benefit-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="benefits-cta" data-aos="fade-up" data-aos-delay="800">
          <div className="cta-content">
            <h3 className="cta-title">¿Listo para experimentar la diferencia ERAM S.R.L.?</h3>
            <p className="cta-description">
              Visitá nuestro stand en la próxima feria y descubrí por qué somos líderes en seguridad industrial
            </p>
            <div className="cta-actions">
              <a href="#upcoming-fairs" className="cta-btn primary">
                <FaCalendarAlt />
                <span>Ver Próximas Ferias</span>
              </a>
              <a href="mailto:ferias@eram.com.ar" className="cta-btn secondary">
                <FaEnvelope />
                <span>Contactar Equipo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitBenefits;
