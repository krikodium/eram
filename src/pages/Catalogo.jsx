// src/pages/Catalogo.jsx

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css';

const PRODUCTOS_POR_PAGINA = 18; // Podés ajustar este número

function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Para saber si hay más productos por cargar
  const [showCategories, setShowCategories] = useState(false);
  const [nombreSeleccionado, setNombreSeleccionado] = useState(null);

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoria_id');

  // Hook para cargar productos iniciales o cuando cambia la categoría
  useEffect(() => {
    // Reseteamos todo cuando cambia la categoría
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);

    const fetchInitialProducts = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/productos`;
      
      try {
        const response = await axios.get(apiUrl, {
          params: {
            categoria: categoryId,
            limit: PRODUCTOS_POR_PAGINA,
            page: 1,
          },
        });
        
        setProducts(response.data);
        // Si la API devuelve menos productos de los que pedimos, no hay más páginas
        if (response.data.length < PRODUCTOS_POR_PAGINA) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, [categoryId]); // Se ejecuta cada vez que cambia la categoría

  // Función para cargar más productos
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    
    const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/productos`;
    
    try {
      const response = await axios.get(apiUrl, {
        params: {
          categoria: categoryId,
          limit: PRODUCTOS_POR_PAGINA,
          page: nextPage,
        },
      });

      if (response.data.length > 0) {
        // Añadimos los nuevos productos a la lista existente
        setProducts(prevProducts => [...prevProducts, ...response.data]);
        setPage(nextPage);
      }
      
      // Si la API devuelve menos productos de los que pedimos, ya no hay más
      if (response.data.length < PRODUCTOS_POR_PAGINA) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error al cargar más productos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>

      <button className="toggle-categories" onClick={() => setShowCategories(prev => !prev)}>
        {showCategories ? 'Ocultar Categorías' : 'Mostrar Categorías'}
      </button>

      {categoryId && (
        <div className="categoria-seleccionada">
          Categoría seleccionada: <strong>{nombreSeleccionado}</strong>
        </div>
      )}

      <div className={`catalogo-layout ${showCategories ? 'menu-abierto' : 'menu-cerrado'}`}>
        {showCategories && <CategorySidebar setNombreSeleccionado={setNombreSeleccionado} />}

        <main className="product-list-container">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <ProductList productos={products} columnas={showCategories ? 2 : 3} />
          )}

          {/* Botón para Cargar Más */}
          <div className="load-more-container">
            {hasMore && !loading && (
              <button onClick={handleLoadMore} disabled={loadingMore} className="load-more-btn">
                {loadingMore ? 'Cargando...' : 'Cargar Más'}
              </button>
            )}
            {!hasMore && products.length > 0 && (
              <p>No hay más productos para mostrar.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Catalogo;