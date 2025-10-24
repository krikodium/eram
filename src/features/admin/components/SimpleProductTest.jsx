// src/features/admin/components/SimpleProductTest.jsx - Prueba simple de productos
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase';

const SimpleProductTest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Probando conexión a Supabase...');
      
      // Prueba 1: Verificar conexión básica
      const { data: testData, error: testError } = await supabase
        .from('productos')
        .select('count', { count: 'exact', head: true });
      
      if (testError) {
        console.error('Error en test de conexión:', testError);
        setError(`Error de conexión: ${testError.message}`);
        return;
      }
      
      console.log('Conexión exitosa. Total de productos:', testData);
      
      // Prueba 2: Obtener todos los productos
      const { data: productsData, error: productsError } = await supabase
        .from('productos')
        .select('id, nombre, precio_unitario, activo, created_at, categoria_id')
        .order('created_at', { ascending: false });
      
      if (productsError) {
        console.error('Error obteniendo productos:', productsError);
        setError(`Error obteniendo productos: ${productsError.message}`);
        return;
      }
      
      console.log('Productos obtenidos:', productsData);
      setProducts(productsData || []);
      
    } catch (err) {
      console.error('Error general:', err);
      setError(`Error general: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="admin-loading-spinner"></div>
        <p>Probando conexión...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--admin-error)' }}>Error de Conexión</h3>
        <p style={{ color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>{error}</p>
        <button onClick={testConnection} className="admin-btn admin-btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>✅ Prueba de Conexión Exitosa</h2>
      <p>Total de productos encontrados: <strong>{products.length}</strong></p>
      
      <button onClick={testConnection} className="admin-btn admin-btn-secondary" style={{ marginBottom: '1rem' }}>
        Probar Nuevamente
      </button>

      {products.length > 0 ? (
        <div>
          <h3>Primeros {products.length} productos:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {products.map(product => (
              <div key={product.id} style={{
                border: '1px solid var(--admin-border)',
                borderRadius: '0.5rem',
                padding: '1rem',
                background: 'var(--admin-bg-secondary)'
              }}>
                <h4>{product.nombre}</h4>
                <p><strong>Precio:</strong> ${product.precio_unitario}</p>
                <p><strong>Activo:</strong> {product.activo ? 'Sí' : 'No'}</p>
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Creado:</strong> {new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No se encontraron productos en la base de datos.</p>
      )}
    </div>
  );
};

export default SimpleProductTest;
