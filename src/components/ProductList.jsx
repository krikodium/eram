// ✅ src/components/ProductList.jsx (modificado para aceptar props.columnas)
import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList({ productos, columnas = 3 }) {
  return (
    <div className={`product-grid cols-${columnas}`}>
      {productos.map(producto => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

export default ProductList;