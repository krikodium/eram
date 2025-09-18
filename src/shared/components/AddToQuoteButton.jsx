// src/shared/components/AddToQuoteButton.jsx
import React, { useState } from 'react';
import { useQuote } from '../../contexts/QuoteContext';
import { FaPlus, FaCheck, FaMinus } from 'react-icons/fa';
import './AddToQuoteButton.css';

const AddToQuoteButton = ({ product, className = '', size = 'medium' }) => {
  const { addItem, items, updateQuantity, removeItem } = useQuote();
  const [isAdded, setIsAdded] = useState(false);
  
  const quoteItem = items.find(item => item.id === product.id);
  const isInQuote = !!quoteItem;
  const quantity = quoteItem?.quantity || 0;

  const handleAddToQuote = (e) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    e.stopPropagation(); // Prevent event bubbling
    
    if (isInQuote) {
      // Si ya está en la cotización, aumentar cantidad
      updateQuantity(product.id, quantity + 1);
    } else {
      // Si no está, agregarlo
      addItem(product);
    }
    
    setIsAdded(true);
    
    // Reset the success state after animation
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      // Si la cantidad es 1, remover el item
      removeItem(product.id);
    }
  };

  if (isInQuote && quantity > 0) {
    return (
      <div className={`quantity-controls ${size} ${className}`}>
        <button
          onClick={handleDecrement}
          className="quantity-btn decrement-btn"
          title="Disminuir cantidad"
        >
          <FaMinus />
        </button>
        <span className="quantity-display">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          className="quantity-btn increment-btn"
          title="Aumentar cantidad"
        >
          <FaPlus />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAddToQuote}
      className={`add-to-quote-btn ${size} ${isAdded ? 'added' : ''} ${className}`}
      title="Agregar a cotización"
      disabled={isAdded}
    >
      <span className="btn-icon">
        {isAdded ? <FaCheck /> : <FaPlus />}
      </span>
      <span className="btn-text">
        {isAdded ? 'Agregado' : 'Cotizar'}
      </span>
    </button>
  );
};

export default AddToQuoteButton;