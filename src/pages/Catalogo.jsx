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

    const fetchData = async () => {
      try {
        if (categoriaId) {
          const response = await axios.get(`${api}/api/productos/por-subcategorias`, {
            params: { categoria_id: categoriaId }
          });
          const bloques = Array.isArray(response.data)
            ? response.data.filter(b => Array.isArray(b.productos))
            : [];
          setItems(bloques);
          setIsCategorizedView(true);
          setPageTitle('Categoría');
        } else {
          const response = await axios.get(`${api}/api/productos/destacados`);
          const bloques = Array.isArray(response.data)
            ? response.data.filter(b => Array.isArray(b.productos))
            : [];
          setItems(bloques);
          setIsCategorizedView(true);
          setPageTitle('Productos Destacados');
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoriaId, api]);

  const renderContent = () => {
    if (loading) return <p className="status-text">Cargando productos...</p>;
    if (!items || items.length === 0) return <p className="status-text">No se encontraron productos.</p>;

    if (isCategorizedView) {
      return Array.isArray(items)
        ? items.map(bloque => (
            bloque.productos && bloque.productos.length > 0 && (
              <section key={bloque.subcategoria_id || bloque.categoria_id} className="product-category-section">
                <h2>{bloque.subcategoria_nombre || bloque.categoria_nombre}</h2>
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Catalogo;
