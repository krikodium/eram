import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPumpSoap, FaShoePrints, FaDeaf, FaEye, FaTshirt,
  FaHardHat, FaShower, FaTools, FaHandsWash, FaLightbulb,
  FaLock, FaUserShield, FaHeadSideMask, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import { GiGloves } from 'react-icons/gi';
import './CategoryIcons.css';

const categories = [ /* ... */ ];

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
    <section className="category-icons-section">
      <div className="category-wrapper">
        <h2 className="section-title">Nuestras Categorías</h2>
        <p className="section-subtitle">Explorá nuestras líneas de protección profesional</p>

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
      </div>
    </section>
  );
}

export default CategoryIcons;
