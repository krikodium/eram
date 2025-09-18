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

  // Load saved quote from localStorage with expiration
  useEffect(() => {
    const savedQuote = localStorage.getItem('eram-quote');
    const savedTimestamp = localStorage.getItem('eram-quote-timestamp');
    
    if (savedQuote && savedTimestamp) {
      try {
        const items = JSON.parse(savedQuote);
        const timestamp = parseInt(savedTimestamp);
        const now = Date.now();
        const expirationTime = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
        
        // Solo cargar si no ha expirado
        if (now - timestamp < expirationTime) {
          dispatch({ type: 'LOAD_SAVED_QUOTE', payload: items });
        } else {
          // Limpiar datos expirados
          localStorage.removeItem('eram-quote');
          localStorage.removeItem('eram-quote-timestamp');
        }
      } catch (error) {
        console.error('Error loading saved quote:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('eram-quote');
        localStorage.removeItem('eram-quote-timestamp');
      }
    }
  }, []);

  // Save quote to localStorage whenever it changes with timestamp
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('eram-quote', JSON.stringify(state.items));
      localStorage.setItem('eram-quote-timestamp', Date.now().toString());
    } else {
      // Si no hay items, limpiar el localStorage
      localStorage.removeItem('eram-quote');
      localStorage.removeItem('eram-quote-timestamp');
    }
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
    // También limpiar localStorage
    localStorage.removeItem('eram-quote');
    localStorage.removeItem('eram-quote-timestamp');
  };

  const clearExpiredData = () => {
    const savedTimestamp = localStorage.getItem('eram-quote-timestamp');
    if (savedTimestamp) {
      const timestamp = parseInt(savedTimestamp);
      const now = Date.now();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 horas
      
      if (now - timestamp >= expirationTime) {
        localStorage.removeItem('eram-quote');
        localStorage.removeItem('eram-quote-timestamp');
        dispatch({ type: 'CLEAR_QUOTE' });
        return true; // Indica que se limpiaron datos
      }
    }
    return false;
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
    clearExpiredData,
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