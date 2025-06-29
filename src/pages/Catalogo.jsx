// src/pages/Catalogo.jsx (CORRECCIÓN FINAL)
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Catalogo = () => {
  const [productosPorBloque, setProductosPorBloque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:3001', []);
  // Nuevo estado para el nombre de la categoría principal
  const [mainCategoryName, setMainCategoryName] = useState('Catálogo de Productos');

  useEffect(() => {
    setLoading(true);

    let endpoint = `${api}/api/productos`;
    let params = {};
    
    // Si hay un ID de categoría, usamos el endpoint específico
    if (categoriaId) {
      endpoint = `${api}/api/productos/por-subcategorias`;
      params = { categoria_id: categoriaId };
    }
    
    axios.get(endpoint, { params })
      .then(response => {
        // --- AQUÍ ESTÁ LA LÓGICA CORREGIDA ---
        const data = response.data;
        
        if (categoriaId) {
          // Si filtramos por categoría, la API ya devuelve un array de bloques
          setProductosPorBloque(data);
          // Opcional: Podríamos obtener el nombre de la categoría padre aquí para el título
          if (data.length > 0) {
             // Esta parte es una mejora, puedes ajustarla si necesitas el nombre exacto
             setMainCategoryName(`Categoría: ${data[0].subcategoria_nombre || ''}`);
          }

        } else {
          // Si NO filtramos (vista general), recibimos el objeto { productos: [...] }
          // Lo transformamos en un array con UN solo bloque, que es lo que el .map() espera.
          setProductosPorBloque([
            {
              categoria_id: 'todos',
              categoria_nombre: 'Todos los Productos',
              productos: data.productos || [] // Aseguramos que sea un array
            }
          ]);
          setMainCategoryName('Catálogo Completo');
        }
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setProductosPorBloque([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoriaId, api]);

  const handleSidebarLinkClick = () => {
    setShowSidebar(false);
  };

  return (
    <div className="catalogo-container">
      <header className="catalogo-header">
        <h1>{mainCategoryName}</h1>
        <button className="toggle-categories-button" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <FaTimes /> : <FaFilter />}
          {showSidebar ? ' Ocultar Filtros' : ' Mostrar Filtros'}
        </button>
      </header>

      <div className="catalogo-body">
        {showSidebar && (
          <aside className="sidebar-container">
            <CategorySidebar onLinkClick={handleSidebarLinkClick} />
          </aside>
        )}
        <main className="product-grid-container">
          {loading ? (
            <p className="status-text">Cargando productos...</p>
          ) : (
            productosPorBloque.length > 0 && productosPorBloque[0].productos.length > 0 ? (
              productosPorBloque.map(bloque => (
                <section key={bloque.categoria_id || bloque.subcategoria_id} className="product-category-section">
                  <h2>{bloque.categoria_nombre || bloque.subcategoria_nombre}</h2>
                  <ProductList productos={bloque.productos} />
                </section>
              ))
            ) : (
              <p className="status-text">No se encontraron productos.</p>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalogo;