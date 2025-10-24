// src/features/admin/components/Toast.jsx - Sistema de notificaciones toast
import React, { useState, useEffect } from 'react';
import { FaCheck, FaExclamationTriangle, FaInfo, FaTimes, FaSpinner } from 'react-icons/fa';

const Toast = ({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animar entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck />;
      case 'error':
        return <FaExclamationTriangle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'loading':
        return <FaSpinner className="admin-loading" />;
      default:
        return <FaInfo />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: 'var(--admin-success)',
          border: 'var(--admin-success)',
          icon: 'white'
        };
      case 'error':
        return {
          background: 'var(--admin-error)',
          border: 'var(--admin-error)',
          icon: 'white'
        };
      case 'warning':
        return {
          background: 'var(--admin-warning)',
          border: 'var(--admin-warning)',
          icon: 'white'
        };
      case 'loading':
        return {
          background: 'var(--admin-accent)',
          border: 'var(--admin-accent)',
          icon: 'white'
        };
      default:
        return {
          background: 'var(--admin-bg-secondary)',
          border: 'var(--admin-border)',
          icon: 'var(--admin-text-primary)'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`admin-toast admin-toast-${type} ${isVisible ? 'admin-fade-in' : ''} ${isLeaving ? 'admin-slide-out' : ''}`}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: '0.5rem',
        padding: '1rem',
        boxShadow: '0 4px 12px var(--admin-shadow)',
        zIndex: 10000,
        minWidth: '300px',
        maxWidth: '400px',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}
    >
      <div style={{
        color: colors.icon,
        fontSize: '1.25rem',
        marginTop: '0.125rem',
        flexShrink: 0
      }}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{
            margin: '0 0 0.25rem 0',
            color: type === 'loading' ? 'white' : 'var(--admin-text-primary)',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            {title}
          </h4>
        )}
        <p style={{
          margin: '0',
          color: type === 'loading' ? 'white' : 'var(--admin-text-secondary)',
          fontSize: '0.875rem',
          lineHeight: '1.4'
        }}>
          {message}
        </p>
      </div>
      
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: type === 'loading' ? 'white' : 'var(--admin-text-muted)',
          cursor: 'pointer',
          fontSize: '1rem',
          padding: '0.25rem',
          borderRadius: '0.25rem',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'none';
        }}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
