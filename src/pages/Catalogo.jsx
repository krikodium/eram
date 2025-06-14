import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import './Catalogo.css';

function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [nombreSeleccionado, setNombreSeleccionado] = useState(null);

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoria_id');

  useEffect(() => {
    setLoading(true);
    const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/productos` + 
      (categoryId ? `?categoria=${categoryId}` : '');
    
    axios.get(apiUrl)
      .then(response => setProducts(response.data))
      .catch(error => {
        console.error("Error al obtener los productos:", error);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>

      {/* Botón de menú mobile */}
      <button className="toggle-categories" onClick={() => setShowCategories(prev => !prev)}>
        {showCategories ? 'Ocultar Categorías' : 'Mostrar Categorías'}
      </button>

      {categoryId && (
        <div className="categoria-seleccionada">
          Categoría seleccionada: <strong>{nombreSeleccionado}</strong>
        </div>
      )}

      <div className={`catalogo-layout ${showCategories ? 'menu-abierto' : 'menu-cerrado'}`}>
        {showCategories && (
          <CategorySidebar setNombreSeleccionado={setNombreSeleccionado} />
        )}

        <main className="product-list-container">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <ProductList productos={products} columnas={showCategories ? 2 : 3} />
          )}
        </main>
      </div>
    </div>
  );
}

export default Catalogo;
