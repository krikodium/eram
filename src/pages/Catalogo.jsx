// src/pages/Catalogo.jsx (LÓGICA SIMPLIFICADA)
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Catalogo = () => {
  const [items, setItems] = useState([]); // Un único estado para los items a mostrar
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
          // Si es vista por categoría, la API devuelve un array de bloques
          setItems(response.data || []);
          setIsCategorizedView(true);
          setPageTitle('Categoría');
        } else {
          // Si es vista general, la API devuelve { productos: [...] }
          // Nos aseguramos de pasar SIEMPRE un array
          setItems(response.data.productos || []);
          setIsCategorizedView(false);
          setPageTitle('Catálogo Completo');
        }
      })
      .catch(err => {
        console.error("Error al obtener datos:", err);
        setItems([]); // En caso de error, aseguramos que sea un array vacío
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoriaId, api]);

  const renderContent = () => {
    if (loading) return <p className="status-text">Cargando productos...</p>;
    if (!items || items.length === 0) return <p className="status-text">No se encontraron productos.</p>;

    // Si es la vista por categorías, mapeamos los bloques
    if (isCategorizedView) {
      return items.map(bloque => (
        bloque.productos && bloque.productos.length > 0 && (
          <section key={bloque.subcategoria_id} className="product-category-section">
            <h2>{bloque.subcategoria_nombre}</h2>
            <ProductList productos={bloque.productos} />
          </section>
        )
      ));
    }

    // Si es la vista general, pasamos la lista de productos directamente
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