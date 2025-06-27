// src/pages/Catalogo.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css'; // Asegúrate que este import existe
import { FaFilter, FaTimes } from 'react-icons/fa';

const Catalogo = () => {
  // Toda la lógica de estados y carga de datos se mantiene igual
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
        if (categoriaId) {
          const res = await axios.get(`${api}/api/productos/por-subcategorias`, { params: { categoria_id: categoriaId } });
          setSubcategoriasConProductos(res.data);
          setDestacados([]);
        } else {
          const res = await axios.get(`${api}/api/productos/destacados`);
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
    const fetchCategoriaNombre = async () => {
      if (!categoriaId) {
        setNombreSeleccionado('Productos Destacados');
        return;
      }
      try {
        const response = await axios.get(`${api}/api/categorias/${categoriaId}`);
        setNombreSeleccionado(response.data?.nombre || '');
      } catch (error) {
        setNombreSeleccionado('');
      }
    };
    fetchCategoriaNombre();
  }, [categoriaId, api]);

  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <h1>Catálogo de Productos</h1>
        
        {/* LA CLAVE ESTÁ AQUÍ: Este botón debe existir en tu código. */}
        <button className="toggle-categories" onClick={() => setShowCategories(prev => !prev)}>
          {showCategories ? <><FaTimes /> Ocultar Filtros</> : <><FaFilter /> Mostrar Filtros</>}
        </button>
      </div>

      <div className="categoria-seleccionada">
        Mostrando: <strong>{loading ? 'Cargando...' : nombreSeleccionado}</strong>
      </div>
      
      <div className="catalogo-layout">
        {showCategories && <CategorySidebar onLinkClick={() => setShowCategories(false)} />}
        
        <main className="product-list-container">
          {/* El resto del código para mostrar productos... */}
          {loading && <p className="loading-text">Cargando productos...</p>}
          {/* ... */}
        </main>
      </div>
    </div>
  );
};

export default Catalogo;