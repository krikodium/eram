// src/features/quote/components/Toast.jsx - Notificaciones Toast

import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Toast.css';

const Toast = ({ 
  isVisible, 
  onClose, 
  message, 
  type = 'info', // success, error, warning, info
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="toast-icon success" />;
      case 'error':
        return <FaExclamationTriangle className="toast-icon error" />;
      case 'warning':
        return <FaExclamationTriangle className="toast-icon warning" />;
      default:
        return <FaInfoCircle className="toast-icon info" />;
    }
  };

  const getToastClass = () => {
    return `toast toast-${type}`;
  };

  return (
    <div className={getToastClass()}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
