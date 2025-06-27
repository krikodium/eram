// src/pages/Catalogo.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Catalogo = () => {
  const [productosPorBloque, setProductosPorBloque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false); // Estado para controlar el sidebar
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    setLoading(true);
    // Cierra el sidebar al cambiar de categoría para una mejor experiencia en móvil
    setShowSidebar(false);

    const fetchData = async () => {
      try {
        const endpoint = categoriaId
          ? `${api}/api/productos/por-subcategorias`
          : `${api}/api/productos/destacados`;
        
        const params = categoriaId ? { categoria_id: categoriaId } : {};
        
        const response = await axios.get(endpoint, { params });
        setProductosPorBloque(response.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setProductosPorBloque([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoriaId, api]);

  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <h1>Catálogo de Productos</h1>
        <button className="toggle-categories-button" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <FaTimes /> : <FaFilter />}
          {showSidebar ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </div>

      <div className="catalogo-body">
        {/* El sidebar se renderiza condicionalmente y se posiciona a la izquierda */}
        {showSidebar && (
          <div className="sidebar-container">
            <CategorySidebar onLinkClick={() => setShowSidebar(false)} />
          </div>
        )}
        
        {/* El contenedor principal de productos se ajustará automáticamente */}
        <main className="product-grid-container">
          {loading ? (
            <p className="status-text">Cargando productos...</p>
          ) : (
            productosPorBloque.length > 0 ? (
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