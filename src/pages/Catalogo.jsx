// src/pages/Catalogo.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Catalogo = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategorizedView, setIsCategorizedView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:3001', []);
  const [pageTitle, setPageTitle] = useState('Catálogo de Productos');

  useEffect(() => {
    setLoading(true);
    const endpoint = categoriaId 
      ? `${api}/api/productos/por-subcategorias` 
      : `${api}/api/productos`;

    const params = categoriaId 
      ? { categoria_id: categoriaId }
      : { page: 1, limit: 100 };

    axios.get(endpoint, { params })
      .then(response => {
        if (categoriaId) {
          const bloques = Array.isArray(response.data)
            ? response.data.filter(b => Array.isArray(b.productos))
            : [];
          setItems(bloques);
          setIsCategorizedView(true);
          setPageTitle('Categoría');
        } else {
          const productos = Array.isArray(response.data?.productos)
            ? response.data.productos
            : [];
          setItems(productos);
          setIsCategorizedView(false);
          setPageTitle('Catálogo Completo');
        }
      })
      .catch(err => {
        console.error("Error al obtener datos:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoriaId, api]);

  const renderContent = () => {
    if (loading) return <p className="status-text">Cargando productos...</p>;
    if (!items || items.length === 0) return <p className="status-text">No se encontraron productos.</p>;

    if (isCategorizedView) {
      return Array.isArray(items)
        ? items.map(bloque => (
            bloque.productos && bloque.productos.length > 0 && (
              <section key={bloque.subcategoria_id} className="product-category-section">
                <h2>{bloque.subcategoria_nombre}</h2>
                <ProductList productos={bloque.productos} />
              </section>
            )
          ))
        : <p className="status-text">Error al cargar las categorías.</p>;
    }

    return (
      <section className="product-category-section">
        <ProductList productos={items} />
      </section>
    );
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
        {showSidebar && <CategorySidebar onLinkClick={() => setShowSidebar(false)} />}
        <main className="product-grid-container">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Catalogo;
