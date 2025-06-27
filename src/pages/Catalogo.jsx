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
  const [showCategories, setShowCategories] = useState(false);
  const [nombreSeleccionado, setNombreSeleccionado] = useState(null);
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
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
  // Obtener el nombre real de la categoría padre seleccionada
useEffect(() => {
  const fetchCategoriaNombre = async () => {
    if (!categoriaId) {
      setNombreSeleccionado(null);
      return;
    }

    try {
      const response = await axios.get(`${api}/api/categorias/${categoriaId}`);
      if (response.data && response.data.nombre) {
        setNombreSeleccionado(response.data.nombre);
      } else {
        setNombreSeleccionado(null);
      }
    } catch (error) {
      console.error("Error al obtener el nombre de la categoría:", error);
      setNombreSeleccionado(null);
    }
  };

  fetchCategoriaNombre();
}, [categoriaId]);

  const handleCategorySelect = () => {
    if (window.innerWidth <= 768) setShowCategories(false);
  };

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>

      <button className="toggle-categories" onClick={() => setShowCategories(prev => !prev)}>
        {showCategories ? <><FaTimes /> Ocultar Filtros</> : <><FaFilter /> Mostrar Filtros</>}
      </button>

      {categoriaId && (
        <div className="categoria-seleccionada">
          Categoría seleccionada: <strong>{nombreSeleccionado}</strong>
        </div>
      )}

      <div className={`catalogo-layout ${showCategories ? 'menu-abierto' : 'menu-cerrado'}`}>
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
            <>
              {/* Muestra productos destacados si no hay categoría seleccionada */}
              {destacados.length > 0 && (
                <section className="categorias-destacadas">
                  {destacados.map(bloque => (
                    <div className="bloque-categoria" key={bloque.categoria_id}>
                      <h3>{bloque.categoria_nombre}</h3>
                      <ProductList productos={bloque.productos} columnas={showCategories ? 2 : 3} />
                    </div>
                  ))}
                </section>
              )}

              {/* Muestra productos por subcategoría si hay una categoría padre seleccionada */}
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
