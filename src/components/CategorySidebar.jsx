import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mockCategorias } from '../mocks/productos';
import './CategorySidebar.css';

const CategorySidebar = ({ onLinkClick, onCategoryMouseEnter, onCategoryMouseLeave }) => {
  const [categorias, setCategorias] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategoryId = searchParams.get('categoria_id');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // Use mock data instead of API call
        setCategorias(mockCategorias);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  return (
    // 👇🏼 Añadir onMouseLeave al contenedor principal del sidebar
    <aside className="category-sidebar" onMouseLeave={onCategoryMouseLeave}>
      <h3 className="category-title">Categorías</h3>
      <ul className="category-list">
        <li>
          <Link
            to="/catalogo"
            className={`category-link ${!activeCategoryId ? 'active' : ''}`}
            onClick={onLinkClick}
            // El link "Ver Todos" no tendrá previsualización
          >
            Ver Todos
          </Link>
        </li>
        {categorias.map((cat) => (
          <li key={cat.id}>
            <Link
              to={`/catalogo?categoria_id=${cat.id}`}
              className={`category-link ${activeCategoryId === String(cat.id) ? 'active' : ''}`}
              onClick={onLinkClick}
              // 👇🏼 Añadir los eventos de mouse para la previsualización
              onMouseEnter={(e) => onCategoryMouseEnter(cat, e)}
            >
              {cat.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;