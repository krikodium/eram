// src/features/admin/components/ToastContainer.jsx - Contenedor de notificaciones
import React, { useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // Función para agregar un toast
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  // Función para remover un toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Función para mostrar toast de éxito
  const showSuccess = useCallback((title, message, duration = 4000) => {
    return addToast({
      type: 'success',
      title,
      message,
      duration
    });
  }, [addToast]);

  // Función para mostrar toast de error
  const showError = useCallback((title, message, duration = 6000) => {
    return addToast({
      type: 'error',
      title,
      message,
      duration
    });
  }, [addToast]);

  // Función para mostrar toast de advertencia
  const showWarning = useCallback((title, message, duration = 5000) => {
    return addToast({
      type: 'warning',
      title,
      message,
      duration
    });
  }, [addToast]);

  // Función para mostrar toast de información
  const showInfo = useCallback((title, message, duration = 4000) => {
    return addToast({
      type: 'info',
      title,
      message,
      duration
    });
  }, [addToast]);

  // Función para mostrar toast de carga
  const showLoading = useCallback((title, message) => {
    return addToast({
      type: 'loading',
      title,
      message,
      duration: 0 // No se cierra automáticamente
    });
  }, [addToast]);

  // Función para cerrar un toast específico
  const closeToast = useCallback((id) => {
    removeToast(id);
  }, [removeToast]);

  // Función para cerrar todos los toasts
  const closeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Exponer funciones globalmente para uso en toda la app
  React.useEffect(() => {
    window.adminToast = {
      success: showSuccess,
      error: showError,
      warning: showWarning,
      info: showInfo,
      loading: showLoading,
      close: closeToast,
      closeAll: closeAllToasts
    };
  }, [showSuccess, showError, showWarning, showInfo, showLoading, closeToast, closeAllToasts]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 10000,
      margin: 0,
      padding: 0,
      border: 'none',
      outline: 'none'
    }}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'absolute',
            top: `${1 + (index * 0.5)}rem`,
            right: '1rem',
            pointerEvents: 'auto'
          }}
        >
          <Toast
            {...toast}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
};

// Hook para usar toast desde cualquier componente
export const useToast = () => {
  const showToast = (type, title, message, duration) => {
    if (window.adminToast) {
      return window.adminToast[type](title, message, duration);
    }
    console.warn('Toast system not initialized');
    return null;
  };

  return {
    success: (title, message, duration = 4000) => showToast('success', title, message, duration),
    error: (title, message, duration = 6000) => showToast('error', title, message, duration),
    warning: (title, message, duration = 5000) => showToast('warning', title, message, duration),
    info: (title, message, duration = 4000) => showToast('info', title, message, duration),
    loading: (title, message) => showToast('loading', title, message),
    close: (id) => window.adminToast?.close(id),
    closeAll: () => window.adminToast?.closeAll()
  };
};

export default ToastContainer;
