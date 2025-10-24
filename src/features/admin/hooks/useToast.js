// src/features/admin/hooks/useToast.js - Hook para usar notificaciones toast
import { useCallback } from 'react';

const useToast = () => {
  const showToast = useCallback((type, title, message, duration) => {
    if (window.adminToast) {
      return window.adminToast[type](title, message, duration);
    }
    console.warn('Toast system not initialized');
    return null;
  }, []);

  const success = useCallback((title, message, duration = 4000) => {
    return showToast('success', title, message, duration);
  }, [showToast]);

  const error = useCallback((title, message, duration = 6000) => {
    return showToast('error', title, message, duration);
  }, [showToast]);

  const warning = useCallback((title, message, duration = 5000) => {
    return showToast('warning', title, message, duration);
  }, [showToast]);

  const info = useCallback((title, message, duration = 4000) => {
    return showToast('info', title, message, duration);
  }, [showToast]);

  const loading = useCallback((title, message) => {
    return showToast('loading', title, message);
  }, [showToast]);

  const close = useCallback((id) => {
    if (window.adminToast) {
      window.adminToast.close(id);
    }
  }, []);

  const closeAll = useCallback(() => {
    if (window.adminToast) {
      window.adminToast.closeAll();
    }
  }, []);

  return {
    success,
    error,
    warning,
    info,
    loading,
    close,
    closeAll
  };
};

export default useToast;
