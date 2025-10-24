// src/features/admin/components/ProductTest.jsx - Componente de prueba para productos
import React, { useState, useEffect } from 'react';
import { adminProductService } from '../services/adminService';

const ProductTest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Cargando productos...');
      const data = await adminProductService.getAllProducts();
      console.log('Productos cargados:', data);
      setProducts(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="admin-loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--admin-error)' }}>Error</h3>
        <p>{error}</p>
        <button onClick={loadProducts} className="admin-btn admin-btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Prueba de Productos</h2>
      <p>Total de productos: {products.length}</p>
      
      <button onClick={loadProducts} className="admin-btn admin-btn-secondary" style={{ marginBottom: '1rem' }}>
        Recargar Productos
      </button>

      {products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {products.slice(0, 6).map(product => (
            <div key={product.id} style={{
              border: '1px solid var(--admin-border)',
              borderRadius: '0.5rem',
              padding: '1rem',
              background: 'var(--admin-bg-secondary)'
            }}>
              <h4>{product.nombre}</h4>
              <p>Precio: ${product.precio_unitario}</p>
              <p>Categoría: {product.categoria?.nombre || 'Sin categoría'}</p>
              <p>Activo: {product.activo ? 'Sí' : 'No'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay productos disponibles</p>
      )}
    </div>
  );
};

export default ProductTest;
