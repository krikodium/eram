// src/components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList({ productos, columnas = 3 }) {
  if (!Array.isArray(productos)) {
    console.error(
      'ERROR CRÍTICO EN ProductList: La prop "productos" no es un array. Valor recibido:', 
      productos
    );
    return <p className="status-text">Error al cargar productos.</p>;
  }

  if (productos.length === 0) {
    return null;
  }

  return (
    <div className={`product-grid cols-${columnas}`}>
      {productos.map(producto => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

export default ProductList;
