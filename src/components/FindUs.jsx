import React from 'react';
import './FindUs.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

function FindUs() {
  return (
    <section className="findus-section">
      <div className="findus-container">
        <h2 className="findus-title">
          <FaMapMarkerAlt className="findus-icon" /> Encontranos
        </h2>
        <p className="findus-description">
          Nuestra sede central está ubicada en San Martín, Buenos Aires. Te esperamos para asesorarte de forma personalizada.
        </p>
        <div className="map-container">
          <iframe
            title="Ubicación ERAM"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13127.223152964826!2d-58.5463279!3d-34.5668501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb8301059d3cf%3A0x2cb12c5411cfa34a!2sERAM!5e0!3m2!1ses-419!2sar!4v1718200000000!5m2!1ses-419!2sar"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default FindUs;
