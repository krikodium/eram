// src/features/admin/components/GlobalSearch.jsx - Búsqueda global en toda la base de datos
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaSpinner, FaExternalLinkAlt, FaBox, FaTags, FaHistory, FaDatabase } from 'react-icons/fa';
import { adminProductService, adminCategoryService, adminLogService } from '../services/adminService';

const GlobalSearch = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({
    productos: [],
    categorias: [],
    logs: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [totalResults, setTotalResults] = useState(0);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch(searchTerm);
      } else {
        setResults({ productos: [], categorias: [], logs: [] });
        setTotalResults(0);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const performSearch = async (term) => {
    setLoading(true);
    try {
      const [productosResult, categoriasResult, logsResult] = await Promise.all([
        searchProductos(term),
        searchCategorias(term),
        searchLogs(term)
      ]);

      const newResults = {
        productos: productosResult,
        categorias: categoriasResult,
        logs: logsResult
      };

      setResults(newResults);
      setTotalResults(
        productosResult.length + 
        categoriasResult.length + 
        logsResult.length
      );
    } catch (error) {
      console.error('Error en búsqueda global:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProductos = async (term) => {
    try {
      const data = await adminProductService.getAllProducts({
        search: term
      });
      return data || [];
    } catch (error) {
      console.error('Error buscando productos:', error);
      return [];
    }
  };

  const searchCategorias = async (term) => {
    try {
      const data = await adminCategoryService.getAllCategories();
      return data.filter(category => 
        category.nombre.toLowerCase().includes(term.toLowerCase()) ||
        category.descripcion?.toLowerCase().includes(term.toLowerCase())
      );
    } catch (error) {
      console.error('Error buscando categorías:', error);
      return [];
    }
  };

  const searchLogs = async (term) => {
    try {
      const response = await adminLogService.getLogs({
        search: term,
        limit: 20 // Limitar logs para no sobrecargar
      });
      return response.success ? response.data.logs : [];
    } catch (error) {
      console.error('Error buscando logs:', error);
      return [];
    }
  };

  const handleResultClick = (type, item) => {
    // Navegar a la página correspondiente
    const routes = {
      productos: `/dasheram/productos`,
      categorias: `/dasheram/categorias`,
      logs: `/dasheram/logs`
    };
    
    if (routes[type]) {
      window.location.href = routes[type];
    }
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ 
          background: 'var(--admin-warning)40', 
          color: 'var(--admin-text-primary)',
          padding: '0.125rem 0.25rem',
          borderRadius: '0.25rem'
        }}>
          {part}
        </mark>
      ) : part
    );
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'productos': return <FaBox />;
      case 'categorias': return <FaTags />;
      case 'logs': return <FaHistory />;
      default: return <FaDatabase />;
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'productos': return 'var(--admin-primary)';
      case 'categorias': return 'var(--admin-success)';
      case 'logs': return 'var(--admin-info)';
      default: return 'var(--admin-text-muted)';
    }
  };

  const renderResults = (type, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="search-results-section">
        <div className="search-results-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: getResultColor(type) }}>
              {getResultIcon(type)}
            </span>
            <span style={{ 
              fontWeight: '600', 
              color: 'var(--admin-text-primary)',
              textTransform: 'capitalize'
            }}>
              {type} ({items.length})
            </span>
          </div>
        </div>
        
        <div className="search-results-list">
          {items.slice(0, 5).map((item, index) => (
            <div
              key={`${type}-${item.id || index}`}
              className="search-result-item"
              onClick={() => handleResultClick(type, item)}
            >
              <div className="search-result-content">
                <div className="search-result-title">
                  {highlightText(item.nombre || item.description || 'Sin título', searchTerm)}
                </div>
                <div className="search-result-description">
                  {highlightText(
                    item.descripcion || 
                    item.user_email || 
                    item.resource || 
                    'Sin descripción', 
                    searchTerm
                  )}
                </div>
                {type === 'productos' && (
                  <div className="search-result-meta">
                    <span style={{ color: 'var(--admin-success)', fontWeight: '500' }}>
                      ${item.precio_unitario}
                    </span>
                    {item.categoria && (
                      <span style={{ color: 'var(--admin-text-muted)' }}>
                        • {item.categoria.nombre}
                      </span>
                    )}
                  </div>
                )}
                {type === 'logs' && (
                  <div className="search-result-meta">
                    <span style={{ 
                      color: getResultColor(item.severity),
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {item.severity}
                    </span>
                    <span style={{ color: 'var(--admin-text-muted)' }}>
                      • {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              <FaExternalLinkAlt className="search-result-arrow" />
            </div>
          ))}
          
          {items.length > 5 && (
            <div className="search-results-more">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => handleResultClick(type, null)}
                style={{ width: '100%', fontSize: '0.875rem' }}
              >
                Ver {items.length - 5} resultados más en {type}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const filteredResults = () => {
    if (activeTab === 'all') {
      return results;
    }
    
    return {
      [activeTab]: results[activeTab] || []
    };
  };

  return (
    <div className="global-search-overlay">
      <div className="global-search-modal">
        <div className="global-search-header">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en toda la base de datos..."
              className="search-input"
            />
            {loading && <FaSpinner className="search-spinner" />}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search-btn"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="close-search-btn"
          >
            <FaTimes />
          </button>
        </div>

        <div className="global-search-content">
          {searchTerm.length < 2 ? (
            <div className="search-placeholder">
              <FaSearch style={{ fontSize: '3rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--admin-text-primary)', marginBottom: '0.5rem' }}>
                Búsqueda Global
              </h3>
              <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>
                Escribe al menos 2 caracteres para buscar en productos, categorías y logs
              </p>
            </div>
          ) : (
            <>
              {/* Tabs de resultados */}
              <div className="search-tabs">
                <button
                  className={`search-tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  <FaDatabase />
                  Todos ({totalResults})
                </button>
                <button
                  className={`search-tab ${activeTab === 'productos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('productos')}
                >
                  <FaBox />
                  Productos ({results.productos.length})
                </button>
                <button
                  className={`search-tab ${activeTab === 'categorias' ? 'active' : ''}`}
                  onClick={() => setActiveTab('categorias')}
                >
                  <FaTags />
                  Categorías ({results.categorias.length})
                </button>
                <button
                  className={`search-tab ${activeTab === 'logs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('logs')}
                >
                  <FaHistory />
                  Logs ({results.logs.length})
                </button>
              </div>

              {/* Resultados */}
              <div className="search-results">
                {loading ? (
                  <div className="search-loading">
                    <FaSpinner className="search-spinner" />
                    <span>Buscando...</span>
                  </div>
                ) : totalResults === 0 ? (
                  <div className="search-no-results">
                    <FaSearch style={{ fontSize: '2rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }} />
                    <h3 style={{ color: 'var(--admin-text-primary)', marginBottom: '0.5rem' }}>
                      No se encontraron resultados
                    </h3>
                    <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>
                      Intenta con otros términos de búsqueda
                    </p>
                  </div>
                ) : (
                  <div className="search-results-container">
                    {activeTab === 'all' ? (
                      <>
                        {renderResults('productos', results.productos)}
                        {renderResults('categorias', results.categorias)}
                        {renderResults('logs', results.logs)}
                      </>
                    ) : (
                      renderResults(activeTab, results[activeTab])
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
