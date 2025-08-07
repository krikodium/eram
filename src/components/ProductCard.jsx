// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddToQuoteButton from '../shared/components/AddToQuoteButton';
import './ProductCard.css';

function ProductCard({ producto }) {
  const { id, nombre, precio, sku, imagen_url } = producto;
  const { isAuthenticated } = useAuth();
  const imagenFinal = imagen_url || '/default-product.jpg';

  return (
    <div className="product-card-wrapper">
      <Link to={`/producto/${id}`} className="card">
        <img
          src={imagenFinal}
          alt={nombre}
          className="card-img"
          loading="lazy" 
        />
        <div className="card-content">
          <h3>{nombre}</h3>
          {isAuthenticated && precio && (
            <p className="card-price">
              ${Number(precio).toFixed(2)}
            </p>
          )}
          <p className="card-sku">SKU: {sku}</p>
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