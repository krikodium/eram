// src/components/ProductCard.jsx - Enhanced with Provider-Only Pricing
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddToQuoteButton from '../shared/components/AddToQuoteButton';
import { FaShieldAlt, FaEye } from 'react-icons/fa';
import './ProductCard.css';

function ProductCard({ producto }) {
  const { id, nombre, precio, sku, imagen_url } = producto;
  const { isAuthenticated, user } = useAuth();
  const imagenFinal = imagen_url || '/default-product.jpg';
  
  // Check if user is a provider (supplier)
  const isProvider = isAuthenticated && user?.role === 'proveedor';

  return (
    <div className={`product-card-wrapper ${isProvider ? 'provider-logged-in' : ''}`}>
      <Link to={`/producto/${id}`} className="card">
        <img
          src={imagenFinal}
          alt={nombre}
          className="card-img"
          loading="lazy" 
        />
        <div className="card-content">
          <h3>{nombre}</h3>
          
          {/* Price visibility logic */}
          {isProvider ? (
            <p className="card-price">
              ${Number(precio).toFixed(2)}
            </p>
          ) : (
            <p className="card-price-info">
              <FaShieldAlt style={{ marginRight: '0.5rem' }} />
              Inicia sesión como proveedor para ver precios
            </p>
          )}
          
          <p className="card-sku">SKU: {sku}</p>
          
          {/* Provider badge if logged in */}
          {isProvider && (
            <div className="provider-badge">
              <FaEye style={{ marginRight: '0.25rem' }} />
              <span>Vista de Proveedor</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="card-actions">
        <AddToQuoteButton 
          product={producto} 
          size="small" 
          className="card-quote-btn"
        />
      </div>
    </div>
  );
}

export default ProductCard;