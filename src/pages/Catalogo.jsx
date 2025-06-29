// src/pages/Catalogo.jsx (CON DEBUG)
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Catalogo = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categorizedProducts, setCategorizedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:3001', []);
  const [pageTitle, setPageTitle] = useState('Catálogo de Productos');

  useEffect(() => {
    setLoading(true);
    setAllProducts([]);
    setCategorizedProducts([]);

    if (categoriaId) {
      axios.get(`${api}/api/productos/por-subcategorias`, { params: { categoria_id: categoriaId } })
        .then(response => {
          // --- AÑADIR ESTA LÍNEA PARA DEBUG ---
          console.log('Respuesta de la API (/por-subcategorias):', response.data);
          setCategorizedProducts(response.data || []);
        })
        .catch(err => console.error("Error al cargar productos por categoría:", err))
        .finally(() => setLoading(false));
    } else {
      setPageTitle('Catálogo Completo');
      axios.get(`${api}/api/productos`, { params: { page: 1, limit: 100 } })
        .then(response => {
          // --- AÑADIR ESTA LÍNEA PARA DEBUG ---
          console.log('Respuesta de la API (/productos):', response.data);
          setAllProducts(response.data.productos || []);
        })
        .catch(err => console.error("Error al cargar todos los productos:", err))
        .finally(() => setLoading(false));
    }
  }, [categoriaId, api]);

  const handleSidebarLinkClick = () => {
    setShowSidebar(false);
  };

  // Función separada para renderizar el contenido principal
  const renderContent = () => {
    if (loading) {
      return <p className="status-text">Cargando productos...</p>;
    }
    
    // CASO 1: Renderizar bloques de subcategorías
    if (categoriaId) {
      if (categorizedProducts.length > 0) {
        return categorizedProducts.map(bloque => (
          bloque.productos.length > 0 && (
            <section key={bloque.subcategoria_id} className="product-category-section">
              <h2>{bloque.subcategoria_nombre}</h2>
              <ProductList productos={bloque.productos} />
            </section>
          )
        ));
      }
      return <p className="status-text">No se encontraron productos en esta categoría.</p>;
    }

    // CASO 2: Renderizar la lista de todos los productos
    if (allProducts.length > 0) {
      return (
        <section className="product-category-section">
          {/* No necesitamos título de categoría aquí porque ya está el título principal */}
          <ProductList productos={allProducts} />
        </section>
      );
    }

    return <p className="status-text">No se encontraron productos.</p>;
  };

  return (
    <div className="catalogo-container">
      <header className="catalogo-header">
        <h1>{pageTitle}</h1>
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Catalogo;