// src/components/ProductList.jsx (CON DEBUG)
import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList({ productos, columnas = 3 }) {
  // --- AÑADIR ESTA LÍNEA PARA DEBUG ---
  console.log('ProductList está intentando renderizar con:', productos);

  // Antes de hacer .map, nos aseguramos de que 'productos' sea un array.
  // Si no lo es, devolvemos null para no causar un crash.
  if (!Array.isArray(productos)) {
    console.error('ERROR: "productos" no es un array. Se ha prevenido un crash.');
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