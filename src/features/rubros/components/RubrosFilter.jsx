// src/features/rubros/components/RubrosFilter.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { rubrosService } from '../../../services/api';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import { FaIndustry, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './RubrosFilter.css';

const RubrosFilter = ({ onRubroSelect, className = '' }) => {
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeRubroId = searchParams.get('rubro_id');

  useEffect(() => {
    loadRubros();
  }, []);

  const loadRubros = async () => {
    try {
      setLoading(true);
      const data = await rubrosService.getRubros();
      setRubros(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar rubros');
      console.error('Error loading rubros:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRubroClick = (rubro) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (activeRubroId === String(rubro.id)) {
      // If clicking active rubro, deselect it
      newSearchParams.delete('rubro_id');
      newSearchParams.delete('categoria_id'); // Also clear category filter
    } else {
      // Select new rubro
      newSearchParams.set('rubro_id', String(rubro.id));
      newSearchParams.delete('categoria_id'); // Clear category filter when selecting rubro
    }
    
    setSearchParams(newSearchParams);
    onRubroSelect && onRubroSelect(rubro);
  };

  const handleViewAll = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('rubro_id');
    newSearchParams.delete('categoria_id');
    setSearchParams(newSearchParams);
    onRubroSelect && onRubroSelect(null);
  };

  if (loading) {
    return (
      <div className={`rubros-filter ${className}`}>
        <div className="rubros-header">
          <h3>Rubros</h3>
        </div>
        <LoadingSpinner size="small" message="Cargando rubros..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rubros-filter ${className}`}>
        <div className="rubros-header">
          <h3>Rubros</h3>
        </div>
        <div className="rubros-error">
          <p>{error}</p>
          <button onClick={loadRubros} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rubros-filter ${className}`}>
      <div className="rubros-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          <FaIndustry />
          Rubros / Líneas de Productos
        </h3>
        <button className="expand-toggle">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {isExpanded && (
        <div className="rubros-content">
          <div className="rubros-list">
            {/* View All Option */}
            <button
              onClick={handleViewAll}
              className={`rubro-item ${!activeRubroId ? 'active' : ''}`}
            >
              <div className="rubro-icon all-rubros">
                <FaIndustry />
              </div>
              <div className="rubro-info">
                <h4>Ver Todos los Rubros</h4>
                <p>Mostrar todos los productos</p>
              </div>
            </button>

            {/* Individual Rubros */}
            {rubros.map((rubro) => (
              <button
                key={rubro.id}
                onClick={() => handleRubroClick(rubro)}
                className={`rubro-item ${activeRubroId === String(rubro.id) ? 'active' : ''}`}
              >
                <div 
                  className="rubro-icon" 
                  style={{ backgroundColor: rubro.color }}
                >
                  <i className={`fas fa-${rubro.icon}`} />
                </div>
                <div className="rubro-info">
                  <h4>{rubro.nombre}</h4>
                  <p>{rubro.descripcion}</p>
                  <span className="categories-count">
                    {rubro.categorias.length} categorías
                  </span>
                </div>
                {activeRubroId === String(rubro.id) && (
                  <div className="active-indicator">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RubrosFilter;