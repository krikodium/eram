// src/features/quote/components/QuoteCart.jsx - Versión Mejorada

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaWhatsapp, FaEnvelope, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaUser, FaBuilding, FaPhone, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useQuote } from '../../../contexts/QuoteContext';
import { useAuth } from '../../../contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import Toast from './Toast';
import './QuoteCart.css';

const QuoteCart = () => {
  const { items, removeItem, updateQuantity, clearQuote, generateWhatsAppMessage } = useQuote();
  const { isAuthenticated, user } = useAuth();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    company: '',
    phone: '',
    email: user?.email || '',
  });
  
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMethod, setContactMethod] = useState('whatsapp'); // 'whatsapp' or 'email'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState({ isOpen: false, itemId: null, itemName: '' });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  // Auto-fill user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [isAuthenticated, user]);

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!customerInfo.name.trim()) {
      errors.name = 'El nombre es requerido';
    }
    
    if (!customerInfo.company.trim()) {
      errors.company = 'La empresa es requerida';
    }
    
    if (contactMethod === 'whatsapp') {
      if (!customerInfo.phone.trim()) {
        errors.phone = 'El teléfono es requerido';
      } else if (!/^[\d\s\-\+\(\)]+$/.test(customerInfo.phone.trim())) {
        errors.phone = 'Formato de teléfono inválido';
      }
    } else if (contactMethod === 'email') {
      if (!customerInfo.email?.trim()) {
        errors.email = 'El email es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email.trim())) {
        errors.email = 'Formato de email inválido';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const generateEmailMessage = (customerInfo) => {
    const { name = 'Cliente', company = '', email = '' } = customerInfo;
    
    let message = `Estimados,\n\n`;
    message += `Mi nombre es ${name}`;
    if (company) message += ` de ${company}`;
    message += ` y me interesa solicitar cotización para los siguientes productos:\n\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.nombre}\n`;
      message += `   Código: ${item.codigo}\n`;
      message += `   Cantidad: ${item.quantity}\n\n`;
    });
    
    message += `Por favor, proporcionen información sobre:\n`;
    message += `• Precios y condiciones de pago\n`;
    message += `• Tiempos de entrega\n`;
    message += `• Disponibilidad de stock\n\n`;
    message += `Quedo a la espera de su respuesta.\n\n`;
    message += `Saludos cordiales,\n${name}`;
    if (email) message += `\nEmail: ${email}`;
    
    return message;
  };

  const handleSubmitQuote = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setShowSuccessMessage(true);
      
      if (contactMethod === 'whatsapp') {
        const message = generateWhatsAppMessage(customerInfo);
        const whatsappUrl = `https://wa.me/5491123456789?text=${encodeURIComponent(message)}`;
        
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          setShowSuccessMessage(false);
          setShowContactForm(false);
          clearQuote();
        }, 2000);
      } else if (contactMethod === 'email') {
        const message = generateEmailMessage(customerInfo);
        const emailUrl = `mailto:ventas@eram.com.ar?subject=Cotización de Productos&body=${encodeURIComponent(message)}`;
        
        setTimeout(() => {
          window.open(emailUrl, '_blank');
          setShowSuccessMessage(false);
          setShowContactForm(false);
          clearQuote();
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error al enviar cotización:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowContactForm(false);
    setFormErrors({});
    setShowSuccessMessage(false);
  };

  const handleContactMethodChange = (method) => {
    setContactMethod(method);
    setFormErrors({});
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      const item = items.find(item => item.id === itemId);
      setShowRemoveModal({
        isOpen: true,
        itemId: itemId,
        itemName: item?.nombre || 'este producto'
      });
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleConfirmRemove = () => {
    const itemName = showRemoveModal.itemName;
    removeItem(showRemoveModal.itemId);
    setShowRemoveModal({ isOpen: false, itemId: null, itemName: '' });
    showToast(`"${itemName}" eliminado de la cotización`, 'success');
  };

  const handleConfirmClear = () => {
    clearQuote();
    setShowClearModal(false);
    showToast('Cotización limpiada exitosamente', 'success');
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="quote-cart-container">
        <div className="empty-cart">
          <FaShoppingCart className="empty-icon" />
          <h2>Tu cotización está vacía</h2>
          <p>
            Agregá productos desde nuestro catálogo para crear tu cotización personalizada.
            <br />
            Podrás enviarla directamente por WhatsApp cuando esté lista.
          </p>
          <Link to="/catalogo" className="browse-catalog-btn">
            <FaArrowLeft />
            Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-cart-container">
      {/* Header */}
      <div className="quote-header">
        <h1>
          <FaShoppingCart />
          Mi Cotización ({getTotalItems()} productos)
        </h1>
        <button onClick={() => setShowClearModal(true)} className="clear-cart-btn">
          <FaTrash />
          Limpiar Todo
        </button>
      </div>

      {/* Content */}
      <div className="quote-content">
        {/* Items List */}
        <div className="quote-items">
          {items.map((item) => (
            <div key={item.id} className="quote-item">
              {/* Product Image */}
              <div className="item-image">
                <img 
                  src={item.imagen_url || '/default-product.jpg'} 
                  alt={item.nombre}
                  loading="lazy"
                />
              </div>

              {/* Product Details */}
              <div className="item-details">
                <h3>{item.nombre}</h3>
                <p className="item-sku">SKU: {item.codigo}</p>
                {isAuthenticated && (
                  <p className="item-price">{formatPrice(item.precio)}</p>
                )}
              </div>

              {/* Controls */}
              <div className="item-controls">
                {/* Quantity Controls */}
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    aria-label="Reducir cantidad"
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Remove Button */}
                <button 
                  className="remove-btn"
                  onClick={() => setShowRemoveModal({
                    isOpen: true,
                    itemId: item.id,
                    itemName: item.nombre
                  })}
                  aria-label="Eliminar producto"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Actions Panel */}
        <div className="quote-actions">
          {!showContactForm ? (
            <>
              {/* Send Options */}
              <div className="send-options">
                <button 
                  onClick={() => {
                    setContactMethod('whatsapp');
                    setShowContactForm(true);
                  }} 
                  className="send-quote-btn whatsapp"
                >
                  <FaWhatsapp />
                  Enviar por WhatsApp
                </button>
                
                <button 
                  onClick={() => {
                    setContactMethod('email');
                    setShowContactForm(true);
                  }} 
                  className="send-quote-btn email"
                >
                  <FaEnvelope />
                  Enviar por Email
                </button>
              </div>

              {/* Quote Summary */}
              <div className="quote-info">
                <div className="info-text">
                  {isAuthenticated ? (
                    <>
                      <strong>Total: {formatPrice(getTotalPrice())}</strong>
                      <br />
                      {getTotalItems()} producto{getTotalItems() !== 1 ? 's' : ''} seleccionado{getTotalItems() !== 1 ? 's' : ''}
                    </>
                  ) : (
                    <>
                      <strong>{getTotalItems()} producto{getTotalItems() !== 1 ? 's' : ''} seleccionado{getTotalItems() !== 1 ? 's' : ''}</strong>
                      <br />
                      <span className="price-info-text">
                        <FaExclamationTriangle />
                        Iniciá sesión para ver precios
                      </span>
                    </>
                  )}
                </div>
                
                {!isAuthenticated && (
                  <div className="login-prompt">
                    <Link to="/login">Iniciá sesión</Link> para acceder a precios y condiciones especiales
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Contact Form */
            <div className="whatsapp-form">
              <h3>
                {contactMethod === 'whatsapp' ? <FaWhatsapp /> : <FaEnvelope />}
                Enviar Cotización por {contactMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}
              </h3>

              {showSuccessMessage ? (
                <div className="success-message">
                  <FaCheckCircle />
                  <p>¡Cotización enviada exitosamente!</p>
                  <p>Redirigiendo a {contactMethod === 'whatsapp' ? 'WhatsApp' : 'tu cliente de email'}...</p>
                </div>
              ) : (
                <>
                  {/* Customer Information Form */}
                  <div className="form-group">
                    <label htmlFor="name">
                      <FaUser />
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                      className={formErrors.name ? 'error' : ''}
                    />
                    {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">
                      <FaBuilding />
                      Empresa *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={customerInfo.company}
                      onChange={handleInputChange}
                      placeholder="Nombre de tu empresa"
                      className={formErrors.company ? 'error' : ''}
                    />
                    {formErrors.company && <span className="error-message">{formErrors.company}</span>}
                  </div>

                  {contactMethod === 'whatsapp' ? (
                    <div className="form-group">
                      <label htmlFor="phone">
                        <FaPhone />
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        placeholder="+54 9 11 1234-5678"
                        className={formErrors.phone ? 'error' : ''}
                      />
                      {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                    </div>
                  ) : (
                    <div className="form-group">
                      <label htmlFor="email">
                        <FaEnvelope />
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email || ''}
                        onChange={handleInputChange}
                        placeholder="tu@empresa.com"
                        className={formErrors.email ? 'error' : ''}
                      />
                      {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button 
                      onClick={handleCancelForm}
                      className="cancel-btn"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSubmitQuote}
                      className={`send-quote-btn ${contactMethod}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          {contactMethod === 'whatsapp' ? <FaWhatsapp /> : <FaEnvelope />}
                          Enviar Ahora
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClear}
        title="Limpiar Cotización"
        message="¿Estás seguro de que querés eliminar todos los productos de tu cotización? Esta acción no se puede deshacer."
        confirmText="Sí, Limpiar Todo"
        cancelText="Cancelar"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showRemoveModal.isOpen}
        onClose={() => setShowRemoveModal({ isOpen: false, itemId: null, itemName: '' })}
        onConfirm={handleConfirmRemove}
        title="Eliminar Producto"
        message={`¿Estás seguro de que querés eliminar "${showRemoveModal.itemName}" de tu cotización?`}
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        type="warning"
      />

      {/* Toast Notifications */}
      <Toast
        isVisible={toast.isVisible}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
        duration={3000}
      />
    </div>
  );
};

export default QuoteCart;