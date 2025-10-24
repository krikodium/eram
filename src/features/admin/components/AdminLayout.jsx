// src/features/admin/components/AdminLayout.jsx - Layout principal del panel admin
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ToastContainer from './ToastContainer';
import NotificationCenter from './NotificationCenter';
import GlobalSearch from './GlobalSearch';
import HelpCenter from './HelpCenter';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import { useAutoBackup } from '../hooks/useAutoBackup';
import '../../../features/admin/styles/admin-theme.css';
import '../../../features/admin/styles/admin-components.css';

const AdminLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  
  // Inicializar auto-backup
  useAutoBackup();


  useEffect(() => {
    // Simular tiempo de carga para verificar autenticación
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Agregar clase al body para estilos específicos del panel admin
    document.body.classList.add('admin-panel');
    document.body.style.padding = '0';
    document.body.style.margin = '0';

    return () => {
      clearTimeout(timer);
      // Limpiar clase del body al desmontar
      document.body.classList.remove('admin-panel');
    };
  }, []);

  // Atajo de teclado para búsqueda global
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowGlobalSearch(true);
      }
      if (event.key === 'Escape' && showGlobalSearch) {
        setShowGlobalSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showGlobalSearch]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="admin-loading-overlay">
        <div className="admin-loading-spinner"></div>
      </div>
    );
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar rol de administrador
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className="admin-main">
        {/* Barra superior con búsqueda global y ayuda */}
        <div className="admin-top-bar">
          <div className="admin-actions">
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setShowGlobalSearch(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                background: 'var(--admin-bg-secondary)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span>Búsqueda Global</span>
              <kbd style={{
                background: 'var(--admin-bg-hover)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                color: 'var(--admin-text-muted)'
              }}>
                Ctrl+K
              </kbd>
            </button>
            
            <button
              onClick={() => setShowHelpCenter(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                background: 'var(--admin-accent)',
                border: '1px solid var(--admin-accent)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                fontWeight: '600',
                minWidth: '140px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--admin-accent-hover)';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--admin-accent)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
              <span>Centro de Ayuda</span>
            </button>
          </div>
        </div>

        <div className="admin-content admin-fade-in">
          {children}
        </div>
      </main>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Sistema de notificaciones */}
      <ToastContainer />
      
      {/* Centro de notificaciones */}
      <NotificationCenter />

      {/* Búsqueda Global */}
      {showGlobalSearch && (
        <GlobalSearch onClose={() => setShowGlobalSearch(false)} />
      )}

      {/* Centro de Ayuda */}
      {showHelpCenter && (
        <HelpCenter 
          isOpen={showHelpCenter}
          onClose={() => setShowHelpCenter(false)} 
        />
      )}
      

    </div>
  );
};

export default AdminLayout;
