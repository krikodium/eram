import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import CategoryPreview from '../components/CategoryPreview';
import './Catalogo.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:3001', []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState('Todos los Productos');

  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [previewProducts, setPreviewProducts] = useState([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const hoverTimerRef = useRef(null);
  const sidebarRef = useRef(null); // Ref para el contenedor del sidebar

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

  useEffect(() => {
    setProductos([]);
    setPage(1);
    setHasMore(true);
    if (categoriaId) {
      fetchProducts(1, 20, false, categoriaId);
    } else {
      setPageTitle('Todos los Productos');
      fetchProducts(1, 20, false, null);
    }
  }, [categoriaId, fetchProducts]);

  const handleCategoryMouseEnter = (category, event) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    
    hoverTimerRef.current = setTimeout(async () => {
      setIsPreviewLoading(true);
      setHoveredCategory(category);

      const linkRect = event.currentTarget.getBoundingClientRect();
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      
      setPreviewPosition({
        top: linkRect.top, // A la misma altura que el link
        left: sidebarRect.right + 5 // 5px a la derecha del sidebar
      });
      
      try {
        const response = await axios.get(`${api}/api/productos/por-categoria`, {
          params: { categoria_id: category.id, limit: 5, page: 1 }
        });
        setPreviewProducts(response.data.productos || []);
      } catch (error) {
        console.error("Error fetching preview products:", error);
        setPreviewProducts([]);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 1800); // 1.8 segundos de retraso
  };

  const handleCategoryMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoveredCategory(null);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchProducts(nextPage, 15, true, categoriaId);
  };

  return (
    <div className="catalogo-container" onMouseLeave={handleCategoryMouseLeave}>
      <header className="catalogo-header">
        <h1>{pageTitle}</h1>
        <button className="toggle-categories" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <FaTimes /> : <FaFilter />}
          {showSidebar ? ' Ocultar Filtros' : ' Mostrar Filtros'}
        </button>
      </header>
      <div className={`catalogo-body ${showSidebar ? 'sidebar-visible' : ''}`}>
        <aside className="category-sidebar-wrapper" ref={sidebarRef}>
          {showSidebar && (
            <CategorySidebar
              onLinkClick={() => {
                if (window.innerWidth <= 768) setShowSidebar(false);
              }}
              onCategoryMouseEnter={handleCategoryMouseEnter}
              onCategoryMouseLeave={handleCategoryMouseLeave}
            />
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

      {hoveredCategory && (
        <CategoryPreview
          category={hoveredCategory}
          products={previewProducts}
          isLoading={isPreviewLoading}
          position={previewPosition}
        />
      )}
    </div>
  );
};

export default Catalogo;