import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import CategoryPreview from '../components/CategoryPreview';
import RubrosFilter from '../features/rubros/components/RubrosFilter';
import { rubrosService } from '../services/api';
import { getRubroById } from '../mocks/rubros';
import { getAllProductos, getProductosByCategoria, mockCategorias } from '../mocks/productos';
import './Catalogo.css';
import { 
  FaFilter, 
  FaTimes, 
  FaIndustry, 
  FaSearch, 
  FaGrid3X3, 
  FaList,
  FaSortAmountDown,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 1024);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const rubroId = searchParams.get('rubro_id');
  const api = useMemo(() => import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:8001', []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState('Todos los Productos');
  const [filteredCategories, setFilteredCategories] = useState([]);
  
  // Nuevos estados para el diseño mejorado
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [sortBy, setSortBy] = useState('nombre'); // 'nombre', 'precio', 'sku'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' o 'desc'
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [productsPerPage, setProductsPerPage] = useState(12);

  // Estado unificado para la previsualización
  const [preview, setPreview] = useState({
    category: null,
    products: [],
    isLoading: false,
    position: { top: 0, left: 0 },
  });
  
  const hoverTimerRef = useRef(null);
  const sidebarRef = useRef(null);
  const searchInputRef = useRef(null);

  const fetchProducts = useCallback(async (pageNum, limit, append = false, catId = null) => {
    setLoading(true);
    try {
      // Use mock data instead of API calls
      let result;
      if (catId) {
        result = getProductosByCategoria(catId, pageNum, limit);
      } else {
        result = getAllProductos(pageNum, limit);
      }
      
      const { productos: nuevosProductos, totalPages, categoriaNombre } = result;
      setProductos(prev => append ? [...prev, ...nuevosProductos] : nuevosProductos);
      setHasMore(pageNum < totalPages);
      setPage(pageNum);
      if (categoriaNombre) setPageTitle(categoriaNombre);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efectos para responsive design
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setShowSidebar(false);
        setShowFilters(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Ejecutar inmediatamente
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle rubro filtering
  useEffect(() => {
    if (rubroId) {
      const rubro = getRubroById(parseInt(rubroId));
      if (rubro) {
        setPageTitle(`${rubro.nombre} - Productos`);
        fetchProducts(1, productsPerPage, false, null);
      }
    }
  }, [rubroId, fetchProducts, productsPerPage]);

  useEffect(() => {
    setProductos([]);
    setPage(1);
    setHasMore(true);
    
    if (rubroId && !categoriaId) {
      const rubro = getRubroById(parseInt(rubroId));
      if (rubro) {
        setPageTitle(`${rubro.nombre} - Productos`);
        fetchProducts(1, productsPerPage, false, null);
      }
    } else if (categoriaId) {
      fetchProducts(1, productsPerPage, false, categoriaId);
    } else {
      setPageTitle('Todos los Productos');
      fetchProducts(1, productsPerPage, false, null);
    }
  }, [categoriaId, rubroId, fetchProducts, productsPerPage]);

  // Funciones de manejo de eventos
  const handleCategoryMouseEnter = (category, event) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    
    const linkRect = event.currentTarget.getBoundingClientRect();
    const sidebarRect = sidebarRef.current?.getBoundingClientRect();
    
    if (!sidebarRect) return;
    
    const calculatedPosition = {
      top: linkRect.top + (linkRect.height / 2),
      left: sidebarRect.right + 15
    };

    hoverTimerRef.current = setTimeout(async () => {
      setPreview(prev => ({
        ...prev,
        category: category,
        isLoading: true,
        position: calculatedPosition,
      }));
      
      try {
        const previewResult = getProductosByCategoria(category.id, 1, 5);
        setPreview(prev => ({
          ...prev,
          products: previewResult.productos || [],
          isLoading: false,
        }));
      } catch (error) {
        console.error("Error fetching preview products:", error);
        setPreview(prev => ({ ...prev, products: [], isLoading: false }));
      }
    }, 800); // Reducido de 1800ms a 800ms para mejor UX
  };

  const handleCategoryMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setPreview(prev => ({ ...prev, category: null }));
  };

  const handleRubroSelect = (rubro) => {
    console.log('Rubro selected:', rubro);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchProducts(nextPage, productsPerPage, true, categoriaId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implementar búsqueda cuando se conecte con la API real
    console.log('Searching for:', searchTerm);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Productos filtrados y ordenados
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...productos];
    
    // Aplicar búsqueda si hay término
    if (searchTerm.trim()) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'precio':
          aValue = parseFloat(a.precio) || 0;
          bValue = parseFloat(b.precio) || 0;
          break;
        case 'sku':
          aValue = a.sku || '';
          bValue = b.sku || '';
          break;
        default: // nombre
          aValue = a.nombre || '';
          bValue = b.nombre || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [productos, searchTerm, sortBy, sortOrder]);

  return (
    <div className="catalogo-container">
      {/* Header Principal */}
      <header className="catalogo-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              {rubroId && <FaIndustry className="title-icon" />}
              {pageTitle}
            </h1>
            <p className="page-subtitle">
              Descubrí nuestra amplia gama de productos de seguridad industrial
            </p>
          </div>
          
          <div className="header-actions">
            <button 
              className="toggle-sidebar-btn"
              onClick={() => setShowSidebar(!showSidebar)}
              aria-label={showSidebar ? 'Ocultar filtros' : 'Mostrar filtros'}
            >
              {showSidebar ? <FaTimes /> : <FaFilter />}
              <span className="btn-text">Filtros</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filtros de Rubros */}
      <div className="rubros-filter-section">
        <RubrosFilter onRubroSelect={handleRubroSelect} />
      </div>

      {/* Controles de Vista y Búsqueda */}
      <div className="catalogo-controls">
        <div className="controls-left">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="clear-search-btn"
                  aria-label="Limpiar búsqueda"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="controls-right">
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Vista en cuadrícula"
            >
              <FaGrid3X3 />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="Vista en lista"
            >
              <FaList />
            </button>
          </div>

          <div className="sort-controls">
            <button
              className="sort-btn"
              onClick={() => handleSort('nombre')}
              aria-label="Ordenar por nombre"
            >
              <FaSortAmountDown />
              <span>Nombre</span>
            </button>
            <button
              className="sort-btn"
              onClick={() => handleSort('precio')}
              aria-label="Ordenar por precio"
            >
              <FaSortAmountDown />
              <span>Precio</span>
            </button>
            <button
              className="sort-btn"
              onClick={() => handleSort('sku')}
              aria-label="Ordenar por SKU"
            >
              <FaSortAmountDown />
              <span>SKU</span>
            </button>
          </div>

          <button
            className="toggle-filters-btn"
            onClick={toggleFilters}
            aria-label={showFilters ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
          >
            {showFilters ? <FaEyeSlash /> : <FaEye />}
            <span>Filtros Avanzados</span>
          </button>
        </div>
      </div>

      {/* Cuerpo Principal */}
      <div className={`catalogo-body ${showSidebar ? 'sidebar-visible' : ''}`}>
        {/* Sidebar de Categorías */}
        <aside 
          className={`category-sidebar ${showSidebar ? 'visible' : ''}`} 
          ref={sidebarRef}
          onMouseLeave={handleCategoryMouseLeave}
        >
          <div className="sidebar-header">
            <h3 className="sidebar-title">Categorías</h3>
            <button
              className="close-sidebar-btn"
              onClick={() => setShowSidebar(false)}
              aria-label="Cerrar sidebar"
            >
              <FaTimes />
            </button>
          </div>
          
          <CategorySidebar
            onLinkClick={() => {
              if (window.innerWidth <= 1024) setShowSidebar(false);
            }}
            onCategoryMouseEnter={handleCategoryMouseEnter}
          />
        </aside>

        {/* Contenido Principal */}
        <main className="main-content">
          {/* Filtros Avanzados */}
          {showFilters && (
            <div className="advanced-filters">
              <h3>Filtros Avanzados</h3>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Productos por página:</label>
                  <select
                    value={productsPerPage}
                    onChange={(e) => setProductsPerPage(Number(e.target.value))}
                    className="filter-select"
                  >
                    <option value={6}>6 productos</option>
                    <option value={12}>12 productos</option>
                    <option value={24}>24 productos</option>
                    <option value={48}>48 productos</option>
                  </select>
                </div>
                {/* Aquí se pueden agregar más filtros avanzados */}
              </div>
            </div>
          )}

          {/* Lista de Productos */}
          <div className="products-section">
            {loading && page === 1 ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando productos...</p>
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <ProductList 
                productos={filteredAndSortedProducts} 
                viewMode={viewMode}
                columnas={viewMode === 'grid' ? (window.innerWidth > 1200 ? 4 : 3) : 1}
              />
            ) : (
              <div className="no-products">
                <div className="no-products-icon">📦</div>
                <h3>No se encontraron productos</h3>
                <p>
                  {searchTerm 
                    ? `No hay productos que coincidan con "${searchTerm}"`
                    : 'No hay productos disponibles en esta categoría'
                  }
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="clear-filters-btn"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}

            {/* Botón Cargar Más */}
            {!loading && hasMore && filteredAndSortedProducts.length > 0 && (
              <div className="load-more-section">
                <button onClick={handleLoadMore} className="load-more-btn">
                  <span>Cargar más productos</span>
                  <div className="btn-arrow"></div>
                </button>
              </div>
            )}

            {/* Estado Final */}
            {!loading && !hasMore && filteredAndSortedProducts.length > 0 && (
              <div className="end-message">
                <p>Has llegado al final de la lista de productos</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Preview de Categoría */}
      {preview.category && (
        <CategoryPreview
          category={preview.category}
          products={preview.products}
          isLoading={preview.isLoading}
          position={preview.position}
        />
      )}

      {/* Overlay para mobile */}
      {showSidebar && window.innerWidth <= 1024 && (
        <div 
          className="sidebar-overlay"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default Catalogo;