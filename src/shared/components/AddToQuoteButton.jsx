// src/shared/components/AddToQuoteButton.jsx
import React, { useState } from 'react';
import { useQuote } from '../../contexts/QuoteContext';
import { FaPlus, FaCheck } from 'react-icons/fa';
import './AddToQuoteButton.css';

const AddToQuoteButton = ({ product, className = '', size = 'medium' }) => {
  const { addItem, items } = useQuote();
  const [isAdded, setIsAdded] = useState(false);
  
  const isInQuote = items.some(item => item.id === product.id);

  const handleAddToQuote = (e) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    e.stopPropagation(); // Prevent event bubbling
    
    addItem(product);
    setIsAdded(true);
    
    // Reset the success state after animation
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAddToQuote}
      className={`add-to-quote-btn ${size} ${isAdded ? 'added' : ''} ${isInQuote ? 'in-quote' : ''} ${className}`}
      title={isInQuote ? 'Ya está en tu cotización' : 'Agregar a cotización'}
      disabled={isAdded}
    >
      <span className="btn-icon">
        {isAdded ? <FaCheck /> : <FaPlus />}
      </span>
      <span className="btn-text">
        {isAdded ? 'Agregado' : isInQuote ? 'En cotización' : 'Cotizar'}
      </span>
    </button>
  );
};

export default AddToQuoteButton;