import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productoService } from '../services/supabase';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);

  // Memoizar la función de carga para evitar re-renders innecesarios
  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await productoService.getProducto(parseInt(id));
      setProducto(data);
    } catch (err) {
      console.error("Error al obtener el producto:", err);
      setError('No se pudo cargar el producto o no fue encontrado.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Memoizar el precio formateado
  const formattedPrice = useMemo(() => {
    if (!producto?.precio_unitario) return null;
    return parseFloat(producto.precio_unitario).toFixed(2);
  }, [producto?.precio_unitario]);

  // Memoizar las especificaciones técnicas
  const technicalSpecs = useMemo(() => {
    if (!producto) return [];
    
    const specs = [
      { label: 'Código', value: producto.codigo },
      { label: 'Categoría', value: producto.categoria_nombre || 'N/A' },
      { label: 'Fuente', value: producto.fuente },
    ];

    if (producto.medidas) {
      specs.push({ label: 'Medidas', value: producto.medidas });
    }
    if (producto.presentacion) {
      specs.push({ label: 'Presentación', value: producto.presentacion });
    }
    if (producto.moneda) {
      specs.push({ label: 'Moneda', value: producto.moneda });
    }

    return specs;
  }, [producto]);

  // Manejar carga de imagen
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
  }, []);

  // Funciones para manejar la cantidad
  const handleCantidadChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setCantidad(value);
    }
  }, []);

  const handleCantidadIncrement = useCallback(() => {
    setCantidad(prev => prev + 1);
  }, []);

  const handleCantidadDecrement = useCallback(() => {
    setCantidad(prev => prev > 1 ? prev - 1 : 1);
  }, []);

  const handleCotizar = useCallback(() => {
    // Aquí se implementaría la lógica para agregar al carrito/cotización
    console.log(`Cotizar ${cantidad} unidades del producto ${producto?.nombre}`);
  }, [cantidad, producto]);

  // Componente de carga optimizado
  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-skeleton">
          <div className="skeleton-back-link"></div>
          <div className="skeleton-layout">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-description"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-specs">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton-spec-row"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="error-state">
          <h2>Error al cargar el producto</h2>
          <p>{error}</p>
          <Link to="/catalogo" className="back-link">
            &larr; Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="product-detail-container">
        <div className="error-state">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o ha sido eliminado.</p>
          <Link to="/catalogo" className="back-link">
            &larr; Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Link to="/catalogo" className="back-link">
        &larr; Volver al Catálogo
      </Link>

      <div className="product-detail-layout">
        {/* Columna Izquierda - Imagen del Producto */}
        <div className="product-image-section">
          <div className="product-image-placeholder">
            {producto.imagen_url ? (
              <>
                {imageLoading && (
                  <div className="image-loading-skeleton">
                    <div className="loading-spinner"></div>
                  </div>
                )}
                <img 
                  src={producto.imagen_url} 
                  alt={producto.nombre} 
                  className={`product-img-real ${imageLoading ? 'loading' : 'loaded'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                />
              </>
            ) : (
              <div className="no-image-placeholder">
                <span>Imagen Próximamente</span>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha - Información del Producto */}
        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{producto.nombre}</h1>
            <div className="product-identifier">
              <span className="product-code">CÓDIGO: {producto.codigo}</span>
              {producto.categoria_nombre && (
                <span className="product-category">| CATEGORÍA: {producto.categoria_nombre}</span>
              )}
            </div>
          </div>

          {producto.descripcion && (
            <div className="product-description">
              <p>{producto.descripcion}</p>
            </div>
          )}

          {formattedPrice && (
            <div className="product-price-section">
              <div className="price-display">
                <span className="price-label">Precio Unitario:</span>
                <span className="price-value">${formattedPrice} {producto.moneda && `(${producto.moneda})`}</span>
              </div>
            </div>
          )}

          {/* Selector de Cantidad y Botón COTIZAR */}
          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="cantidad" className="quantity-label">Cantidad:</label>
              <div className="quantity-controls">
                <button 
                  type="button" 
                  className="quantity-btn quantity-decrease"
                  onClick={handleCantidadDecrement}
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="cantidad"
                  value={cantidad}
                  onChange={handleCantidadChange}
                  min="1"
                  className="quantity-input"
                />
                <button 
                  type="button" 
                  className="quantity-btn quantity-increase"
                  onClick={handleCantidadIncrement}
                >
                  +
                </button>
              </div>
            </div>
            
            <button 
              className="cotizar-btn"
              onClick={handleCotizar}
            >
              COTIZAR
            </button>
          </div>

          {producto.precios_por_bulto && Object.keys(producto.precios_por_bulto).length > 0 && (
            <div className="bulk-prices">
              <h4>Precios por Bulto</h4>
              <div className="bulk-prices-list">
                {Object.entries(producto.precios_por_bulto).map(([quantity, price]) => (
                  <div key={quantity} className="bulk-price-item">
                    <span className="quantity">{quantity}</span>
                    <span className="price">${parseFloat(price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="product-specs">
            <h3>Especificaciones Técnicas</h3>
            <div className="specs-list">
              {technicalSpecs.map((spec, index) => (
                <div key={index} className="spec-item">
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {producto.notas && (
            <div className="product-notes">
              <h4>Notas Adicionales</h4>
              <p>{producto.notas}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
