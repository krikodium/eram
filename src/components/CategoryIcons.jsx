import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './CategoryIcons.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CategoryIcons = () => {
  const [categorias, setCategorias] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('/api/categorias');
        const data = Array.isArray(response.data) ? response.data : [];
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategorias([]); // protección extra
      }
    };

    fetchCategorias();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
    console.log("CATEGORÍAS RECIBIDAS:", categorias);
  };

  return (
    <section className="category-scroll-container">
      <div className="category-wrapper">
        <div className="category-grid-scroll" ref={scrollRef}>
          {Array.isArray(categorias) && categorias.map((cat) => (
            <Link to={`/catalogo?categoria_id=${cat.id}`} key={cat.id} className="category-card">
              <div className="category-icon">📦</div>
              <div className="category-name">{cat.nombre}</div>
            </Link>
          ))}
        </div>

        <button className="scroll-arrow left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>
        <button className="scroll-arrow right" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default CategoryIcons;
