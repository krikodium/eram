import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mockCategorias } from '../mocks/productos';

const CategorySidebar = ({ onLinkClick, onCategoryMouseEnter, onCategoryMouseLeave }) => {
  const [categorias, setCategorias] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategoryId = searchParams.get('categoria_id');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setCategorias(mockCategorias);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  return (
    <div className="categories-container">
      <ul className="categories-list">
        <li>
          <Link
            to="/catalogo"
            className={`category-item ${!activeCategoryId ? 'active' : ''}`}
            onClick={onLinkClick}
          >
            Ver Todos
          </Link>
        </li>
        {categorias.map((cat) => (
          <li key={cat.id}>
            <Link
              to={`/catalogo?categoria_id=${cat.id}`}
              className={`category-item ${activeCategoryId === String(cat.id) ? 'active' : ''}`}
              onClick={onLinkClick}
              onMouseEnter={(e) => onCategoryMouseEnter(cat, e)}
            >
              {cat.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;