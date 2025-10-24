// src/features/admin/components/NotificationCenter.jsx - Centro de notificaciones
import React, { useState, useEffect } from 'react';
import { FaBell, FaExclamationTriangle, FaImage, FaTimes, FaCheck } from 'react-icons/fa';
import { adminProductService } from '../services/adminService';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const products = await adminProductService.getAllProducts();
      
      const newNotifications = [];
      
      // Productos sin imagen
      const productsWithoutImage = products.filter(p => !p.imagen_url);
      if (productsWithoutImage.length > 0) {
        newNotifications.push({
          id: 'no-image',
          type: 'warning',
          title: 'Productos sin imagen',
          message: `${productsWithoutImage.length} productos no tienen imagen principal`,
          count: productsWithoutImage.length,
          action: 'Ver productos sin imagen',
          data: productsWithoutImage
        });
      }

      // Productos con precios muy altos (más de $100,000)
      const expensiveProducts = products.filter(p => p.precio_unitario && p.precio_unitario > 100000);
      if (expensiveProducts.length > 0) {
        newNotifications.push({
          id: 'expensive-products',
          type: 'info',
          title: 'Productos con precios altos',
          message: `${expensiveProducts.length} productos tienen precios superiores a $100,000`,
          count: expensiveProducts.length,
          action: 'Revisar precios',
          data: expensiveProducts
        });
      }

      // Productos sin descripción
      const productsWithoutDescription = products.filter(p => !p.descripcion || p.descripcion.trim() === '');
      if (productsWithoutDescription.length > 0) {
        newNotifications.push({
          id: 'no-description',
          type: 'info',
          title: 'Productos sin descripción',
          message: `${productsWithoutDescription.length} productos no tienen descripción`,
          count: productsWithoutDescription.length,
          action: 'Completar descripciones',
          data: productsWithoutDescription
        });
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    switch (notification.id) {
      case 'no-image':
        window.location.href = '/dasheram/productos?filter=no-image';
        break;
      case 'expensive-products':
        window.location.href = '/dasheram/productos?filter=expensive';
        break;
      case 'no-description':
        window.location.href = '/dasheram/productos?filter=no-description';
        break;
      default:
        break;
    }
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle style={{ color: 'var(--admin-warning)' }} />;
      case 'error':
        return <FaExclamationTriangle style={{ color: 'var(--admin-error)' }} />;
      case 'info':
        return <FaImage style={{ color: 'var(--admin-accent)' }} />;
      default:
        return <FaBell style={{ color: 'var(--admin-text-muted)' }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning':
        return 'var(--admin-warning)';
      case 'error':
        return 'var(--admin-error)';
      case 'info':
        return 'var(--admin-accent)';
      default:
        return 'var(--admin-text-muted)';
    }
  };

  const totalNotifications = notifications.reduce((sum, n) => sum + n.count, 0);

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: '5rem',
        right: '1rem',
        zIndex: 1000
      }}>
        <div className="admin-loading-spinner" style={{ width: '24px', height: '24px' }}></div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '5rem',
      right: '1rem',
      zIndex: 1000,
      margin: 0,
      padding: 0,
      border: 'none',
      outline: 'none'
    }}>
      {/* Botón de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'var(--admin-bg-secondary)',
          border: '1px solid var(--admin-border)',
          borderTop: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--admin-text-primary)',
          fontSize: '1.25rem',
          boxShadow: '0 2px 8px var(--admin-shadow)',
          transition: 'all 0.2s ease',
          margin: 0,
          padding: 0,
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 4px 12px var(--admin-shadow)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 2px 8px var(--admin-shadow)';
        }}
      >
        <FaBell />
        {totalNotifications > 0 && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: 'var(--admin-error)',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {totalNotifications > 99 ? '99+' : totalNotifications}
          </div>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '0',
          width: '350px',
          maxHeight: '400px',
          background: 'var(--admin-bg-secondary)',
          border: '1px solid var(--admin-border)',
          borderTop: 'none',
          borderRadius: '0.5rem',
          boxShadow: '0 8px 24px var(--admin-shadow)',
          overflow: 'hidden',
          animation: 'admin-scale-in 0.2s ease-out',
          margin: 0,
          padding: 0
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid var(--admin-border)',
            borderTop: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 0
          }}>
            <h3 style={{
              margin: '0',
              color: 'var(--admin-text-primary)',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Notificaciones
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--admin-text-muted)',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.25rem',
                borderRadius: '0.25rem'
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Lista de notificaciones */}
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--admin-text-muted)'
              }}>
                <FaBell style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
                <p style={{ margin: '0', fontSize: '0.875rem' }}>
                  No hay notificaciones
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--admin-border)',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--admin-bg-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      marginTop: '0.125rem',
                      flexShrink: 0
                    }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}>
                        <h4 style={{
                          margin: '0',
                          color: 'var(--admin-text-primary)',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          {notification.title}
                        </h4>
                        <span style={{
                          background: getNotificationColor(notification.type) + '20',
                          color: getNotificationColor(notification.type),
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {notification.count}
                        </span>
                      </div>
                      
                      <p style={{
                        margin: '0 0 0.5rem 0',
                        color: 'var(--admin-text-secondary)',
                        fontSize: '0.75rem',
                        lineHeight: '1.4'
                      }}>
                        {notification.message}
                      </p>
                      
                      <div style={{
                        color: 'var(--admin-accent)',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {notification.action} →
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: '0.75rem',
              borderTop: '1px solid var(--admin-border)',
              textAlign: 'center'
            }}>
              <button
                onClick={() => {
                  setNotifications([]);
                  setIsOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--admin-bg-tertiary)';
                  e.target.style.color = 'var(--admin-text-primary)';
                }}
              >
                <FaCheck style={{ marginRight: '0.25rem' }} />
                Marcar todas como leídas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
