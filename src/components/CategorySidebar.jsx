import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CategorySidebar.css';

const CategorySidebar = ({ onCategoriaClick }) => {
  const [categorias, setCategorias] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('/api/categorias');
        const padres = response.data.filter(c => c.categoria_padre_id === null);
        setCategorias(padres);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };

    fetchCategorias();
  }, []);

  const handleSeleccion = (categoriaId) => {
    setSeleccionada(categoriaId);
    onCategoriaClick(categoriaId);
  };

  return (
    <aside className="category-sidebar">
      <h3>Categorías</h3>
      <ul>
        <li>
          <button
            className={!seleccionada ? 'active' : ''}
            onClick={() => handleSeleccion(null)}
          >
            Ver Todos
          </button>
        </li>
        {categorias.map((cat) => (
          <li key={cat.id}>
            <button
              className={seleccionada === cat.id ? 'active' : ''}
              onClick={() => handleSeleccion(cat.id)}
            >
              {cat.nombre}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;
