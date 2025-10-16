// src/components/BrandBenefits.jsx - Enhanced Feature Cards
import { FaShippingFast, FaBoxes, FaHeadset } from 'react-icons/fa';
import './BrandBenefits.css';

const benefits = [
  {
    icon: <FaShippingFast />,
    title: 'Envíos en 24hs',
    description: 'Logística ágil y envíos a todo el país con seguimiento completo.',
    color: '#D32F2F',
    bgColor: 'rgba(211, 47, 47, 0.1)'
  },
  
  {
    icon: <FaBoxes />,
    title: 'Stock Permanente',
    description: 'Disponibilidad continua de productos esenciales para tu industria.',
    color: '#D32F2F',
    bgColor: 'rgba(211, 47, 47, 0.1)'
  },
  {
    icon: <FaHeadset />,
    title: 'Asesoramiento Técnico',
    description: 'Especialistas que te acompañan en cada etapa de tu compra.',
    color: '#D32F2F',
    bgColor: 'rgba(211, 47, 47, 0.1)'
  },
];

function BrandBenefits() {
  return (
    <section className="brand-benefits-section">
      <div className="benefits-container">
        <div className="benefits-header">
          <h2 className="benefits-title">
            ¿Por qué elegir
            <span className="title-highlight">ERAM S.R.L.? </span>
          </h2>
          <p className="benefits-description">
            Más de 20 años de experiencia nos respaldan como líderes en seguridad industrial. 
            Nuestros productos cuentan con certificados y licencias IRAM y certificado UL de Argentina.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div 
              className="benefit-card" 
              key={index}
              style={{
                '--benefit-color': benefit.color,
                '--benefit-bg': benefit.bgColor
              }}
            >
              <div className="benefit-card-inner">
                <div className="benefit-gradient-overlay"></div>
                
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon">
                    {benefit.icon}
                  </div>
                  <div className="benefit-icon-glow"></div>
                </div>
                
                <div className="benefit-content">
                  <h4 className="benefit-title">{benefit.title}</h4>
                  <p className="benefit-description">{benefit.description}</p>
                </div>

                <div className="benefit-hover-indicator">
                  <div className="hover-line"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandBenefits;
