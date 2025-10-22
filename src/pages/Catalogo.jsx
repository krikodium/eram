import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productoService, categoriaService } from '../services/supabase';
import { useCatalog } from '../contexts/CatalogContext';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import './Catalogo.css';
import { 
  FaSearch, 
  FaFilter, 
  FaTh, 
  FaList, 
  FaChevronDown, 
  FaTimes,
  FaSortAmountDown,
  FaBars
} from 'react-icons/fa';

const Catalogo = () => {
  // Hook del contexto del catálogo
  const { setSelectedCategory: setContextCategory, clearSelectedCategory, getCatalogUrl } = useCatalog();
  
  // Estados principales
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catalogReady, setCatalogReady] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoriaId = searchParams.get('categoria_id');
  const rubroId = searchParams.get('rubro_id');
  
  // Estados de filtros y UI
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('nombre');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(24); // 24 productos por página (4 filas de 6)
  
  // Referencias
  const searchRef = useRef(null);
  const sortMenuRef = useRef(null);
  const filtersRef = useRef(null);

  // Función para detectar si es mobile
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  // Efecto para ajustar itemsPerPage según el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setItemsPerPage(12); // 12 productos en mobile (6 filas de 2)
      } else {
        setItemsPerPage(24); // 24 productos en desktop (4 filas de 6)
      }
    };

    // Establecer valor inicial
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para obtener productos
  const fetchProducts = useCallback(async (pageNum = 1, catId = null, search = '') => {
    setLoading(true);
    
    try {
      let todosLosProductos;
      
      // Obtener TODOS los productos primero (sin paginación)
      if (search.trim()) {
        // Para búsqueda, obtener todos los productos que coincidan
        const result = await productoService.buscarProductos(search, 1, 1000); // Obtener muchos productos
        todosLosProductos = result.data || [];
      } else if (catId) {
        // Para categoría, obtener todos los productos de esa categoría
        const result = await productoService.getProductosByCategoria(catId, 1, 1000); // Obtener muchos productos
        todosLosProductos = result.data || [];
      } else {
        // Para catálogo general, obtener todos los productos
        const result = await productoService.getProductos(1, 1000); // Obtener muchos productos
        todosLosProductos = result.data || [];
      }
      
      // Filtrar productos sin fotos ANTES de paginar
      const productosConFotos = todosLosProductos.filter(producto => {
        const imagenUrl = producto.imagen_url;
        return imagenUrl && 
               imagenUrl.trim() !== '' && 
               !imagenUrl.includes('default-product.jpg') &&
               (imagenUrl.startsWith('http') || imagenUrl.startsWith('/'));
      });
      
      // Ordenar productos para mostrar primero las categorías destacadas
      const categoriasDestacadas = ['Señalizacion Industrial', 'Señalización Vial', 'Señalizacion Personal'];
      const productosOrdenados = productosConFotos.sort((a, b) => {
        // Si no hay categoría en la búsqueda, ordenar por categorías destacadas
        if (!catId && !search.trim()) {
          const categoriaA = a.categoria_nombre || '';
          const categoriaB = b.categoria_nombre || '';
          
          const indexA = categoriasDestacadas.indexOf(categoriaA);
          const indexB = categoriasDestacadas.indexOf(categoriaB);
          
          // Si ambas están en categorías destacadas, mantener orden original
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          // Si solo A está en destacadas, A va primero
          if (indexA !== -1 && indexB === -1) {
            return -1;
          }
          // Si solo B está en destacadas, B va primero
          if (indexA === -1 && indexB !== -1) {
            return 1;
          }
          // Si ninguna está en destacadas, mantener orden original
          return 0;
        }
        // Para búsquedas o categorías específicas, mantener orden original
        return 0;
      });
      
      // Calcular paginación manualmente con productos filtrados
      const totalProductosFiltrados = productosOrdenados.length;
      const totalPagesCalculadas = Math.ceil(totalProductosFiltrados / itemsPerPage);
      
      // Obtener productos para la página actual
      const inicio = (pageNum - 1) * itemsPerPage;
      const fin = inicio + itemsPerPage;
      const productosParaMostrar = productosOrdenados.slice(inicio, fin);
      
      console.log('Resultado de fetchProducts:', {
        pageNum,
        productosOriginales: todosLosProductos.length,
        productosConFotos: productosConFotos.length,
        productosOrdenados: productosOrdenados.length,
        productosOcultos: todosLosProductos.length - productosConFotos.length,
        productosParaMostrar: productosParaMostrar.length,
        totalPagesCalculadas,
        totalProductosFiltrados,
        catId,
        search
      });
      
      setProductos(productosParaMostrar);
      setTotalPages(totalPagesCalculadas);
      setCurrentPage(pageNum);
      setTotalProducts(totalProductosFiltrados);
      
      // Obtener nombre de categoría si es necesario
      if (catId && todosLosProductos && todosLosProductos.length > 0) {
        try {
          const categoria = await categoriaService.getCategoria(catId);
          if (categoria) setSelectedCategory(categoria);
        } catch (err) {
          console.warn("No se pudo obtener el nombre de la categoría:", err);
        }
      }
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setProductos([]);
      setTotalPages(1);
      setCurrentPage(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  // Función para obtener categorías
  const fetchCategorias = useCallback(async () => {
    try {
      const data = await categoriaService.getCategorias();
      setCategorias(data);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
    }
  }, []);

  // Efecto para cargar categorías primero
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  // Controlar cuando el catálogo está completamente listo
  useEffect(() => {
    if (!loading && productos.length > 0) {
      // Delay para asegurar que el DOM esté completamente renderizado
      const isMobile = window.innerWidth <= 768;
      const delay = isMobile ? 300 : 150;
      
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          setCatalogReady(true);
        });
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [loading, productos]);

  // Efecto para verificar URL y cargar productos después de que las categorías estén listas
  useEffect(() => {
    if (categorias.length > 0) {
      const categoriaIdFromURL = searchParams.get('categoria_id');
      
      console.log('Verificando URL después de cargar categorías:', {
        categoriaIdFromURL,
        categoriasCargadas: categorias.length,
        searchTerm
      });
      
      if (categoriaIdFromURL) {
        // Hay categoría en URL, seleccionarla
        const categoriaIdInt = parseInt(categoriaIdFromURL);
        const categoria = categorias.find(cat => cat.id === categoriaIdInt);
        
        if (categoria) {
          console.log('Categoría encontrada en URL:', categoria);
          setSelectedCategory(categoria);
          fetchProducts(1, categoriaIdInt, searchTerm);
        } else {
          console.warn('Categoría en URL no encontrada:', categoriaIdFromURL);
          setSelectedCategory(null);
          fetchProducts(1, null, searchTerm);
        }
      } else {
        // No hay categoría en URL, mostrar todas
        console.log('No hay categoría en URL, mostrando todas');
        setSelectedCategory(null);
        fetchProducts(1, null, searchTerm);
      }
    }
  }, [categorias, searchParams, fetchProducts, searchTerm]);

  // Efecto para búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== searchRef.current?.value) return;
      fetchProducts(1, categoriaId, searchTerm);
      
      // Scroll hacia arriba cuando se ejecuta la búsqueda
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoriaId, fetchProducts]);

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage && !loading) {
      console.log(`Cambiando a página ${newPage} de ${totalPages}`);
      fetchProducts(newPage, categoriaId, searchTerm);
      // Scroll hacia arriba para mejor UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Función para cambiar categoría
  const handleCategoryChange = (catId) => {
    const categoriaData = catId ? categorias.find(cat => cat.id === catId) : null;
    
    // Actualizar el contexto con la categoría seleccionada
    if (catId) {
      setContextCategory(catId, categoriaData);
    } else {
      clearSelectedCategory();
    }
    fetchProducts(1, catId, searchTerm);
    setShowFilters(false);
    
    // Actualizar URL para mantener estado en refresh
    if (catId) {
      navigate(`/catalogo?categoria_id=${catId}`, { replace: true });
    } else {
      navigate('/catalogo', { replace: true });
    }
    
    // Scroll hacia arriba para mejor UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    clearSelectedCategory();
    setSelectedCategory(null);
    setSortBy('nombre');
    fetchProducts(1, null, '');
    
    // Scroll hacia arriba para mejor UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para cambiar ordenamiento
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setShowSortMenu(false);
    // Aquí podrías implementar la lógica de ordenamiento
    // Por ahora solo actualizamos el estado
  };

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Opciones de ordenamiento
  const sortOptions = [
    { value: 'nombre', label: 'Nombre A-Z' },
    { value: 'precio_asc', label: 'Precio: Menor a Mayor' },
    { value: 'precio_desc', label: 'Precio: Mayor a Menor' },
    { value: 'nuevos', label: 'Más Recientes' },
    { value: 'destacados', label: 'Destacados' }
  ];

  return (
    <div className="catalogo-page">
      {/* Header Principal */}
      <div className="catalogo-header">
        <div className="header-content">
          <h1 className="page-title">
            {selectedCategory ? selectedCategory.nombre : 'Catálogo de Productos'}
          </h1>
          <p className="page-subtitle">
            {selectedCategory 
              ? `Explora nuestra selección de ${selectedCategory.nombre.toLowerCase()}`
              : 'Descubre nuestra amplia gama de productos de seguridad industrial'
            }
          </p>
        </div>
      </div>

      {/* Contenedor Principal con Sidebar */}
      <div className="catalogo-main-container">
        {/* Sidebar de Categorías - Desktop */}
        <aside className="categories-sidebar desktop-only">
          <div className="sidebar-header">
            <h3>Categorías</h3>
            <button 
              className="close-sidebar-btn mobile-only"
              onClick={() => setShowFilters(false)}
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="categories-list">
            <button
              className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => handleCategoryChange(null)}
            >
              Todas las categorías
            </button>
            {categorias.map(categoria => (
              <button
                key={categoria.id}
                className={`category-btn ${selectedCategory?.id === categoria.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(categoria.id)}
              >
                {categoria.nombre}
              </button>
            ))}
          </div>
        </aside>

        {/* Contenido Principal */}
        <div className="main-content-wrapper">
          {/* Barra de Herramientas */}
          <div className="toolbar-section">
            <div className="toolbar-container">
              {/* Búsqueda */}
              <div className="search-section">
                <div className="search-input-container">
                  <FaSearch className="search-icon" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="clear-search-btn"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {/* Controles */}
              <div className="controls-section">
                {/* Filtros - Solo Mobile */}
                <div className="filter-control mobile-only" ref={filtersRef}>
                  <button
                    className={`filter-btn ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FaFilter />
                    <span>Filtros</span>
                    {selectedCategory && (
                      <span className="filter-count">1</span>
                    )}
                  </button>
                  
                  {showFilters && (
                    <div className="filter-dropdown">
                      <div className="filter-header">
                        <h3>Categorías</h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="close-btn"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      <div className="filter-content">
                        <div className="category-list">
                          <button
                            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(null)}
                          >
                            Todas las categorías
                          </button>
                          {categorias.map(categoria => (
                            <button
                              key={categoria.id}
                              className={`category-btn ${selectedCategory?.id === categoria.id ? 'active' : ''}`}
                              onClick={() => handleCategoryChange(categoria.id)}
                            >
                              {categoria.nombre}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ordenamiento */}
                <div className="sort-control" ref={sortMenuRef}>
                  <button
                    className={`sort-btn ${showSortMenu ? 'active' : ''}`}
                    onClick={() => setShowSortMenu(!showSortMenu)}
                  >
                    <FaSortAmountDown />
                    <span>Ordenar</span>
                    <FaChevronDown className="chevron" />
                  </button>
                  
                  {showSortMenu && (
                    <div className="sort-dropdown">
                      {sortOptions.map(option => (
                        <button
                          key={option.value}
                          className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                          onClick={() => handleSortChange(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vista */}
                <div className="view-controls">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Vista en cuadrícula"
                  >
                    <FaTh />
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="Vista en lista"
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Resultados - Solo cuando hay búsqueda activa */}
          {!loading && searchTerm && (
            <div className="results-info">
              <div className="results-stats">
                <span className="results-count">
                  {totalProducts} producto{totalProducts !== 1 ? 's' : ''} encontrado{totalProducts !== 1 ? 's' : ''}
                </span>
                <span className="search-term">
                  para "<span className="search-highlight">{searchTerm}</span>"
                </span>
                {selectedCategory && (
                  <span className="category-term">
                    en {selectedCategory.nombre}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Lista de Productos */}
          <div className="products-section">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando productos...</p>
              </div>
            ) : productos.length > 0 ? (
              <>
                <div className={`products-grid ${viewMode}-view`}>
                  {productos.map(producto => (
                    catalogReady ? (
                      <ProductCard 
                        key={producto.id} 
                        producto={producto} 
                        viewMode={viewMode}
                      />
                    ) : (
                      <div key={producto.id} className="product-card-skeleton">
                        <div className="skeleton-content"></div>
                      </div>
                    )
                  ))}
                </div>
                
                {/* Paginación */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalProducts}
                  itemsPerPage={itemsPerPage}
                  loading={loading}
                />
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No se encontraron productos</h3>
                <p>
                  {searchTerm 
                    ? `No hay productos que coincidan con "${searchTerm}"`
                    : selectedCategory
                    ? `No hay productos disponibles en ${selectedCategory.nombre}`
                    : 'No hay productos disponibles'
                  }
                </p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogo;