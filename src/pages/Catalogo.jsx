// src/pages/Catalogo.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Catalogo = () => {
  const [subcategoriasConProductos, setSubcategoriasConProductos] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [nombreSeleccionado, setNombreSeleccionado] = useState('');
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const params = categoriaId ? { categoria_id: categoriaId } : {};
        const url = categoriaId ? `${api}/api/productos/por-subcategorias` : `${api}/api/productos/destacados`;
        const res = await axios.get(url, { params });
        
        if (categoriaId) {
          setSubcategoriasConProductos(res.data);
          setDestacados([]);
        } else {
          setDestacados(res.data);
          setSubcategoriasConProductos([]);
        }
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoriaId, api]);

  useEffect(() => {
    // ... (el resto de los useEffects se mantienen igual)
  }, [categoriaId, api]);

  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <h1>Catálogo de Productos</h1>
        <button className="toggle-categories" onClick={() => setShowCategories(prev => !prev)}>
          {showCategories ? <><FaTimes /> Ocultar Filtros</> : <><FaFilter /> Mostrar Filtros</>}
        </button>
      </div>

      <div className="catalogo-layout">
        {showCategories && <CategorySidebar onLinkClick={() => setShowCategories(false)} />}
        <main className="product-list-container">
          {/* ... (el resto del JSX para mostrar productos se mantiene) ... */}
        </main>
      </div>
    </div>
  );
};
export default Catalogo;