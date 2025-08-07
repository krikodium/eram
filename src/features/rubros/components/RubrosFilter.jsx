// src/features/rubros/components/RubrosFilter.jsx - Horizontal Top-Bar Selector
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { rubrosService } from '../../../services/api';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import { FaIndustry, FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';
import './RubrosFilter.css';

const RubrosFilter = ({ onRubroSelect, className = '' }) => {
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  if (loading) {
    return (
      <div className={`rubros-filter horizontal ${className}`}>
        <div className="rubros-header-horizontal">
          <div className="filters-toggle disabled">
            <FaFilter />
            <span>Cargando filtros...</span>
            <LoadingSpinner size="small" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rubros-filter horizontal ${className}`}>
        <div className="rubros-header-horizontal">
          <div className="filters-toggle error" onClick={loadRubros}>
            <FaIndustry />
            <span>Error - Reintentar</span>
          </div>
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