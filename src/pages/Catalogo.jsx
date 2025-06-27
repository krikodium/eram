// src/pages/Catalogo.jsx

import { useState, useEffect } from 'react';
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
  // El estado 'showCategories' ahora controlará la visibilidad solo en móviles.
  const [showCategories, setShowCategories] = useState(false);
  const [nombreSeleccionado, setNombreSeleccionado] = useState(null);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Tu lógica para cargar datos sigue igual...
    setLoading(true);
    const fetchData = async () => {
      try {
        if (categoriaId) {
          const res = await axios.get(`${api}/api/productos/por-subcategorias`, {
            params: { categoria_id: categoriaId }
          });
          setSubcategoriasConProductos(res.data);
          setDestacados([]);
        } else {
          const res = await axios.get(`${api}/api/productos/destacados`);
          setDestacados(res.data);
          setSubcategoriasConProductos([]);
        }
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setSubcategoriasConProductos([]);
        setDestacados([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoriaId]);

  useEffect(() => {
    // Tu lógica para obtener el nombre de la categoría sigue igual...
    const fetchCategoriaNombre = async () => {
      if (!categoriaId) {
        setNombreSeleccionado(null);
        return;
      }
      try {
        const response = await axios.get(`${api}/api/categorias/${categoriaId}`);
        setNombreSeleccionado(response.data?.nombre || null);
      } catch (error) {
        console.error("Error al obtener el nombre de la categoría:", error);
        setNombreSeleccionado(null);
      }
    };
    fetchCategoriaNombre();
  }, [categoriaId, api]);

  // Esta función ahora cerrará el menú en móvil al seleccionar una categoría.
  const handleCategorySelect = () => {
    if (window.innerWidth <= 768) {
      setShowCategories(false);
    }
  };

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>

      {/* Este botón ahora será visible solo en móvil gracias a CSS */}
      <button className="toggle-categories" onClick={() => setShowCategories(prev => !prev)}>
        {showCategories ? <><FaTimes /> Ocultar Filtros</> : <><FaFilter /> Mostrar Filtros</>}
      </button>

      {categoriaId && (
        <div className="categoria-seleccionada">
          Categoría seleccionada: <strong>{nombreSeleccionado}</strong>
        </div>
      )}

      {/* Añadimos una clase 'show' cuando el menú deba ser visible en móvil */}
      <div className={`catalogo-layout ${showCategories ? 'mobile-menu-open' : ''}`}>
        
        {/* La barra lateral ahora SIEMPRE se renderiza. CSS se encargará de mostrarla u ocultarla. */}
        <CategorySidebar
          setNombreSeleccionado={setNombreSeleccionado}
          onCategorySelect={handleCategorySelect}
        />

        <main className="product-list-container">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <>
              {destacados.length > 0 && (
                <section className="categorias-destacadas">
                  {destacados.map(bloque => (
                    <div className="bloque-categoria" key={bloque.categoria_id}>
                      <h3>{bloque.categoria_nombre}</h3>
                      {/* Pasamos una columna menos para que haya espacio para el sidebar en desktop */}
                      <ProductList productos={bloque.productos} columnas={showCategories ? 2 : 3} />
                    </div>
                  ))}
                </section>
              )}

              {subcategoriasConProductos.length > 0 && (
                <section className="categorias-destacadas">
                  {subcategoriasConProductos.map(sub => (
                    <div className="bloque-categoria" key={sub.subcategoria_id}>
                      <h3>{sub.subcategoria_nombre}</h3>
                      <ProductList productos={sub.productos} columnas={showCategories ? 2 : 3} />
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalogo;