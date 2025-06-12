import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPumpSoap, FaShoePrints, FaDeaf, FaEye, FaTshirt,
  FaHardHat, FaShower, FaTools, FaHandsWash, FaLightbulb,
  FaLock, FaUserShield, FaHeadSideMask, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import { GiGloves } from 'react-icons/gi';
import './CategoryIcons.css';

const categories = [
  { icon: <FaPumpSoap />, name: 'Absorbentes y Desengrasantes', id: 11 },
  { icon: <FaShoePrints />, name: 'Calzado de Seguridad', id: 9 },
  { icon: <FaLightbulb />, name: 'Detectores de Gases', id: 17 },
  { icon: <FaShower />, name: 'Duchas y Lavaojos de Emergencia', id: 16 },
  { icon: <FaTools />, name: 'Equipos Autónomos', id: 15 },
  { icon: <FaHandsWash />, name: 'Ergonómicos', id: 14 },
  { icon: <GiGloves />, name: 'Guantes de Seguridad', id: 1 },
  { icon: <FaTshirt />, name: 'Indumentaria', id: 7 },
  { icon: <FaPumpSoap />, name: 'Manipulación de Hidrocarburos', id: 8 },
  { icon: <FaHandsWash />, name: 'Pañós de Limpieza', id: 13 },
  { icon: <FaDeaf />, name: 'Protección Auditiva', id: 5 },
  { icon: <FaHardHat />, name: 'Protección Craneana', id: 12 },
  { icon: <FaUserShield />, name: 'Protección Facial', id: 4 },
  { icon: <FaEye />, name: 'Protección Ocular', id: 6 },
  { icon: <FaHeadSideMask />, name: 'Protección Respiratoria', id: 3 },
  { icon: <FaLightbulb />, name: 'Señalización y Linternas', id: 10 },
  { icon: <FaLock />, name: 'Sistemas de Bloqueo', id: 2 },
];

function CategoryIcons() {
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="category-scroll-container">
      <button className="scroll-arrow left" onClick={() => scroll('left')}>
        <FaArrowLeft />
      </button>

      <div className="category-grid-scroll" ref={scrollRef}>
        {categories.map((cat, index) => (
          <Link
            to={`/catalogo?categoria_id=${cat.id}`}
            className="category-card"
            key={index}
          >
            <div className="category-icon">{cat.icon}</div>
            <span className="category-name">{cat.name}</span>
          </Link>
        ))}
      </div>

      <button className="scroll-arrow right" onClick={() => scroll('right')}>
        <FaArrowRight />
      </button>
    </div>
  );
}

export default CategoryIcons;
