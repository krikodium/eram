import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import CategoryPreview from '../components/CategoryPreview'; // Importar nuevo componente
import './Catalogo.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Catalogo = () => {
  // Estados existentes
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:3001', []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState('Todos los Productos');

  // 👇🏼 NUEVOS ESTADOS Y REF PARA LA PREVISUALIZACIÓN 👇🏼
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [previewProducts, setPreviewProducts] = useState([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const hoverTimerRef = useRef(null);

  const fetchProducts = useCallback(async (pageNum, limit, append = false, catId = null) => {
    // ... (sin cambios en esta función)
  }, [api]);

  // ... (sin cambios en los useEffect existentes)

  // 👇🏼 NUEVAS FUNCIONES PARA MANEJAR EL HOVER 👇🏼
  const handleCategoryMouseEnter = (category, event) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    hoverTimerRef.current = setTimeout(async () => {
      setIsPreviewLoading(true);
      setHoveredCategory(category);
      
      const rect = event.currentTarget.getBoundingClientRect();
      setPreviewPosition({
        top: rect.top,
        left: rect.right + 10 // 10px a la derecha del elemento
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
    }, 2500); // 2.5 segundos de retraso
  };

  const handleCategoryMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
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
        <aside className="category-sidebar-wrapper">
            {showSidebar && (
                <CategorySidebar 
                  onLinkClick={() => {
                    if (window.innerWidth <= 768) {
                      setShowSidebar(false);
                    }
                  }}
                  // 👇🏼 Pasar las nuevas funciones como props 👇🏼
                  onCategoryMouseEnter={handleCategoryMouseEnter}
                  onCategoryMouseLeave={handleCategoryMouseLeave}
                />
            )}
        </aside>
        <main className="product-grid-container">
          {productos.length > 0 ? <ProductList productos={productos} /> : !loading && <p className="status-text">No se encontraron productos.</p>}
          <div className="load-more-container">
            {/* ... */}
          </div>
        </main>
      </div>
      
      {/* 👇🏼 RENDERIZAR EL POP-UP DE PREVISUALIZACIÓN 👇🏼 */}
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