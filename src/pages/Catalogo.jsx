// src/pages/Catalogo.jsx (VERSIÓN FINAL CON FILTRO FUNCIONAL)
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:3001', []);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState('Todos los Productos');

  // Función de carga ahora maneja ambos casos: todos los productos o por categoría
  const fetchProducts = useCallback(async (pageNum, limit, append = false, catId = null) => {
    setLoading(true);
    let endpoint = `${api}/api/productos`;
    let params = { page: pageNum, limit };

    if (catId) {
      // Si se provee un ID de categoría, cambiamos el endpoint y los parámetros
      endpoint = `${api}/api/productos/por-categoria`;
      params.categoria_id = catId;
    }

    try {
      const response = await axios.get(endpoint, { params });
      const { productos: nuevosProductos, totalPages, categoriaNombre } = response.data;

      setProductos(prev => append ? [...prev, ...nuevosProductos] : nuevosProductos);
      setHasMore(pageNum < totalPages);
      setPage(pageNum);
      if (categoriaNombre) {
        setPageTitle(categoriaNombre); // Actualiza el título si viene de una categoría
      }

    } catch (err) {
      console.error("Error al obtener productos:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [api]);


  // Efecto para la carga inicial o cuando cambia la categoría
  useEffect(() => {
    setProductos([]);
    setPage(1);
    setHasMore(true);
    
    if (categoriaId) {
      fetchProducts(1, 20, false, categoriaId); // Carga inicial de 20 para la categoría
    } else {
      setPageTitle('Todos los Productos');
      fetchProducts(1, 20, false, null); // Carga inicial de 20 para "todos"
    }
  // Se debe incluir categoriaId en las dependencias para que se ejecute al cambiar de categoría
  }, [categoriaId, fetchProducts]);


  // Handler para el botón "Cargar más"
  const handleLoadMore = () => {
    const nextPage = page + 1;
    // Las cargas siguientes son de 15 productos, pasando el categoriaId si existe
    fetchProducts(nextPage, 15, true, categoriaId); 
  };
  
  return (
    <div className="catalogo-container">
      <header className="catalogo-header">
        <h1>{pageTitle}</h1>
        <button className="toggle-categories" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <FaTimes /> : <FaFilter />}
          {showSidebar ? ' Ocultar Filtros' : ' Mostrar Filtros'}
        </button>
      </header>
      <div className="catalogo-body">
        {showSidebar && (
          <aside className="category-sidebar">
            <CategorySidebar onLinkClick={() => setShowSidebar(false)} />
          </aside>
        )}
        <main className="product-grid-container">
          {productos.length > 0 ? <ProductList productos={productos} /> : !loading && <p className="status-text">No se encontraron productos.</p>}

          <div className="load-more-container">
            {loading && page > 1 && <p>Cargando más productos...</p>}
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
    </div>
  );
};

export default Catalogo;