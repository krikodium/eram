// src/features/admin/components/AdvancedFilters.jsx - Componente de filtros avanzados
import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes, FaSearch, FaCalendarAlt, FaTag, FaDollarSign, FaImage, FaCheck } from 'react-icons/fa';

const AdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onApply, 
  onClear, 
  categories = [],
  loading = false,
  showDateRange = true,
  showPriceRange = true,
  showCategoryFilter = true,
  showImageFilter = true,
  showStatusFilter = false,
  customFields = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply?.(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      categoria_id: '',
      precio_min: '',
      precio_max: '',
      sin_imagen: false,
      activo: '',
      fecha_desde: '',
      fecha_hasta: '',
      ...customFields.reduce((acc, field) => ({ ...acc, [field.key]: field.defaultValue || '' }), {})
    };
    
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClear?.(clearedFilters);
    setIsOpen(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== '' && value !== false && value !== null && value !== undefined) {
        count++;
      }
    });
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="advanced-filters">
      {/* Botón de filtros */}
      <button
        className={`admin-btn admin-btn-secondary ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative' }}
      >
        <FaFilter />
        Filtros Avanzados
        {activeFiltersCount > 0 && (
          <span className="filter-badge">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Panel de filtros */}
      {isOpen && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filtros Avanzados</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="filters-content">
            <div className="filters-grid">
              {/* Filtro de búsqueda general */}
              <div className="filter-group">
                <label>
                  <FaSearch style={{ marginRight: '0.5rem' }} />
                  Búsqueda General
                </label>
                <input
                  type="text"
                  value={localFilters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Buscar en nombre, descripción..."
                  className="filter-input"
                />
              </div>

              {/* Filtro de categoría */}
              {showCategoryFilter && (
                <div className="filter-group">
                  <label>
                    <FaTag style={{ marginRight: '0.5rem' }} />
                    Categoría
                  </label>
                  <select
                    value={localFilters.categoria_id || ''}
                    onChange={(e) => handleFilterChange('categoria_id', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filtro de rango de precios */}
              {showPriceRange && (
                <>
                  <div className="filter-group">
                    <label>
                      <FaDollarSign style={{ marginRight: '0.5rem' }} />
                      Precio Mínimo
                    </label>
                    <input
                      type="number"
                      value={localFilters.precio_min || ''}
                      onChange={(e) => handleFilterChange('precio_min', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="filter-input"
                    />
                  </div>
                  <div className="filter-group">
                    <label>
                      <FaDollarSign style={{ marginRight: '0.5rem' }} />
                      Precio Máximo
                    </label>
                    <input
                      type="number"
                      value={localFilters.precio_max || ''}
                      onChange={(e) => handleFilterChange('precio_max', e.target.value)}
                      placeholder="Sin límite"
                      min="0"
                      step="0.01"
                      className="filter-input"
                    />
                  </div>
                </>
              )}

              {/* Filtro de rango de fechas */}
              {showDateRange && (
                <>
                  <div className="filter-group">
                    <label>
                      <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                      Fecha Desde
                    </label>
                    <input
                      type="date"
                      value={localFilters.fecha_desde || ''}
                      onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
                      className="filter-input"
                    />
                  </div>
                  <div className="filter-group">
                    <label>
                      <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                      Fecha Hasta
                    </label>
                    <input
                      type="date"
                      value={localFilters.fecha_hasta || ''}
                      onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
                      className="filter-input"
                    />
                  </div>
                </>
              )}

              {/* Filtro de estado */}
              {showStatusFilter && (
                <div className="filter-group">
                  <label>
                    <FaCheck style={{ marginRight: '0.5rem' }} />
                    Estado
                  </label>
                  <select
                    value={localFilters.activo || ''}
                    onChange={(e) => handleFilterChange('activo', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todos los estados</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              )}

              {/* Filtro de imágenes */}
              {showImageFilter && (
                <div className="filter-group">
                  <label>
                    <FaImage style={{ marginRight: '0.5rem' }} />
                    Imágenes
                  </label>
                  <div className="filter-checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={localFilters.sin_imagen || false}
                        onChange={(e) => handleFilterChange('sin_imagen', e.target.checked)}
                      />
                      <span>Solo productos sin imagen</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Campos personalizados */}
              {customFields.map(field => (
                <div key={field.key} className="filter-group">
                  <label>
                    {field.icon && <span style={{ marginRight: '0.5rem' }}>{field.icon}</span>}
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={localFilters[field.key] || ''}
                      onChange={(e) => handleFilterChange(field.key, e.target.value)}
                      className="filter-select"
                    >
                      <option value="">{field.placeholder || `Seleccionar ${field.label.toLowerCase()}`}</option>
                      {field.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <div className="filter-checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={localFilters[field.key] || false}
                          onChange={(e) => handleFilterChange(field.key, e.target.checked)}
                        />
                        <span>{field.placeholder || field.label}</span>
                      </label>
                    </div>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={localFilters[field.key] || ''}
                      onChange={(e) => handleFilterChange(field.key, e.target.value)}
                      placeholder={field.placeholder || `Ingresar ${field.label.toLowerCase()}`}
                      className="filter-input"
                      {...field.inputProps}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            <div className="filters-actions">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={handleClear}
                disabled={loading}
              >
                <FaTimes />
                Limpiar Filtros
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleApply}
                disabled={loading}
              >
                <FaFilter />
                Aplicar Filtros
                {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
