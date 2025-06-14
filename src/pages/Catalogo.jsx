import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const PRODUCTOS_POR_PAGINA = 18;

function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [nombreSeleccionado, setNombreSeleccionado] = useState(null);

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoria_id');

  useEffect(() => {
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
  }, [categoryId]);

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
        setProducts(prevProducts => [...prevProducts, ...response.data]);
        setPage(nextPage);
      }
      if (response.data.length < PRODUCTOS_POR_PAGINA) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error al cargar más productos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Función para manejar el cierre del menú al seleccionar categoría
  const handleCategorySelect = () => {
    // Solo cerramos el menú en pantallas pequeñas (móvil)
    if (window.innerWidth <= 768) {
      setShowCategories(false);
    }
  };

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>

      <button className="toggle-categories" onClick={() => setShowCategories(prev => !prev)}>
        {showCategories ? (
          <>
            <FaTimes /> Ocultar Filtros
          </>
        ) : (
          <>
            <FaFilter /> Mostrar Filtros
          </>
        )}
      </button>

      {categoryId && (
        <div className="categoria-seleccionada">
          Categoría seleccionada: <strong>{nombreSeleccionado}</strong>
        </div>
      )}

      <div className={`catalogo-layout ${showCategories ? 'menu-abierto' : 'menu-cerrado'}`}>
        {/* Aquí pasamos la nueva función como prop */}
        {showCategories && (
          <CategorySidebar 
            setNombreSeleccionado={setNombreSeleccionado} 
            onCategorySelect={handleCategorySelect}
          />
        )}

        <main className="product-list-container">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <ProductList productos={products} columnas={showCategories ? 2 : 3} />
          )}

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