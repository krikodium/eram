// src/components/ProductList.jsx - Enhanced with View Modes
import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList({ productos, viewMode = 'grid', columnas = 3 }) {
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

  // Determinar el número de columnas basado en el modo de vista
  const getGridColumns = () => {
    if (viewMode === 'list') return 1;
    
    const screenWidth = window.innerWidth;
    if (screenWidth > 1400) return 4;
    if (screenWidth > 1200) return 3;
    if (screenWidth > 768) return 2;
    return 1;
  };

  const actualColumns = columnas || getGridColumns();

  return (
    <div className={`product-list ${viewMode}-view cols-${actualColumns}`}>
      {productos.map(producto => (
        <ProductCard 
          key={producto.id} 
          producto={producto} 
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}

export default ProductList;
