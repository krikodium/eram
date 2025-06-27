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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nombreSeleccionado, setNombreSeleccionado] = useState('');
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoria_id');
  const api = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    setLoading(true);
    setMobileMenuOpen(false); // Cierra el menú móvil al cambiar de categoría

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
        setDestacados([]);
        setSubcategoriasConProductos([]);
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
        console.error("Error al obtener el nombre de la categoría:", error);
        setNombreSeleccionado('');
      }
    };
    fetchCategoriaNombre();
  }, [categoriaId, api]);
  
  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <h1>Catálogo de Productos</h1>
        <button className="toggle-categories" onClick={() => setMobileMenuOpen(prev => !prev)}>
          {mobileMenuOpen ? <><FaTimes /> Ocultar Filtros</> : <><FaFilter /> Mostrar Filtros</>}
        </button>
      </div>

      <div className="categoria-seleccionada">
        Mostrando: <strong>{loading ? 'Cargando...' : nombreSeleccionado}</strong>
      </div>

      <div className={`catalogo-layout ${mobileMenuOpen ? 'mobile-menu-is-open' : ''}`}>
        <CategorySidebar onLinkClick={() => setMobileMenuOpen(false)} />

        <main className="product-list-container">
          {loading ? (
            <p className="loading-text">Cargando productos...</p>
          ) : (
            <>
              {(destacados.length === 0 && subcategoriasConProductos.length === 0) && (
                <p className="no-products-text">No se encontraron productos en esta categoría.</p>
              )}

              {destacados.length > 0 && (
                <section className="categorias-destacadas">
                  {destacados.map(bloque =>
                    bloque.productos.length > 0 ? (
                      <div className="bloque-categoria" key={bloque.categoria_id}>
                        <h3>{bloque.categoria_nombre}</h3>
                        <ProductList productos={bloque.productos} columnas={3} />
                      </div>
                    ) : null
                  )}
                </section>
              )}

              {subcategoriasConProductos.length > 0 && (
                <section className="categorias-destacadas">
                  {subcategoriasConProductos.map(sub =>
                    sub.productos.length > 0 ? (
                      <div className="bloque-categoria" key={sub.subcategoria_id}>
                        <h3>{sub.subcategoria_nombre}</h3>
                        <ProductList productos={sub.productos} columnas={3} />
                      </div>
                    ) : null
                  )}
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