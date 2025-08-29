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
  FaSort, 
  FaTh, 
  FaList,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const Catalogo = () => {
  // Estados principales
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const rubroId = searchParams.get('rubro_id');
  
  // Estados de filtros y vista
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [productsPerPage, setProductsPerPage] = useState(12);
  
  // Estados de paginación
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState('Catálogo de Productos');
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Estado de previsualización
  const [preview, setPreview] = useState({
    category: null,
    products: [],
    isLoading: false,
    position: { top: 0, left: 0 },
  });
  
  const hoverTimerRef = useRef(null);
  const sidebarRef = useRef(null);
  const searchInputRef = useRef(null);

  // Función para obtener productos
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

  // Función para filtrar y ordenar productos
  const getFilteredAndSortedProducts = useCallback(() => {
    let filtered = [...productos];
    
    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'precio') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [productos, searchTerm, sortBy, sortOrder]);

  // Efecto para manejar el resize de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setShowSidebar(false);
      else setShowSidebar(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Efecto para manejar filtros de rubro
  useEffect(() => {
    if (rubroId) {
      const rubro = getRubroById(parseInt(rubroId));
      if (rubro) {
        setPageTitle(`${rubro.nombre} - Productos`);
        fetchProducts(1, productsPerPage, false, null);
      }
    }
  }, [rubroId, fetchProducts, productsPerPage]);

  // Efecto principal para cargar productos
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
      setPageTitle('Catálogo de Productos');
      fetchProducts(1, productsPerPage, false, null);
    }
  }, [categoriaId, rubroId, fetchProducts, productsPerPage]);

  // Función para manejar hover en categorías
  const handleCategoryMouseEnter = (category, event) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    
    const linkRect = event.currentTarget.getBoundingClientRect();
    const sidebarRect = sidebarRef.current.getBoundingClientRect();
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
    }, 800);
  };

  const handleCategoryMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setPreview(prev => ({ ...prev, category: null }));
  };

  // Función para cargar más productos
  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchProducts(nextPage, productsPerPage, true, categoriaId);
  };

  // Función para limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Función para cambiar ordenamiento
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  // Productos filtrados y ordenados
  const filteredProducts = getFilteredAndSortedProducts();
  const totalProducts = filteredProducts.length;

  return (
    <div className="catalogo-container">
      {/* Header Principal */}
      <header className="catalogo-header">
        <div className="header-content">
          <h1 className="page-title">
            {rubroId && <FaIndustry className="title-icon" />}
            {pageTitle}
          </h1>
          <p className="page-subtitle">
            Descubre nuestra amplia gama de productos de seguridad industrial
          </p>
        </div>
        
        {/* Controles principales */}
        <div className="header-controls">
          <button 
            className="toggle-sidebar-btn"
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label={showSidebar ? 'Ocultar filtros' : 'Mostrar filtros'}
          >
            {showSidebar ? <FaEyeSlash /> : <FaEye />}
            <span>{showSidebar ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
          </button>
        </div>
      </header>

      {/* Filtro de Rubros Horizontal */}
      <div className="rubros-filter-section">
        <RubrosFilter onRubroSelect={() => {}} />
      </div>

      {/* Contenedor principal */}
      <div className={`catalogo-main ${showSidebar ? 'with-sidebar' : ''}`}>
        {/* Sidebar de categorías */}
        {showSidebar && (
          <aside className="category-sidebar" ref={sidebarRef} onMouseLeave={handleCategoryMouseLeave}>
            <div className="sidebar-header">
              <h3>Categorías</h3>
              <span className="category-count">{filteredCategories.length}</span>
            </div>
            <CategorySidebar
              onLinkClick={() => {
                if (window.innerWidth <= 768) setShowSidebar(false);
              }}
              onCategoryMouseEnter={handleCategoryMouseEnter}
            />
          </aside>
        )}

        {/* Contenido principal */}
        <main className="catalogo-content">
          {/* Barra de herramientas */}
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="search-container">
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
                  <button onClick={clearSearch} className="clear-search-btn">
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="toolbar-right">
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
                <FaSort className="sort-icon" />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="sort-select"
                >
                  <option value="nombre-asc">Nombre A-Z</option>
                  <option value="nombre-desc">Nombre Z-A</option>
                  <option value="precio-asc">Precio Menor</option>
                  <option value="precio-desc">Precio Mayor</option>
                </select>
              </div>

              <div className="products-per-page">
                <select
                  value={productsPerPage}
                  onChange={(e) => setProductsPerPage(Number(e.target.value))}
                  className="per-page-select"
                >
                  <option value={12}>12 por página</option>
                  <option value={24}>24 por página</option>
                  <option value={48}>48 por página</option>
                </select>
              </div>
            </div>
          </div>

          {/* Información de resultados */}
          <div className="results-info">
            <span className="results-count">
              {totalProducts} producto{totalProducts !== 1 ? 's' : ''} encontrado{totalProducts !== 1 ? 's' : ''}
            </span>
            {searchTerm && (
              <span className="search-term">
                para "{searchTerm}"
              </span>
            )}
          </div>

          {/* Lista de productos */}
          <div className="products-section">
            {loading && page === 1 ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando productos...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductList 
                productos={filteredProducts} 
                viewMode={viewMode}
              />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No se encontraron productos</h3>
                <p>
                  {searchTerm 
                    ? `No hay productos que coincidan con "${searchTerm}"`
                    : 'No hay productos disponibles en esta categoría'
                  }
                </p>
                {searchTerm && (
                  <button onClick={clearSearch} className="clear-filters-btn">
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Botón de cargar más */}
          {!loading && hasMore && filteredProducts.length > 0 && (
            <div className="load-more-section">
              <button onClick={handleLoadMore} className="load-more-btn">
                Cargar más productos
              </button>
            </div>
          )}

          {/* Mensaje de fin de lista */}
          {!loading && !hasMore && filteredProducts.length > 0 && (
            <div className="end-message">
              <p>Has llegado al final de la lista de productos</p>
            </div>
          )}
        </main>
      </div>

      {/* Previsualización de categoría */}
      {preview.category && (
        <CategoryPreview
          category={preview.category}
          products={preview.products}
          isLoading={preview.isLoading}
          position={preview.position}
        />
      )}
    </div>
  );
};

export default Catalogo;