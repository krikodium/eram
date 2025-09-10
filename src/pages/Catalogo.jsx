import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import CategoryPreview from '../components/CategoryPreview';
import RubrosFilter from '../features/rubros/components/RubrosFilter';
// import { getRubroById } from '../mocks/rubros'; // Removed - using Supabase now
import { productoService, categoriaService } from '../services/supabase';
import './Catalogo.css';
import { FaIndustry, FaSearch, FaFilter, FaTh, FaList } from 'react-icons/fa';

const Catalogo = () => {
  // Estados principales
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const rubroId = searchParams.get('rubro_id');
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState('Catálogo de Productos');

  // Estado de previsualización
  const [preview, setPreview] = useState({
    category: null,
    products: [],
    isLoading: false,
    position: { top: 0, left: 0 },
  });
  
  const hoverTimerRef = useRef(null);
  const sidebarRef = useRef(null);

  // Función para obtener productos
  const fetchProducts = useCallback(async (pageNum, limit, append = false, catId = null) => {
    setLoading(true);
    try {
      let result;
      if (catId) {
        result = await productoService.getProductosByCategoria(catId, pageNum, limit);
      } else {
        result = await productoService.getProductos(pageNum, limit);
      }
      
      const { data: nuevosProductos, totalPages, total } = result;
      setProductos(prev => append ? [...prev, ...nuevosProductos] : nuevosProductos);
      setHasMore(pageNum < totalPages);
      setPage(pageNum);
      
      // Obtener nombre de categoría si es necesario
      if (catId && nuevosProductos.length > 0) {
        try {
          const categoria = await categoriaService.getCategoria(catId);
          if (categoria) setPageTitle(categoria.nombre);
        } catch (err) {
          console.warn("No se pudo obtener el nombre de la categoría:", err);
        }
      }
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para manejar el resize de la ventana
  useEffect(() => {
    const handleResize = () => {
      // Solo ocultar el sidebar en mobile, no mostrarlo automáticamente en desktop
      if (window.innerWidth <= 768) setShowSidebar(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Efecto para manejar filtros de rubro
  useEffect(() => {
    if (rubroId) {
      // TODO: Implementar servicio de rubros en Supabase
      // Por ahora, cargar todos los productos
      setPageTitle('Productos por Rubro');
      fetchProducts(1, 20, false, null);
    }
  }, [rubroId, fetchProducts]);

  // Efecto principal para cargar productos
  useEffect(() => {
    setProductos([]);
    setPage(1);
    setHasMore(true);
    
    if (rubroId && !categoriaId) {
      // TODO: Implementar servicio de rubros en Supabase
      setPageTitle('Productos por Rubro');
      fetchProducts(1, 20, false, null);
    } else if (categoriaId) {
      fetchProducts(1, 20, false, categoriaId);
    } else {
      setPageTitle('Catálogo de Productos');
      fetchProducts(1, 20, false, null);
    }
  }, [categoriaId, rubroId, fetchProducts]);

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
        const previewResult = await productoService.getProductosByCategoria(category.id, 1, 5);
        setPreview(prev => ({
          ...prev,
          products: previewResult.data || [],
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
    fetchProducts(nextPage, 20, true, categoriaId);
  };

  // Función para buscar productos
  const searchProducts = useCallback(async (term) => {
    if (!term.trim()) {
      // Si no hay término de búsqueda, cargar productos normales
      fetchProducts(1, 20, false, categoriaId);
      return;
    }
    
    setLoading(true);
    try {
      const result = await productoService.buscarProductos(term, 1, 20);
      setProductos(result.data || []);
      setHasMore(result.page < result.totalPages);
      setPage(1);
    } catch (err) {
      console.error("Error al buscar productos:", err);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, [categoriaId, fetchProducts]);

  // Efecto para búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(searchTerm);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchProducts]);

  // Productos filtrados (para compatibilidad con el estado actual)
  const filteredProducts = productos;

  return (
    <div className="catalogo-container">
      {/* Header principal */}
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
      </header>

      {/* Filtro de Rubros */}
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
              <button 
                className="close-sidebar-btn"
                onClick={() => setShowSidebar(false)}
                aria-label="Cerrar sidebar"
              >
                ×
              </button>
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
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
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

              <button 
                className="toggle-sidebar-btn"
                onClick={() => setShowSidebar(!showSidebar)}
                aria-label={showSidebar ? 'Ocultar filtros' : 'Mostrar filtros'}
              >
                <FaFilter />
                <span>{showSidebar ? 'Ocultar' : 'Filtros'}</span>
              </button>
            </div>
          </div>

          {/* Información de resultados */}
          {filteredProducts.length > 0 && (
            <div className="results-info">
              <span className="results-count">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </span>
              {searchTerm && (
                <span className="search-term">
                  para "{searchTerm}"
                </span>
              )}
            </div>
          )}

          {/* Lista de productos */}
          <div className="products-section">
            {loading && page === 1 ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando productos...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductList productos={filteredProducts} viewMode={viewMode} />
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