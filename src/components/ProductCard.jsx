// src/components/ProductCard.jsx

import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ producto }) {
  const { id, nombre, precio, sku, imagen_url } = producto;

  const imagenFinal = imagen_url || '/default-product.jpg';

  return (
    <Link to={`/producto/${id}`} className="card">
      {/* Añadí loading="lazy" aquí */}
      <img
        src={imagenFinal}
        alt={nombre}
        className="card-img"
        loading="lazy" 
      />
      <div className="card-content">
        <h3>{nombre}</h3>
        <p className="card-price">
          ${Number(precio).toFixed(2)}
        </p>
        <p className="card-sku">SKU: {sku}</p>
      </div>
    </Link>
  );
}

export default ProductCard;