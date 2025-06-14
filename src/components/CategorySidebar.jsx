// src/components/CategorySidebar.jsx

import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './CategorySidebar.css';

function CategorySidebar({ setNombreSeleccionado }) {
  const [categories, setCategories] = useState([]);
  const [popupData, setPopupData] = useState({ visible: false, categoryId: null, products: [] });
  const [slideIndex, setSlideIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const categoriaSeleccionada = searchParams.get('categoria_id');

  const slideIntervalRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const activeCategoryRef = useRef(null);

  const api = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    axios.get(`${api}/api/categorias`)
      .then(response => {
        const topCategories = response.data.filter(cat => cat.categoria_padre_id === null);
        setCategories(topCategories);
      })
      .catch(error => {
        console.error("Error al obtener las categorías:", error);
      });
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada && categories.length > 0) {
      const encontrada = categories.find(c => String(c.id) === categoriaSeleccionada);
      if (encontrada) setNombreSeleccionado(encontrada.nombre);
    } else {
      setNombreSeleccionado('Todos');
    }
  }, [categoriaSeleccionada, categories]);

  const startSlideshow = (products) => {
    setSlideIndex(0);
    clearInterval(slideIntervalRef.current);
    if (products.length > 1) {
      slideIntervalRef.current = setInterval(() => {
        setSlideIndex(prev => (prev + 1) % products.length);
      }, 1500);
    }
  };

  const stopSlideshow = () => {
    clearInterval(slideIntervalRef.current);
  };

  const handleMouseEnter = (categoryId) => {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      axios.get(`${api}/api/productos?categoria=${categoryId}&limit=5`)
        .then(response => {
          const productos = response.data;
          setPopupData({ visible: true, categoryId, products: productos });
          if (productos.length > 0) startSlideshow(productos);
        })
        .catch(err => {
          console.error("Error al obtener productos:", err);
          setPopupData({ visible: false, categoryId: null, products: [] });
        });
    }, 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current);
    stopSlideshow();
    setPopupData({ visible: false, categoryId: null, products: [] });
  };

  return (
    <aside className="category-sidebar">
      <h3>Categorías</h3>
      <ul>
        <li>
          <Link to="/catalogo" className={!categoriaSeleccionada ? 'active' : ''}>Ver Todos</Link>
        </li>
        {categories.map(cat => (
          <li
            key={cat.id}
            onMouseEnter={() => handleMouseEnter(cat.id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={`/catalogo?categoria_id=${cat.id}`}
              className={`${String(cat.id) === categoriaSeleccionada ? 'active' : ''}`}
            >
              {cat.nombre}
            </Link>

            {popupData.visible && popupData.categoryId === cat.id && popupData.products.length > 0 && (
              <div className="category-popup">
                <h4>{cat.nombre}</h4>
                <div className="popup-slideshow">
                  {popupData.products.map((product, index) => (
                    <div
                      className={`slide ${index === slideIndex ? 'active' : ''}`}
                      key={product.id}
                    >
                      {product.imagen_url ? (
                        <img src={product.imagen_url} alt={product.nombre} />
                      ) : (
                        <span>Sin imagen</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default CategorySidebar;
