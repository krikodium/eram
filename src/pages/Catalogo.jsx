import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import CategoryPreview from '../components/CategoryPreview';
import RubrosFilter from '../features/rubros/components/RubrosFilter';
import { getAllProductos, getProductosByCategoria } from '../mocks/productos';
import { useAuth } from '../contexts/AuthContext';
import './Catalogo.css';
import { 
  FaFilter, 
  FaTimes, 
  FaIndustry, 
  FaSearch, 
  FaTh, 
  FaList,
  FaSortAmountDown
} from 'react-icons/fa';

const Catalogo = () => {
  const { isAuthenticated, user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 1024);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const rubroId = searchParams.get('rubro_id');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState('Todos los Productos');
  
  // Estados para funcionalidad
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [productsPerPage, setProductsPerPage] = useState(12);

  // Estado para preview de categorías
  const [preview, setPreview] = useState({
    category: null,
    products: [],
    isLoading: false,
    position: { top: 0, left: 0 },
  });
  
  const hoverTimerRef = useRef(null);
  const sidebarRef = useRef(null);

  // Check if user is a provider
  const isProvider = isAuthenticated && user?.role === 'proveedor';

  // Cargar productos
  const fetchProducts = useCallback(async (pageNum, limit, append = false, catId = null) => {
    setLoading(true);
    try {
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

  // Efectos
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
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setProductos([]);
    setPage(1);
    setHasMore(true);
    
    if (categoriaId) {
      fetchProducts(1, productsPerPage, false, categoriaId);
    } else {
      setPageTitle('Todos los Productos');
      fetchProducts(1, productsPerPage, false, null);
    }
  }, [categoriaId, productsPerPage, fetchProducts]);

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setHasMore(true);
    setProductos([]);
    
    if (categoriaId) {
      fetchProducts(1, productsPerPage, false, categoriaId);
    } else {
      fetchProducts(1, productsPerPage, false, null);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      if (categoriaId) {
        fetchProducts(nextPage, productsPerPage, true, categoriaId);
      } else {
        fetchProducts(nextPage, productsPerPage, true, null);
      }
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleRubroSelect = (rubro) => {
    setPage(1);
    setHasMore(true);
    setProductos([]);
    setPageTitle(rubro ? rubro.nombre : 'Todos los Productos');
    
    if (rubro) {
      // Filter products by rubro (this would need to be implemented in the mock service)
      fetchProducts(1, productsPerPage, false, null);
    } else {
      fetchProducts(1, productsPerPage, false, null);
    }
  };

  // Preview de categorías
  const handleCategoryMouseEnter = (category) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    hoverTimerRef.current = setTimeout(() => {
      setPreview({
        category,
        products: category.productos || [],
        isLoading: false,
        position: { top: 0, left: 0 },
      });
    }, 300);
  };

  const handleCategoryMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setPreview({ category: null, products: [], isLoading: false, position: { top: 0, left: 0 } });
  };

  // Productos filtrados y ordenados
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productos;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ordenar productos
    filtered = [...filtered].sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'precio') {
        aValue = a.precio || 0;
        bValue = b.precio || 0;
      } else if (sortBy === 'sku') {
        aValue = a.sku || '';
        bValue = b.sku || '';
      } else {
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
      {/* Header */}
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

      {/* Controles */}
      <div className="catalogo-controls">
        <div className="controls-left">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
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
              <FaTh />
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
            
            {/* Solo mostrar filtro de precio para proveedores */}
            {isProvider && (
              <button
                className="sort-btn"
                onClick={() => handleSort('precio')}
                aria-label="Ordenar por precio"
              >
                <FaSortAmountDown />
                <span>Precio</span>
              </button>
            )}
            
            {/* Solo mostrar filtro de SKU para proveedores */}
            {isProvider && (
              <button
                className="sort-btn"
                onClick={() => handleSort('sku')}
                aria-label="Ordenar por SKU"
              >
                <FaSortAmountDown />
                <span>SKU</span>
              </button>
            )}
          </div>

          <button
            className="toggle-filters-btn"
            onClick={toggleFilters}
            aria-label={showFilters ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
          >
            <FaFilter />
            <span>Filtros Avanzados</span>
          </button>
        </div>
      </div>

      {/* Cuerpo Principal */}
      <div className={`catalogo-body ${showSidebar ? 'sidebar-visible' : ''}`}>
        {/* Sidebar */}
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
            {hasMore && filteredAndSortedProducts.length > 0 && (
              <div className="load-more-section">
                <button 
                  onClick={handleLoadMore}
                  className="load-more-btn"
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Cargar más productos'}
                  <div className="btn-arrow"></div>
                </button>
              </div>
            )}

            {/* Mensaje de fin */}
            {!hasMore && filteredAndSortedProducts.length > 0 && (
              <div className="end-message">
                Has visto todos los productos disponibles
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Overlay para mobile */}
      {showSidebar && window.innerWidth <= 1024 && (
        <div 
          className="sidebar-overlay"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Preview de Categorías */}
      {preview.category && (
        <CategoryPreview
          category={preview.category}
          products={preview.products}
          isLoading={preview.isLoading}
          position={preview.position}
          onClose={() => setPreview({ category: null, products: [], isLoading: false, position: { top: 0, left: 0 } })}
        />
      )}
    </div>
  );
};

export default Catalogo;