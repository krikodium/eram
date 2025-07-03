// src/pages/QuienesSomos.jsx
import React from 'react';
import './QuienesSomos.css';
import { FaRegLightbulb, FaHandshake, FaShieldAlt } from 'react-icons/fa';

function QuienesSomos() {
  return (
    <section className="qs-section">
      {/* ENCABEZADO */}
      <div className="qs-header" data-aos="fade-up">
        <h1>Quiénes Somos</h1>
        <p>
          Somos ERAM, una empresa con más de 20 años dedicados a la protección industrial y laboral en Argentina.
          Brindamos soluciones profesionales de alta calidad para todo tipo de industrias.
        </p>
      </div>

      {/* HISTORIA + MISIÓN + VISIÓN */}
      <div className="qs-columns" data-aos="fade-up" data-aos-delay="100">
        <div className="qs-block">
          <h3>Historia</h3>
          <p>
            Fundada en el año 2002, ERAM nació con la misión de elevar los estándares de seguridad en el trabajo.
            Desde entonces, hemos crecido junto a nuestros clientes, incorporando tecnología, normativas y soluciones a medida.
          </p>
        </div>
        <div className="qs-block">
          <h3>Misión</h3>
          <p>
            Proteger al trabajador. Brindamos productos confiables, asesoramiento técnico y stock permanente para garantizar la seguridad operativa en cada etapa de producción.
          </p>
        </div>
        <div className="qs-block">
          <h3>Visión</h3>
          <p>
            Ser referentes en soluciones de protección industrial en Latinoamérica, promoviendo una cultura de prevención moderna, ágil y transparente.
          </p>
        </div>
      </div>

      {/* VALORES */}
      <div className="qs-valores" data-aos="fade-up" data-aos-delay="200">
        <h2>Nuestros Valores</h2>
        <div className="qs-icon-grid">
          <div className="qs-icon-card">
            <FaRegLightbulb className="qs-icon" />
            <h4>Innovación</h4>
            <p>Nos adaptamos constantemente a las nuevas tecnologías y exigencias del mercado.</p>
          </div>
          <div className="qs-icon-card">
            <FaHandshake className="qs-icon" />
            <h4>Compromiso</h4>
            <p>Trabajamos con responsabilidad y ética, priorizando la confianza con nuestros clientes.</p>
          </div>
          <div className="qs-icon-card">
            <FaShieldAlt className="qs-icon" />
            <h4>Seguridad</h4>
            <p>Es nuestro eje central. Garantizamos productos certificados y un servicio que cuida a las personas.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuienesSomos;
