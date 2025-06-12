// src/pages/Catalogo.jsx

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // <-- 1. IMPORTANTE: Hook para leer la URL
import axios from 'axios';
import CategorySidebar from '../components/CategorySidebar'; // <-- 2. Importamos la barra lateral
import ProductList from '../components/ProductList';       // <-- 3. Usaremos tu ProductList
import './Catalogo.css'; // <-- 4. Añadiremos un CSS para el layout

function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hook para leer los parámetros de la URL (ej: ?categoria_id=2)
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoria_id');

  // Este efecto se ejecutará cada vez que 'categoryId' cambie
  useEffect(() => {
    setLoading(true);

    // Construimos la URL de la API dinámicamente
    let apiUrl = 'http://localhost:3001/api/productos';
    if (categoryId) {
      // Si hay un ID de categoría en la URL, lo añadimos a la petición
      apiUrl += `?categoria=${categoryId}`;
    }

    axios.get(apiUrl)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("Error al obtener los productos:", error);
        setProducts([]); // En caso de error, vaciamos la lista
      })
      .finally(() => {
        setLoading(false);
      });
      
  }, [categoryId]); // <-- 5. El efecto depende del categoryId de la URL

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>
      <div className="catalogo-layout">
        {/* Columna 1: La Barra Lateral */}
        <CategorySidebar />

        {/* Columna 2: La Lista de Productos */}
        <main className="product-list-container">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <ProductList productos={products} />
          )}
        </main>
      </div>
    </div>
  );
}

export default Catalogo;