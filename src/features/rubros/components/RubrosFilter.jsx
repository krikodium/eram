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
    <div className={`rubros-filter horizontal ${className}`}>
      {/* Filters Toggle Button */}
      <div className="rubros-header-horizontal">
        <button 
          className="filters-toggle"
          onClick={toggleFilters}
          aria-expanded={isFiltersOpen}
        >
          <FaFilter />
          <span>Filtros</span>
          <FaChevronDown className={`toggle-icon ${isFiltersOpen ? 'rotated' : ''}`} />
        </button>
        
        {activeRubroId && (
          <div className="active-filter-indicator">
            <span>Filtrando por rubro</span>
            <button onClick={handleViewAll} className="clear-filter">
              <FaTimes />
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Rubros Bar */}
      <div className={`rubros-horizontal-container ${isFiltersOpen ? 'expanded' : ''}`}>
        <div className="rubros-scroll-area">
          <div className="rubros-tabs">
            {/* View All Tab */}
            <button
              className={`rubro-tab ${!activeRubroId ? 'active' : ''}`}
              onClick={handleViewAll}
            >
              <FaIndustry />
              <span>Todos los Productos</span>
            </button>

            {/* Individual Rubro Tabs */}
            {rubros.map((rubro) => (
              <button
                key={rubro.id}
                className={`rubro-tab ${activeRubroId === String(rubro.id) ? 'active' : ''}`}
                onClick={() => handleRubroClick(rubro)}
              >
                <FaIndustry />
                <div className="rubro-tab-content">
                  <span className="rubro-name">{rubro.nombre}</span>
                  <span className="rubro-count">({rubro.cantidad_productos || 0})</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RubrosFilter;