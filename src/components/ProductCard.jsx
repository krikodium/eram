// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaImage } from 'react-icons/fa6';
import './ProductCard.css';

function ProductCard({ producto }) {
  return (
    <Link to={`/producto/${producto.id}`} className="card">
      <div className="card-image-placeholder">
        <FaImage />
        <span>Sin imagen</span>
      </div>
      <div className="card-content">
        <h3>{producto.nombre}</h3>
        <p className="card-price">${Number(producto.precio).toFixed(2)}</p>
        <p className="card-sku">SKU: {producto.sku}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
