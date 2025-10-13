// src/features/quote/components/ConfirmationModal.jsx - Modal de Confirmación

import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = "warning" // warning, success, danger
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="modal-icon success" />;
      case 'danger':
        return <FaExclamationTriangle className="modal-icon danger" />;
      default:
        return <FaExclamationTriangle className="modal-icon warning" />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'success':
        return 'btn-success';
      case 'danger':
        return 'btn-danger';
      default:
        return 'btn-warning';
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-icon-container">
            {getIcon()}
          </div>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-actions">
          <button 
            className="btn-cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`btn-confirm ${getButtonClass()}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
