// src/features/quote/components/QuoteCart.jsx
import React, { useState } from 'react';
import { useQuote } from '../../../contexts/QuoteContext';
import { useAuth } from '../../../contexts/AuthContext';
import { FaTrash, FaMinus, FaPlus, FaWhatsapp, FaShoppingCart } from 'react-icons/fa';
import './QuoteCart.css';

const QuoteCart = () => {
  const { items, removeItem, updateQuantity, clearQuote, generateWhatsAppMessage } = useQuote();
  const { isAuthenticated, user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    company: '',
    phone: '',
  });
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSendQuote = () => {
    const message = generateWhatsAppMessage(customerInfo);
    const whatsappUrl = `https://wa.me/5491123456789?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  if (items.length === 0) {
    return (
      <div className="quote-cart-container">
        <div className="quote-header">
          <h1>
            <FaShoppingCart />
            Mi Cotización
          </h1>
        </div>
        <div className="empty-cart">
          <FaShoppingCart className="empty-icon" />
          <h2>Tu cotización está vacía</h2>
          <p>Agrega productos desde el catálogo para solicitar una cotización.</p>
          <a href="/catalogo" className="browse-catalog-btn">
            Ver Catálogo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-cart-container">
      <div className="quote-header">
        <h1>
          <FaShoppingCart />
          Mi Cotización ({getTotalItems()} productos)
        </h1>
        <button onClick={clearQuote} className="clear-cart-btn">
          Limpiar Todo
        </button>
      </div>

      <div className="quote-content">
        <div className="quote-items">
          {items.map((item) => (
            <div key={item.id} className="quote-item">
              <div className="item-image">
                <img
                  src={item.imagen_url || '/default-product.jpg'}
                  alt={item.nombre}
                  loading="lazy"
                />
              </div>
              
              <div className="item-details">
                <h3>{item.nombre}</h3>
                <p className="item-sku">SKU: {item.sku}</p>
                {isAuthenticated && item.precio && (
                  <p className="item-price">${Number(item.precio).toFixed(2)}</p>
                )}
              </div>
              
              <div className="item-controls">
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="quote-actions">
          {!showWhatsAppForm ? (
            <button
              onClick={() => setShowWhatsAppForm(true)}
              className="send-quote-btn primary"
            >
              <FaWhatsapp />
              Enviar Cotización por WhatsApp
            </button>
          ) : (
            <div className="whatsapp-form">
              <h3>Información de Contacto</h3>
              <div className="form-group">
                <label htmlFor="name">Nombre *</label>
                <input
                  type="text"
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="company">Empresa</label>
                <input
                  type="text"
                  id="company"
                  value={customerInfo.company}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                  placeholder="Nombre de tu empresa (opcional)"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="Tu número de teléfono (opcional)"
                />
              </div>
              
              <div className="form-actions">
                <button
                  onClick={() => setShowWhatsAppForm(false)}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendQuote}
                  className="send-quote-btn primary"
                  disabled={!customerInfo.name.trim()}
                >
                  <FaWhatsapp />
                  Enviar por WhatsApp
                </button>
              </div>
            </div>
          )}
          
          <div className="quote-info">
            <p className="info-text">
              💡 Al enviar la cotización, se abrirá WhatsApp con un mensaje pre-formateado 
              que incluye todos los productos seleccionados.
            </p>
            {!isAuthenticated && (
              <p className="login-prompt">
                <a href="/login">Inicia sesión</a> como proveedor para ver precios especiales.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCart;