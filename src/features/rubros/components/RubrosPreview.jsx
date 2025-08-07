// src/features/rubros/components/RubrosPreview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaArrowRight } from 'react-icons/fa';
import './RubrosPreview.css';

const RubrosPreview = ({ rubro, position }) => {
  if (!rubro) return null;

  return (
    <div 
      className="rubros-preview"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 1000,
      }}
    >
      <div className="preview-content">
        <div className="preview-header">
          <div 
            className="preview-icon"
            style={{ backgroundColor: rubro.color }}
          >
            <i className={`fas fa-${rubro.icon}`} />
          </div>
          <div className="preview-info">
            <h3>{rubro.nombre}</h3>
            <p>{rubro.descripcion}</p>
          </div>
        </div>

        <div className="preview-categories">
          <h4>Categorías incluidas:</h4>
          <div className="categories-grid">
            {rubro.categorias.slice(0, 6).map((categoria, index) => (
              <span key={index} className="category-tag">
                {categoria}
              </span>
            ))}
            {rubro.categorias.length > 6 && (
              <span className="more-categories">
                +{rubro.categorias.length - 6} más
              </span>
            )}
          </div>
        </div>

        <div className="preview-actions">
          <Link 
            to={`/catalogo?rubro_id=${rubro.id}`}
            className="view-rubro-btn"
          >
            <FaEye />
            Ver Productos
            <FaArrowRight />
          </Link>
        </div>
      </div>
      
      {/* Arrow pointing to the source */}
      <div className="preview-arrow" />
    </div>
  );
};

export default RubrosPreview;