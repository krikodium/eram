import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import CategoryPreview from '../components/CategoryPreview';
import RubrosFilter from '../features/rubros/components/RubrosFilter';
import { rubrosService } from '../services/api';
import { getRubroById } from '../mocks/rubros';
import './Catalogo.css';
import { FaFilter, FaTimes, FaIndustry } from 'react-icons/fa';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const rubroId = searchParams.get('rubro_id');
  const api = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:3001', []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState('Todos los Productos');
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Estado unificado para la previsualización
  const [preview, setPreview] = useState({
    category: null,
    products: [],
    isLoading: false,
    position: { top: 0, left: 0 },
  });
  
  const hoverTimerRef = useRef(null);
  const sidebarRef = useRef(null);

  const fetchProducts = useCallback(async (pageNum, limit, append = false, catId = null) => {
    setLoading(true);
    let endpoint = `${api}/api/productos`;
    let params = { page: pageNum, limit };
    if (catId) {
      endpoint = `${api}/api/productos/por-categoria`;
      params.categoria_id = catId;
    }
    try {
      const response = await axios.get(endpoint, { params });
      const { productos: nuevosProductos, totalPages, categoriaNombre } = response.data;
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
  }, [api]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setShowSidebar(false);
      else setShowSidebar(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle rubro filtering
  useEffect(() => {
    if (rubroId) {
      const rubro = getRubroById(parseInt(rubroId));
      if (rubro) {
        setPageTitle(`${rubro.nombre} - Productos`);
        // For now, we'll still call the existing API since we're keeping existing functionality
        fetchProducts(1, 20, false, null);
      }
    }
  }, [rubroId, fetchProducts]);

  useEffect(() => {
    setProductos([]);
    setPage(1);
    setHasMore(true);
    
    if (rubroId && !categoriaId) {
      // Just selected a rubro, load all products (simulation for Phase 1)
      const rubro = getRubroById(parseInt(rubroId));
      if (rubro) {
        setPageTitle(`${rubro.nombre} - Productos`);
        fetchProducts(1, 20, false, null);
      }
    } else if (categoriaId) {
      // Category selected, fetch by category
      fetchProducts(1, 20, false, categoriaId);
    } else {
      // No filters, show all
      setPageTitle('Todos los Productos');
      fetchProducts(1, 20, false, null);
    }
  }, [categoriaId, rubroId, fetchProducts]);

  const handleCategoryMouseEnter = (category, event) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    
    // Capturamos las coordenadas al momento del hover
    const linkRect = event.currentTarget.getBoundingClientRect();
    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const calculatedPosition = {
      // Centramos verticalmente el popup con el link
      top: linkRect.top + (linkRect.height / 2),
      left: sidebarRect.right + 15 // 15px a la derecha del sidebar
    };

    hoverTimerRef.current = setTimeout(async () => {
      setPreview(prev => ({
        ...prev,
        category: category,
        isLoading: true,
        position: calculatedPosition,
      }));
      
      try {
        const response = await axios.get(`${api}/api/productos/por-categoria`, {
          params: { categoria_id: category.id, limit: 5, page: 1 }
        });
        setPreview(prev => ({
          ...prev,
          products: response.data.productos || [],
          isLoading: false,
        }));
      } catch (error) {
        console.error("Error fetching preview products:", error);
        setPreview(prev => ({ ...prev, products: [], isLoading: false }));
      }
    }, 1800);
  };

  const handleCategoryMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    // Ocultamos el pop-up al salir del área
    setPreview(prev => ({ ...prev, category: null }));
  };

  const handleRubroSelect = (rubro) => {
    // This is handled by URL params through RubrosFilter component
    // The useEffect will detect the change and update accordingly
    console.log('Rubro selected:', rubro);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchProducts(nextPage, 15, true, categoriaId);
  };

  return (
    <div className="catalogo-container">
      <header className="catalogo-header">
        <h1>
          {rubroId && <FaIndustry style={{ marginRight: '0.5rem' }} />}
          {pageTitle}
        </h1>
        <button className="toggle-categories" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <FaTimes /> : <FaFilter />}
          {showSidebar ? ' Ocultar Filtros' : ' Mostrar Filtros'}
        </button>
      </header>
      
      {/* Horizontal Rubros Filter - Above Main Content */}
      <div className="rubros-filter-horizontal-wrapper">
        <RubrosFilter onRubroSelect={handleRubroSelect} />
      </div>
      
      <div className={`catalogo-body ${showSidebar ? 'sidebar-visible' : ''}`}>
        <aside className="category-sidebar-wrapper" ref={sidebarRef} onMouseLeave={handleCategoryMouseLeave}>
          {showSidebar && (
            <>
              {/* Existing Category Sidebar */}
              <CategorySidebar
                onLinkClick={() => {
                  if (window.innerWidth <= 768) setShowSidebar(false);
                }}
                onCategoryMouseEnter={handleCategoryMouseEnter}
                // Ya no necesitamos onCategoryMouseLeave en cada link
              />
            </>
          )}
        </aside>
        <main className="product-grid-container">
          {productos.length > 0 ? (
            <ProductList productos={productos} />
          ) : !loading && (
            <p className="status-text">No se encontraron productos.</p>
          )}

          <div className="load-more-container">
            {loading && page > 1 && <p className="status-text">Cargando más productos...</p>}
            {!loading && hasMore && (
              <button onClick={handleLoadMore} className="load-more-btn">
                Cargar más
              </button>
            )}
            {!loading && !hasMore && productos.length > 0 && (
              <p className="status-text">Has llegado al final de la lista.</p>
            )}
          </div>
        </main>
      </div>

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