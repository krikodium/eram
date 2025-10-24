// src/features/admin/pages/Dashboard.jsx - Panel principal del administrador
import React, { useState, useEffect } from 'react';
import { FaBox, FaTags, FaImage, FaPlus, FaChartBar, FaClock } from 'react-icons/fa';
import { adminStatsService } from '../services/adminService';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, recentData] = await Promise.all([
        adminStatsService.getGeneralStats(),
        adminStatsService.getRecentProducts(5)
      ]);
      
      setStats(statsData);
      setRecentProducts(recentData);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, description }) => (
    <div className="admin-card" style={{ 
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      border: `1px solid ${color}30`,
      textAlign: 'center',
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        fontSize: '2rem',
        margin: '0 auto 1.5rem auto'
      }}>
        <Icon />
      </div>
      <h3 style={{ 
        margin: '0 0 0.5rem 0', 
        color: 'var(--admin-text-primary)',
        fontSize: '2.5rem',
        fontWeight: '700'
      }}>
        {value}
      </h3>
      <p style={{ 
        margin: '0 0 0.25rem 0', 
        color: 'var(--admin-text-secondary)',
        fontSize: '1.125rem',
        fontWeight: '600'
      }}>
        {title}
      </p>
      {description && (
        <p style={{ 
          margin: '0', 
          color: 'var(--admin-text-muted)',
          fontSize: '0.875rem',
          lineHeight: '1.4'
        }}>
          {description}
        </p>
      )}
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, onClick, color = '#3B82F6' }) => (
    <button
      onClick={onClick}
      className="dashboard-quick-action"
      style={{ 
        '--admin-accent': color,
        '--admin-accent-05': `${color}05`,
        '--admin-accent-10': `${color}10`,
        '--admin-accent-20': `${color}20`,
        '--admin-accent-25': `${color}25`,
        '--admin-accent-30': `${color}30`
      }}
    >
      <div className="dashboard-quick-action-content">
        <div className="dashboard-quick-action-icon">
          <Icon />
        </div>
        <div className="dashboard-quick-action-text">
          <h4 className="dashboard-quick-action-title">
            {title}
          </h4>
          <p className="dashboard-quick-action-description">
            {description}
          </p>
        </div>
        <div className="dashboard-quick-action-arrow">
          →
        </div>
      </div>
    </button>
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <h3 style={{ color: 'var(--admin-error)', marginBottom: '1rem' }}>
          Error al cargar el dashboard
        </h3>
        <p style={{ color: 'var(--admin-text-muted)', marginBottom: '1.5rem' }}>
          {error}
        </p>
        <button 
          className="admin-btn admin-btn-primary"
          onClick={loadDashboardData}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="admin-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0', 
          color: 'var(--admin-text-primary)',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Dashboard
        </h1>
        <p style={{ 
          margin: '0', 
          color: 'var(--admin-text-muted)',
          fontSize: '1rem'
        }}>
          Panel de control y gestión de ERAM
        </p>
      </div>

      {/* Estadísticas principales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Total Productos"
          value={stats?.totalProducts || 0}
          icon={FaBox}
          color="var(--admin-accent)"
          description="Productos en catálogo"
        />
        <StatCard
          title="Categorías"
          value={stats?.totalCategories || 0}
          icon={FaTags}
          color="var(--admin-success)"
          description="Categorías activas"
        />
        <StatCard
          title="Con Imagen"
          value={stats?.productsWithImage || 0}
          icon={FaImage}
          color="var(--admin-warning)"
          description="Productos con foto"
        />
        <StatCard
          title="Sin Imagen"
          value={stats?.productsWithoutImage || 0}
          icon={FaImage}
          color="var(--admin-error)"
          description="Necesitan foto"
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '3fr 2fr', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Productos recientes */}
        <div className="admin-card dashboard-recent-products-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Productos Recientes</h3>
            <p className="admin-card-subtitle" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Últimos productos agregados</p>
          </div>
          <div>
            {recentProducts.length === 0 ? (
              <div className="dashboard-empty-state">
                <div className="dashboard-empty-icon">📦</div>
                <p className="dashboard-empty-text">No hay productos recientes</p>
              </div>
            ) : (
              <div className="dashboard-products-grid">
                {recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="dashboard-product-card"
                    onClick={() => window.location.href = `/dasheram/productos?edit=${product.id}`}
                  >
                    <div className="dashboard-product-content">
                      <h4 className="dashboard-product-title">
                        {product.nombre}
                      </h4>
                      <div className="dashboard-product-info">
                        <span className="dashboard-product-category">
                          {product.categoria?.nombre || 'Sin categoría'}
                        </span>
                        <div className="dashboard-product-price">
                          ${product.precio_unitario?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-product-date">
                      <FaClock />
                      {new Date(product.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="admin-card dashboard-actions-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Acciones Rápidas</h3>
            <p className="admin-card-subtitle" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Accesos directos</p>
          </div>
          <div className="dashboard-actions-grid">
            <QuickAction
              title="Agregar Producto"
              description="Crear nuevo producto"
              icon={FaPlus}
              onClick={() => window.location.href = '/dasheram/productos?action=create'}
              color="var(--admin-accent)"
            />
            <QuickAction
              title="Gestionar Categorías"
              description="Administrar categorías"
              icon={FaTags}
              onClick={() => window.location.href = '/dasheram/categorias'}
              color="var(--admin-success)"
            />
            <QuickAction
              title="Exportar Datos"
              description="Exportar productos y categorías"
              icon={FaChartBar}
              onClick={() => window.location.href = '/dasheram/exportar'}
              color="var(--admin-warning)"
            />
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      {stats?.productsWithoutImage > 0 && (
        <div className="admin-card" style={{
          border: '1px solid var(--admin-warning)',
          background: 'linear-gradient(135deg, var(--admin-warning)10, var(--admin-warning)05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--admin-warning)20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--admin-warning)',
              fontSize: '1.25rem'
            }}>
              <FaImage />
            </div>
            <div>
              <h4 style={{ 
                margin: '0 0 0.25rem 0', 
                color: 'var(--admin-text-primary)',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                Atención Requerida
              </h4>
              <p style={{ 
                margin: '0', 
                color: 'var(--admin-text-secondary)',
                fontSize: '0.875rem'
              }}>
                Tienes {stats.productsWithoutImage} productos sin imagen. 
                <a 
                  href="/dasheram/productos?filter=no-image" 
                  style={{ 
                    color: 'var(--admin-warning)', 
                    textDecoration: 'none',
                    marginLeft: '0.5rem'
                  }}
                >
                  Ver productos sin imagen →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
