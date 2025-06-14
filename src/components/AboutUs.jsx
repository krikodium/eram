import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <section className="aboutus-section">
      <div className="aboutus-content">
        <div className="aboutus-text">
          <h2 className="aboutus-title">Quiénes Somos</h2>
          <p className="aboutus-description">
            En ERAM contamos con más de <strong>20 años de experiencia</strong> en el sector de la seguridad industrial,
            brindando soluciones de protección personal en los más diversos rubros: construcción, logística, industria pesada,
            alimenticia y laboratorios. <br /><br />
            Participamos activamente en <strong>ferias nacionales e internacionales</strong> como ExpoFerretera, Intersec y A+A Düsseldorf, lo que nos permite estar a la vanguardia de la tecnología y normativas del sector. 
            <br /><br />
            Nuestra misión es garantizar la seguridad del trabajador con productos certificados, atención personalizada y un enfoque integral.
          </p>
        </div>

        <div className="aboutus-gallery">
          <img src="eram-frontend\public\industria.jpg" alt="Industria" />
          <img src="eram-frontend\public\equipo.jpg" alt="Nuestro equipo" />
          <img src="eram-frontend\public\feria.jpg" alt="Stand en feria" />
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
