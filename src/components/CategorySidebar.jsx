import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './CategorySidebar.css';

const CategorySidebar = ({ onLinkClick }) => {
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
    <aside className="category-sidebar">
      <h3 className="category-title">Categorías</h3>
      <ul className="category-list">
        <li>
          <Link
            to="/catalogo"
            className={`category-link ${!activeCategoryId ? 'active' : ''}`}
            onClick={onLinkClick}
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
