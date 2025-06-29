// src/components/ProductList.jsx (VERSIÓN BLINDADA Y DEFINITIVA)
import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList({ productos, columnas = 3 }) {
  // --- VERIFICACIÓN DE SEGURIDAD ---
  // Esta es la comprobación clave. Si 'productos' NO es un array,
  // mostramos un error claro en la consola y no intentamos renderizar la lista.
  if (!Array.isArray(productos)) {
    console.error(
      'ERROR CRÍTICO EN ProductList: La prop "productos" no es un array. Valor recibido:', 
      productos
    );
    // Devolvemos null para que el componente no renderice nada y evite el crash.
    return null;
  }

  // Si la lista está vacía, no mostramos nada.
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