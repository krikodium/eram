// src/components/AboutUsSnippet.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUsSnippet.css'; // Su propia hoja de estilos

// Usamos una imagen de placeholder. La ideal sería una del equipo, oficina o un proyecto.
import aboutImage from 'eram-frontend\public\about-us-placeholder.jpg'; 

function AboutUsSnippet() {
  return (
    <section className="about-us-snippet">
      <div className="container">
        <div className="about-us-layout">
          
          {/* --- Columna de la Imagen --- */}
          <div className="about-us-image">
            <img src={aboutImage} alt="Equipo de ERAM trabajando" />
          </div>

          {/* --- Columna del Texto --- */}
          <div className="about-us-text">
            <h2>Más de 20 Años Protegiendo a la Industria</h2>
            <p>
              En ERAM, no solo proveemos equipos; ofrecemos tranquilidad. Con una trayectoria sólida en el mercado, entendemos las complejidades y los riesgos de su entorno de trabajo. Nuestro compromiso es brindarle soluciones de seguridad que no solo cumplen con las normativas más exigentes, sino que también garantizan el bienestar y la productividad de su personal.
            </p>
            <p>
              Somos su socio estratégico en la prevención de riesgos y la creación de un ambiente laboral más seguro.
            </p>
            <Link to="/quienes-somos" className="btn btn-secondary">
              Conocer Nuestra Historia
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutUsSnippet;