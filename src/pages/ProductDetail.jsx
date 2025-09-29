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
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-nav">
        <Link to="/" className="breadcrumb-link">Inicio</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/catalogo" className="breadcrumb-link">Catálogo</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{producto.nombre}</span>
      </nav>

      <div className="product-detail-layout">
        {/* Sección Principal - Imagen y Info Básica */}
        <div className="product-main-section">
          {/* Imagen del Producto */}
          <div className="product-image-container">
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
                  className={`product-main-image ${imageLoading ? 'loading' : 'loaded'}`}
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

          {/* Información Principal */}
          <div className="product-main-info">
            <div className="product-header">
              <h1 className="product-title">{producto.nombre}</h1>
              <div className="product-identifiers">
                <div className="identifier-item">
                  <span className="identifier-label">Código</span>
                  <span className="identifier-value">{producto.codigo}</span>
                </div>
                {producto.categoria_nombre && (
                  <div className="identifier-item">
                    <span className="identifier-label">Categoría</span>
                    <span className="identifier-value">{producto.categoria_nombre}</span>
                  </div>
                )}
                <div className="identifier-item">
                  <span className="identifier-label">Fuente</span>
                  <span className="identifier-value">{producto.fuente}</span>
                </div>
              </div>
            </div>

            {producto.descripcion && (
              <div className="product-description">
                <h3>Descripción</h3>
                <p>{producto.descripcion}</p>
              </div>
            )}

            {/* Precio y Acciones */}
            <div className="product-pricing-section">
              {formattedPrice && (
                <div className="price-display">
                  <span className="price-label">Precio Unitario</span>
                  <span className="price-value">
                    ${formattedPrice} 
                    {producto.moneda && <span className="price-currency">({producto.moneda})</span>}
                  </span>
                </div>
              )}

              <div className="product-actions">
                <div className="quantity-selector">
                  <label htmlFor="cantidad" className="quantity-label">Cantidad</label>
                  <div className="quantity-controls">
                    <button 
                      type="button" 
                      className="quantity-btn quantity-decrease"
                      onClick={handleCantidadDecrement}
                      disabled={cantidad <= 1}
                    >
                      −
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
                  className="cotizar-btn primary"
                  onClick={handleCotizar}
                >
                  <span className="btn-icon">📋</span>
                  Agregar a Cotización
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Especificaciones Técnicas */}
        <div className="product-specs-section">
          <h2>Especificaciones Técnicas</h2>
          <div className="specs-grid">
            {technicalSpecs.map((spec, index) => (
              <div key={index} className="spec-item">
                <span className="spec-label">{spec.label}</span>
                <span className="spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Precios por Bulto */}
        {producto.precios_por_bulto && Object.keys(producto.precios_por_bulto).length > 0 && (
          <div className="bulk-prices-section">
            <h2>Precios por Bulto</h2>
            <div className="bulk-prices-grid">
              {Object.entries(producto.precios_por_bulto).map(([quantity, price]) => (
                <div key={quantity} className="bulk-price-item">
                  <div className="bulk-quantity">
                    <span className="quantity-number">{quantity}</span>
                    <span className="quantity-label">unidades</span>
                  </div>
                  <div className="bulk-price">
                    <span className="price-value">${parseFloat(price).toFixed(2)}</span>
                    <span className="price-per-unit">por unidad</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sección de Notas Adicionales */}
        {producto.notas && (
          <div className="product-notes-section">
            <h2>Información Adicional</h2>
            <div className="notes-content">
              <p>{producto.notas}</p>
            </div>
          </div>
        )}

        {/* Sección de Stock */}
        <div className="product-stock-section">
          <div className="stock-info">
            <div className="stock-status">
              <span className="stock-label">Disponibilidad</span>
              <span className={`stock-value ${producto.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {producto.stock > 0 ? 'En Stock' : 'Sin Stock'}
              </span>
            </div>
            {producto.stock > 0 && (
              <div className="stock-quantity">
                <span className="stock-label">Cantidad disponible</span>
                <span className="stock-value">{producto.stock} unidades</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
