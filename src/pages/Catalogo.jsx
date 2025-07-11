// src/pages/Catalogo.jsx (VERSIÓN CON "CARGAR MÁS")
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
  
  // Nuevos estados para la paginación
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState('Todos los Productos');

  // Función para cargar productos, ahora reutilizable
  const fetchProducts = useCallback(async (pageNum, limit, append = false) => {
    setLoading(true);
    try {
      // Siempre usaremos el endpoint que devuelve todos los productos con paginación
      const response = await axios.get(`${api}/api/productos`, {
        params: { page: pageNum, limit: limit }
      });
      
      const { productos: nuevosProductos, totalPages } = response.data;

      if (append) {
        // Si es para "Cargar más", añade los productos a la lista existente
        setProductos(prev => [...prev, ...nuevosProductos]);
      } else {
        // Si es la carga inicial, reemplaza la lista
        setProductos(nuevosProductos);
      }
      
      // Actualiza si hay más páginas para cargar
      setHasMore(pageNum < totalPages);
      setPage(pageNum);

    } catch (err) {
      console.error("Error al obtener productos:", err);
      setHasMore(false); // Detiene la carga si hay un error
    } finally {
      setLoading(false);
    }
  }, [api]);


  // Efecto para la carga inicial
  useEffect(() => {
    // Cuando el componente se monta o cambia la categoría, reseteamos y cargamos la primera página
    setProductos([]); // Limpiamos la lista anterior
    setPage(1);
    setHasMore(true);
    
    // Aquí podrías implementar la lógica para filtrar por categoría en el futuro.
    // Por ahora, siempre mostramos "Todos los productos".
    if (categoriaId) {
        setPageTitle("Filtro de Categoría (Próximamente)");
        setLoading(false);
        setProductos([]);
        setHasMore(false);
    } else {
        setPageTitle('Todos los Productos');
        fetchProducts(1, 20); // Carga inicial de 20 productos
    }

  }, [categoriaId, fetchProducts]);


  // Handler para el botón "Cargar más"
  const handleLoadMore = () => {
    const nextPage = page + 1;
    // Las siguientes cargas traen 15 productos
    fetchProducts(nextPage, 15, true); 
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
          {productos.length > 0 ? <ProductList productos={productos} /> : !loading && <p>No se encontraron productos.</p>}

          {/* Botón de "Cargar más" */}
          <div className="load-more-container">
            {loading && <p>Cargando...</p>}
            {!loading && hasMore && (
              <button onClick={handleLoadMore} className="load-more-btn">
                Cargar más
              </button>
            )}
            {!loading && !hasMore && productos.length > 0 && (
              <p>Has llegado al final de la lista.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Catalogo;