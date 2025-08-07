// src/contexts/QuoteContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const QuoteContext = createContext();

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};

// Quote reducer for state management
const quoteReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };

    case 'CLEAR_QUOTE':
      return {
        ...state,
        items: [],
      };

    case 'LOAD_SAVED_QUOTE':
      return {
        ...state,
        items: action.payload || [],
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
};

export const QuoteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quoteReducer, initialState);

  // Load saved quote from localStorage
  useEffect(() => {
    const savedQuote = localStorage.getItem('eram-quote');
    if (savedQuote) {
      try {
        const items = JSON.parse(savedQuote);
        dispatch({ type: 'LOAD_SAVED_QUOTE', payload: items });
      } catch (error) {
        console.error('Error loading saved quote:', error);
      }
    }
  }, []);

  // Save quote to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eram-quote', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearQuote = () => {
    dispatch({ type: 'CLEAR_QUOTE' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const generateWhatsAppMessage = (customerInfo = {}) => {
    const { name = 'Cliente', company = '', phone = '' } = customerInfo;
    
    let message = `¡Hola! Soy ${name}`;
    if (company) message += ` de ${company}`;
    message += `. Me interesa solicitar cotización para los siguientes productos:\n\n`;
    
    state.items.forEach((item, index) => {
      message += `${index + 1}. ${item.nombre}\n`;
      message += `   SKU: ${item.sku}\n`;
      message += `   Cantidad: ${item.quantity}\n\n`;
    });
    
    message += `Por favor, proporcionen información sobre:\n`;
    message += `• Precios y condiciones de pago\n`;
    message += `• Tiempos de entrega\n`;
    message += `• Disponibilidad de stock\n\n`;
    message += `¡Gracias por su atención!`;
    
    if (phone) message += `\n\nContacto: ${phone}`;
    
    return encodeURIComponent(message);
  };

  const value = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearQuote,
    getTotalItems,
    generateWhatsAppMessage,
  };

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
};

export default QuoteContext;