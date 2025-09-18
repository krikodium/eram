import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddToQuoteButton from '../shared/components/AddToQuoteButton';
import { 
  FaShieldAlt, 
  FaStar, 
  FaTruck, 
  FaCheckCircle, 
  FaEye
} from 'react-icons/fa';
import './ProductCard.css';

function ProductCard({ producto, viewMode = 'grid' }) {
  const { id, nombre, precio, codigo, imagen_url, descripcion, stock, destacado, categoria_nombre } = producto;
  const { isAuthenticated, user } = useAuth();
  const imagenFinal = imagen_url || '/default-product.jpg';
  
  // Debug: Verificar que el nombre existe
  console.log('ProductCard - nombre:', nombre, 'producto completo:', producto);
  
  // Check if user is a provider (supplier)
  const isProvider = isAuthenticated && user?.role === 'proveedor';
  const isInStock = stock > 0;
  const isFeatured = destacado || false;

  if (viewMode === 'list') {
    return (
      <div className={`product-card-wrapper ${viewMode}-view ${isProvider ? 'provider-logged-in' : ''}`}>
        {/* ZONA 1 - IZQUIERDA: Imagen del producto */}
        <div className="card-image-section">
          <Link to={`/producto/${id}`} className="image-link">
            <img
              src={imagenFinal}
              alt={nombre}
              className="card-img"
              loading="lazy" 
            />
          </Link>
        </div>

        {/* ZONA 2 - CENTRO: Título y mensaje de precios */}
        <div className="card-content">
          {/* Bloque principal alineado verticalmente */}
          <div className="main-content-block">
            <h3 className="product-title">
              <Link to={`/producto/${id}`}>
                {nombre}
              </Link>
            </h3>
            
            {/* Fila de acción: Ícono + Texto alineados horizontalmente */}
            <div className="action-row">
              {isProvider ? (
                <div className="provider-price">
                  <span className="price-value">${Number(precio).toFixed(2)}</span>
                </div>
              ) : (
                <div className="price-info">
                  <FaShieldAlt className="price-icon" />
                  <span>Inicia sesión para ver precios</span>
                </div>
              )}
            </div>

            {/* Información secundaria centrada */}
            <div className="product-details">
              <div className="detail-item">
                <span className="detail-label">CÓDIGO:</span>
                <span className="detail-value">{codigo}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">STOCK:</span>
                <span className={`detail-value ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                  {isInStock ? 'Disponible' : 'Agotado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ZONA 3 - DERECHA: Botón COTIZAR en esquina inferior */}
        <div className="card-actions">
          <AddToQuoteButton 
            product={producto} 
            size="small" 
            className="card-quote-btn"
            disabled={!isInStock}
          />
        </div>

      </div>
    );
  }

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
          
        </div>

        {/* Card Content */}
        <div className="card-content">
          <div className="content-header">
            <div className="product-category">
              {categoria_nombre}
            </div>
            <h3 className="product-title">
              <Link to={`/producto/${id}`}>
                {nombre}
              </Link>
            </h3>
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
              <span className="detail-label">Código:</span>
              <span className="detail-value">{codigo}</span>
            </div>
          </div>

          {/* Provider Badge */}
          {isProvider && (
            <div className="provider-badge">
              <FaShieldAlt className="badge-icon" />
              <span>Vista de Proveedor</span>
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="card-actions">
          <AddToQuoteButton 
            product={producto} 
            size="small" 
            className="card-quote-btn"
            disabled={!isInStock}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;