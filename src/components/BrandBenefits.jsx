// src/components/BrandBenefits.jsx
import { FaShippingFast, FaCertificate, FaBoxes, FaHeadset } from 'react-icons/fa';
import './BrandBenefits.css';

const benefits = [
  {
    icon: <FaShippingFast />,
    title: 'Envíos en 24hs',
    description: 'Logística ágil y envíos a todo el país.',
  },
  {
    icon: <FaCertificate />,
    title: 'Certificaciones IRAM',
    description: 'Productos que cumplen normas de seguridad industrial.',
  },
  {
    icon: <FaBoxes />,
    title: 'Stock Permanente',
    description: 'Disponibilidad continua de productos esenciales.',
  },
  {
    icon: <FaHeadset />,
    title: 'Asesoramiento Técnico',
    description: 'Especialistas que te acompañan en tu compra.',
  },
];

function BrandBenefits() {
  return (
    <section className="brand-benefits">
      <div className="benefits-container">
        {benefits.map((benefit, index) => (
          <div className="benefit-card" key={index}>
            <div className="benefit-icon">{benefit.icon}</div>
            <h4>{benefit.title}</h4>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandBenefits;
