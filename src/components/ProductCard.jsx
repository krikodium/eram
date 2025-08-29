// src/components/ProductCard.jsx - Enhanced with View Modes and Mobile Animations
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddToQuoteButton from '../shared/components/AddToQuoteButton';
import { FaShieldAlt, FaEye, FaStar, FaTruck, FaCheckCircle } from 'react-icons/fa';
import './ProductCard.css';

function ProductCard({ producto, viewMode = 'grid' }) {
  const { id, nombre, precio, sku, imagen_url, descripcion, stock, destacado } = producto;
  const { isAuthenticated, user } = useAuth();
  const imagenFinal = imagen_url || '/default-product.jpg';
  
  // Check if user is a provider (supplier)
  const isProvider = isAuthenticated && user?.role === 'proveedor';
  const isInStock = stock > 0;
  const isFeatured = destacado || false;

  return (
    <div className={`product-card-wrapper ${viewMode}-view ${isProvider ? 'provider-logged-in' : ''}`}>
      <div className="product-card">
        {/* Card Header with Image */}
        <div className="card-image-section">
          <Link to={`/producto/${id}`} className="image-link">
            <img
              src={imagenFinal}
              alt={nombre}
              className="card-img"
              loading="lazy" 
            />
            {isFeatured && (
              <div className="featured-badge">
                <FaStar />
                <span>Destacado</span>
              </div>
            )}
            {!isInStock && (
              <div className="out-of-stock-badge">
                <span>Sin Stock</span>
              </div>
            )}
          </Link>
          
          {/* Quick Actions Overlay */}
          <div className="quick-actions-overlay">
            <Link 
              to={`/producto/${id}`} 
              className="quick-action-btn view-btn"
              aria-label="Ver producto"
            >
              <FaEye />
            </Link>
          </div>
        </div>

        {/* Card Content */}
        <div className="card-content">
          <div className="content-header">
            <h3 className="product-title">
              <Link to={`/producto/${id}`}>
                {nombre}
              </Link>
            </h3>
            
            {viewMode === 'list' && descripcion && (
              <p className="product-description">
                {descripcion.length > 120 
                  ? `${descripcion.substring(0, 120)}...` 
                  : descripcion
                }
              </p>
            )}
          </div>

          {/* Price Section */}
          <div className="price-section">
            {isProvider ? (
              <div className="provider-price">
                <span className="price-label">Precio Proveedor:</span>
                <span className="price-value">${Number(precio).toFixed(2)}</span>
              </div>
            ) : (
              <div className="price-info">
                <FaShieldAlt className="price-icon" />
                <span>Inicia sesión como proveedor para ver precios</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="product-details">
            <div className="detail-item">
              <span className="detail-label">SKU:</span>
              <span className="detail-value">{sku}</span>
            </div>
            
            {viewMode === 'list' && (
              <>
                <div className="detail-item">
                  <span className="detail-label">Stock:</span>
                  <span className={`detail-value ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                    {isInStock ? (
                      <>
                        <FaCheckCircle />
                        Disponible
                      </>
                    ) : (
                      'Agotado'
                    )}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Envío:</span>
                  <span className="detail-value">
                    <FaTruck />
                    Gratis en CABA
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Provider Badge */}
          {isProvider && (
            <div className="provider-badge">
              <FaEye className="badge-icon" />
              <span>Vista de Proveedor</span>
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="card-actions">
          <AddToQuoteButton 
            product={producto} 
            size={viewMode === 'list' ? 'medium' : 'small'} 
            className="card-quote-btn"
            disabled={!isInStock}
          />
          
          {viewMode === 'list' && (
            <Link 
              to={`/producto/${id}`} 
              className="view-details-btn"
            >
              Ver Detalles
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;