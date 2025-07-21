import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './CategorySidebar.css';

// 👇🏼 Recibir los nuevos props onCategoryMouseEnter y onCategoryMouseLeave
const CategorySidebar = ({ onLinkClick, onCategoryMouseEnter, onCategoryMouseLeave }) => {
  const [categorias, setCategorias] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategoryId = searchParams.get('categoria_id');
  const api = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${api}/api/categorias`);
        const padres = response.data.filter(c => c.categoria_padre_id === null);
        setCategorias(padres);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCategorias();
  }, [api]);

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