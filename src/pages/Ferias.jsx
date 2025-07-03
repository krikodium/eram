import React from 'react';
import './Ferias.css';
import feria1 from '../assets/feria1.jpg';
import feria2 from '../assets/feria2.jpg';
import feria3 from '../assets/feria3.jpg';

const ferias = [
  {
    id: 1,
    nombre: "Expo Seguridad Industrial 2025",
    fecha: "15 - 18 Mayo 2025",
    lugar: "La Rural, Buenos Aires",
    descripcion: "Presentamos nuestras nuevas líneas de protección personal y sistemas de seguridad vial.",
    imagen: feria1,
  },
  {
    id: 2,
    nombre: "Feria Internacional del Trabajo Seguro",
    fecha: "10 - 12 Junio 2025",
    lugar: "Centro Costa Salguero",
    descripcion: "Compartimos innovaciones tecnológicas en señalización industrial y productos reflectivos.",
    imagen: feria2,
  },
  {
    id: 3,
    nombre: "Expo Emergencias y Primeros Auxilios",
    fecha: "5 - 7 Septiembre 2025",
    lugar: "Predio Ferial Córdoba",
    descripcion: "Destacamos nuestros kits de emergencia, botiquines y elementos para primeros auxilios.",
    imagen: feria3,
  },
];

const Ferias = () => {
  return (
    <section className="ferias-container">
      <div className="ferias-header" data-aos="fade-up">
        <h1>Nuestras Ferias</h1>
        <p>
          A lo largo del año participamos en diversas exposiciones nacionales e internacionales,
          mostrando nuestras líneas de productos y conectando con clientes de todo el país.
        </p>
      </div>

      <div className="ferias-grid">
        {ferias.map(feria => (
          <div className="feria-card" key={feria.id} data-aos="fade-up">
            <img src={feria.imagen} alt={feria.nombre} className="feria-img" />
            <div className="feria-info">
              <h3>{feria.nombre}</h3>
              <p className="feria-fecha">{feria.fecha} — <span>{feria.lugar}</span></p>
              <p className="feria-descripcion">{feria.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Ferias;
