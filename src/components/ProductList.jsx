// src/components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard'; // Importamos el componente de la tarjeta
import './ProductList.css';

// Este componente recibe la lista completa de 'productos'
function ProductList({ productos }) {
  return (
    <div className="product-grid">
      {productos.map(producto => (
        // Por cada producto en la lista, renderiza un componente ProductCard
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

export default ProductList;