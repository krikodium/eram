// src/features/admin/components/AdminSidebar.jsx - Navegación lateral del panel admin
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaTags, 
  FaUsers, 
  FaCog, 
  FaFileExport,
  FaChartBar,
  FaChartLine,
  FaSearch,
  FaBars,
  FaTimes,
  FaHistory,
  FaDatabase
} from 'react-icons/fa';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/dasheram',
      label: 'Dashboard',
      icon: FaHome,
      exact: true
    },
    {
      path: '/dasheram/productos',
      label: 'Productos',
      icon: FaBox
    },
    {
      path: '/dasheram/categorias',
      label: 'Categorías',
      icon: FaTags
    },
    {
      path: '/dasheram/exportar',
      label: 'Exportar',
      icon: FaFileExport
    },
    {
      path: '/dasheram/metricas',
      label: 'Métricas',
      icon: FaChartLine
    },
    {
      path: '/dasheram/logs',
      label: 'Logs de Actividad',
      icon: FaHistory
    },
    {
      path: '/dasheram/backups',
      label: 'Backups',
      icon: FaDatabase
    },
    {
      path: '/dasheram/usuarios',
      label: 'Usuarios',
      icon: FaUsers
    },
    {
      path: '/dasheram/configuracion',
      label: 'Configuración',
      icon: FaCog
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Botón de toggle para móvil */}
      <button
        className="admin-sidebar-toggle"
        onClick={onToggle}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1001,
          background: 'var(--admin-bg-secondary)',
          border: '1px solid var(--admin-border)',
          borderRadius: '0.375rem',
          padding: '0.5rem',
          color: 'var(--admin-text-primary)',
          cursor: 'pointer',
          display: 'none'
        }}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside 
        className={`admin-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          display: isOpen ? 'block' : 'none'
        }}
      >
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">ERAM</div>
          <div className="admin-sidebar-subtitle">Panel Administrativo</div>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                onClick={() => {
                  // Cerrar sidebar en móvil al hacer clic
                  if (window.innerWidth <= 768) {
                    onToggle();
                  }
                }}
              >
                <Icon className="admin-nav-icon" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Información del usuario */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          padding: '1rem',
          background: 'var(--admin-bg-tertiary)',
          borderRadius: '0.375rem',
          border: '1px solid var(--admin-border)'
        }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'var(--admin-text-primary)',
            marginBottom: '0.25rem'
          }}>
            Administrador
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--admin-text-muted)'
          }}>
            Panel de Control
          </div>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 768px) {
          .admin-sidebar-toggle {
            display: block !important;
          }
          
          .admin-sidebar {
            display: ${isOpen ? 'block' : 'none'} !important;
          }
        }
        
        @media (min-width: 769px) {
          .admin-sidebar-toggle {
            display: none !important;
          }
          
          .admin-sidebar {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
