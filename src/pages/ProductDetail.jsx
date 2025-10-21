import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productoService } from '../services/supabase';
import { useQuote } from '../contexts/QuoteContext';
import { FaArrowLeft } from 'react-icons/fa';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useQuote();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

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

  // Limpiar sessionStorage de productos antiguos al montar el componente
  useEffect(() => {
    const cleanupOldKeys = () => {
      try {
        const keys = Object.keys(sessionStorage);
        const productKeys = keys.filter(key => key.startsWith('productDetailRefreshed_'));
        
        // Mantener solo las últimas 10 claves para evitar acumulación
        if (productKeys.length > 10) {
          productKeys.slice(0, -10).forEach(key => {
            sessionStorage.removeItem(key);
          });
        }
      } catch (error) {
        console.warn('Error al limpiar sessionStorage:', error);
      }
    };
    
    cleanupOldKeys();
  }, []);

  // Controlar cuando el componente está completamente listo - Solo una vez por producto
  useEffect(() => {
    if (!loading && producto && id) {
      // Verificar si ya se hizo refresh para este producto específico
      const productKey = `productDetailRefreshed_${id}`;
      const hasRefreshed = sessionStorage.getItem(productKey);
      
      if (!hasRefreshed) {
        // Pequeño delay para asegurar que el DOM esté completamente renderizado
        const refreshTimer = setTimeout(() => {
          try {
            sessionStorage.setItem(productKey, 'true');
            window.location.reload();
          } catch (error) {
            console.warn('Error al guardar en sessionStorage:', error);
            // Si hay error con sessionStorage, hacer refresh de todas formas
            window.location.reload();
          }
        }, 200);
        
        return () => clearTimeout(refreshTimer);
      }
    }
  }, [loading, producto, id]);

  // Memoizar el precio formateado
  const formattedPrice = useMemo(() => {
    if (!producto?.precio) return null;
    return parseFloat(producto.precio).toFixed(2);
  }, [producto?.precio]);

  // Memoizar las especificaciones técnicas
  const technicalSpecs = useMemo(() => {
    if (!producto) return [];
    
    const specs = [
      { label: 'Código', value: producto.codigo },
      { label: 'Categoría', value: producto.categoria_nombre || 'No especificada' },
      { label: 'Peso', value: producto.peso ? `${producto.peso} kg` : 'No especificado', icon: 'weight' },
    ];

    if (producto.medidas) {
      specs.push({ label: 'Medidas', value: producto.medidas });
    }
    if (producto.presentacion) {
      specs.push({ label: 'Presentación', value: producto.presentacion });
    }
    if (producto.material) {
      specs.push({ label: 'Material', value: producto.material });
    }
    if (producto.color) {
      specs.push({ label: 'Color', value: producto.color });
    }

    return specs;
  }, [producto]);

  // Handlers
  const handleImageLoad = () => setImageLoading(false);
  const handleImageError = () => setImageLoading(false);

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setCantidad(value);
    }
  };

  const handleCantidadIncrement = () => setCantidad(prev => prev + 1);
  const handleCantidadDecrement = () => setCantidad(prev => Math.max(1, prev - 1));

  const handleCotizar = () => {
    if (producto) {
      // Crear un objeto producto con la cantidad especificada
      const productToAdd = {
        ...producto,
        quantity: cantidad
      };
      
      addItem(productToAdd);
      
      // Activar animación de éxito
      setShowSuccessAnimation(true);
      
      // Resetear animación después de un tiempo
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);
      
      // Mostrar mensaje de éxito (opcional)
      console.log(`Producto "${producto.nombre}" agregado a la cotización con cantidad ${cantidad}`);
      
      // Opcional: navegar a la cotización
      // navigate('/cotizacion');
    }
  };

  // Función simple para volver al catálogo
  const handleBackToCatalog = () => {
    navigate('/catalogo');
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="product-detail-error">
        <div className="error-container">
          <h2>Producto no encontrado</h2>
          <p>{error || 'El producto solicitado no existe.'}</p>
          <Link to="/catalogo" className="back-to-catalog-btn">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-nav">
        <button onClick={handleBackToCatalog} className="back-button">
          <FaArrowLeft />
          <span>Volver</span>
        </button>
        <div className="breadcrumb-path">
          <Link to="/" className="breadcrumb-link">Inicio</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/catalogo" className="breadcrumb-link">Catálogo</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">
            {producto.nombre.length > 30 
              ? `${producto.nombre.substring(0, 30)}...` 
              : producto.nombre
            }
          </span>
        </div>
      </nav>

      <div className="product-detail-container">
        {/* Main Product Section */}
        <div className="product-main-section">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="product-image-container" onClick={() => setImageModalOpen(true)}>
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
                  <div className="image-zoom-overlay">
                    <span className="zoom-icon">🔍</span>
                    <span className="zoom-text">Hacer clic para ampliar</span>
                  </div>
                </>
              ) : (
                <div className="no-image-placeholder">
                  <span>Imagen Próximamente</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="product-info-section">
            {/* Product Header */}
            <div className="product-header">
              <h1 className="product-title">{producto.nombre}</h1>
              <div className="product-meta">
                <span className="product-code">Código: {producto.codigo}</span>
                {producto.categoria_nombre && (
                  <span className="product-category">{producto.categoria_nombre}</span>
                )}
              </div>
            </div>

            {/* IRAM Certification - Professional */}
            <div className="iram-certification">
              <div className="certification-icon">
                <img
                  src="/iramsinfondo.png"
                  alt="Logo IRAM"
                  className="iram-logo"
                />
              </div>
              <div className="certification-content">
                <h3>Certificación IRAM</h3>
                <p>Producto certificado según normativas argentinas de seguridad industrial</p>
              </div>
            </div>

            {/* Product Description */}
            {producto.descripcion && (
              <div className="product-description">
                <h3>Descripción</h3>
                <p>{producto.descripcion}</p>
              </div>
            )}

            {/* Price and Actions */}
            <div className="product-pricing">
              {formattedPrice && (
                <div className="price-section">
                  <span className="price-label">Precio Unitario</span>
                  <div className="price-value">
                    <span className="currency">$</span>
                    <span className="amount">{formattedPrice}</span>
                    {producto.moneda && <span className="currency-code">({producto.moneda})</span>}
                  </div>
                </div>
              )}

              <div className="product-actions">
                <div className="quantity-section">
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
                  className={`add-to-quote-btn ${showSuccessAnimation ? 'success' : ''}`}
                  onClick={handleCotizar}
                >
                  <span className="btn-icon">{showSuccessAnimation ? '👍' : '📋'}</span>
                  <span className="btn-text">{showSuccessAnimation ? '' : 'Agregar a Cotización'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="technical-specs-section">
          <div className="specs-header">
            <h2>Especificaciones Técnicas</h2>
            <p>Detalles técnicos del producto</p>
          </div>
          
          <div className="specs-grid">
            {technicalSpecs.map((spec, index) => (
              <div key={index} className="spec-item">
                <div className="spec-label">
                  {spec.icon === 'weight' && <span className="weight-icon">⚖️</span>}
                  {spec.label}
                </div>
                <div className="spec-value">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bulk Prices */}
        {producto.precios_por_bulto && Object.keys(producto.precios_por_bulto).length > 0 && (
          <div className="bulk-prices-section">
            <div className="bulk-prices-header">
              <h2>Precios por Bulto</h2>
              <p>Descuentos por cantidad</p>
            </div>
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

      </div>

      {/* Image Modal */}
      {imageModalOpen && (
        <div className="image-modal-overlay" onClick={() => setImageModalOpen(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setImageModalOpen(false)}
            >
              ×
            </button>
            <img 
              src={producto.imagen_url} 
              alt={producto.nombre}
              className="modal-image"
            />
            <div className="modal-image-info">
              <h3>{producto.nombre}</h3>
              <p>Código: {producto.codigo}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;