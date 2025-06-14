import React from 'react';
import './AboutUs.css';

// 1. Creamos una estructura de datos para la galería.
// Así es más fácil de mantener y agregar nuevos ítems en el futuro.
const galleryItems = [
  {
    image: '/industria.jpg',
    title: 'Logística y Stock Permanente',
    description: 'Contamos con un centro de distribución moderno que garantiza la disponibilidad y entrega ágil de nuestros productos en todo el país.'
  },
  {
    image: '/equipo.jpg',
    title: 'Protección para Cada Trabajador',
    description: 'Nuestros productos están certificados bajo estrictas normas de seguridad para ofrecer la máxima protección y confianza en cada tarea.'
  },
  {
    image: '/feria.jpg',
    title: 'Presencia en Ferias Internacionales',
    description: 'Participamos en los eventos más importantes del sector, como A+A Düsseldorf, para estar siempre a la vanguardia en tecnología y normativas.'
  }
];

function AboutUs() {
  return (
    <section className="aboutus-section">
      {/* 2. Texto introductorio, ahora centrado y destacado */}
      <div className="aboutus-intro-text">
        <h2 className="aboutus-title">Quiénes Somos</h2>
        <p className="aboutus-description">
          En ERAM contamos con más de <strong>20 años de experiencia</strong> en el sector de la seguridad industrial, brindando soluciones integrales de protección personal para los más diversos rubros e industrias.
        </p>
      </div>

      {/* 3. Nueva galería de tarjetas responsiva */}
      <div className="aboutus-gallery-grid">
        {galleryItems.map((item, index) => (
          <div className="gallery-card" key={index}>
            <img src={item.image} alt={item.title} className="gallery-card-img" />
            <div className="gallery-card-content">
              <h3 className="gallery-card-title">{item.title}</h3>
              <p className="gallery-card-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AboutUs;