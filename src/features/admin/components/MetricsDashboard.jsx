// src/features/admin/components/MetricsDashboard.jsx - Dashboard de métricas con gráficos
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaUsers, 
  FaBox, 
  FaTags, 
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaDownload,
  FaCalendarAlt
} from 'react-icons/fa';
import { adminStatsService } from '../services/adminService';

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y
  const [activeChart, setActiveChart] = useState('products');

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await adminStatsService.getAdvancedMetrics(timeRange);
      setMetrics(data);
    } catch (error) {
      console.error('Error cargando métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-AR').format(value);
  };

  const getTimeRangeLabel = () => {
    const labels = {
      '7d': 'Últimos 7 días',
      '30d': 'Últimos 30 días',
      '90d': 'Últimos 90 días',
      '1y': 'Último año'
    };
    return labels[timeRange] || 'Últimos 7 días';
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
    return (
      <div className="admin-fade-in">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <div className="admin-loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="admin-fade-in">
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: 'var(--admin-text-muted)'
        }}>
          <FaChartLine style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <h3>No hay datos disponibles</h3>
          <p>Los datos de métricas se cargarán cuando haya actividad en el sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-fade-in">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ 
            margin: '0 0 0.5rem 0', 
            color: 'var(--admin-text-primary)',
            fontSize: '2rem',
            fontWeight: '700'
          }}>
            Dashboard de Métricas
          </h1>
          <p style={{ 
            margin: '0', 
            color: 'var(--admin-text-muted)',
            fontSize: '1rem'
          }}>
            Análisis detallado del rendimiento del sistema
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.5rem',
              background: 'var(--admin-bg-primary)',
              color: 'var(--admin-text-primary)',
              fontSize: '0.875rem'
            }}
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>
        </div>
      </div>

      {/* Métricas principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <MetricCard
          title="Total Productos"
          value={formatNumber(metrics.totalProducts)}
          icon={<FaBox />}
          color="var(--admin-primary)"
          trend={metrics.productsTrend}
          subtitle={`${metrics.newProductsThisPeriod} nuevos`}
        />
        <MetricCard
          title="Total Categorías"
          value={formatNumber(metrics.totalCategories)}
          icon={<FaTags />}
          color="var(--admin-success)"
          trend={metrics.categoriesTrend}
          subtitle={`${metrics.newCategoriesThisPeriod} nuevas`}
        />
        <MetricCard
          title="Valor Total Inventario"
          value={formatCurrency(metrics.totalInventoryValue)}
          icon={<FaDollarSign />}
          color="var(--admin-warning)"
          trend={metrics.inventoryTrend}
          subtitle="Valor estimado"
        />
        <MetricCard
          title="Actividad Reciente"
          value={formatNumber(metrics.recentActivity)}
          icon={<FaEye />}
          color="var(--admin-info)"
          trend={metrics.activityTrend}
          subtitle="Acciones últimas 24h"
        />
      </div>

      {/* Gráficos principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Gráfico de productos por categoría */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Productos por Categoría</h3>
            <div className="chart-controls">
              <button
                className={`chart-tab ${activeChart === 'products' ? 'active' : ''}`}
                onClick={() => setActiveChart('products')}
              >
                <FaChartPie />
              </button>
            </div>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.productsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {metrics.productsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de actividad temporal */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Actividad Temporal</h3>
            <div className="chart-controls">
              <button
                className={`chart-tab ${activeChart === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveChart('activity')}
              >
                <FaChartLine />
              </button>
            </div>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.activityOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="products"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="categories"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráficos secundarios */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Gráfico de precios */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Distribución de Precios</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.priceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => [formatNumber(value), 'Productos']} />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de tendencias */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Tendencias de Crecimiento</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.growthTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="products"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="categories"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla de métricas detalladas */}
      <div className="chart-container">
        <div className="chart-header">
          <h3>Métricas Detalladas</h3>
        </div>
        <div className="chart-content">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <MetricDetail
              title="Productos Activos"
              value={formatNumber(metrics.activeProducts)}
              percentage={metrics.activeProductsPercentage}
            />
            <MetricDetail
              title="Productos con Imagen"
              value={formatNumber(metrics.productsWithImages)}
              percentage={metrics.productsWithImagesPercentage}
            />
            <MetricDetail
              title="Categorías Activas"
              value={formatNumber(metrics.activeCategories)}
              percentage={metrics.activeCategoriesPercentage}
            />
            <MetricDetail
              title="Precio Promedio"
              value={formatCurrency(metrics.averagePrice)}
              percentage={metrics.averagePriceChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de tarjeta de métrica
const MetricCard = ({ title, value, icon, color, trend, subtitle }) => {
  const isPositive = trend > 0;
  const isNegative = trend < 0;
  const isNeutral = trend === 0;

  return (
    <div style={{
      background: 'var(--admin-bg-secondary)',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      border: '1px solid var(--admin-border)',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div>
          <h4 style={{
            margin: '0 0 0.5rem 0',
            color: 'var(--admin-text-secondary)',
            fontSize: '0.875rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {title}
          </h4>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--admin-text-primary)',
            marginBottom: '0.5rem'
          }}>
            {value}
          </div>
          <p style={{
            margin: '0',
            color: 'var(--admin-text-muted)',
            fontSize: '0.875rem'
          }}>
            {subtitle}
          </p>
        </div>
        <div style={{
          color: color,
          fontSize: '1.5rem',
          padding: '0.75rem',
          background: `${color}20`,
          borderRadius: '0.5rem'
        }}>
          {icon}
        </div>
      </div>
      
      {trend !== 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {isPositive && <FaArrowUp style={{ color: 'var(--admin-success)' }} />}
          {isNegative && <FaArrowDown style={{ color: 'var(--admin-error)' }} />}
          <span style={{
            color: isPositive ? 'var(--admin-success)' : 
                   isNegative ? 'var(--admin-error)' : 
                   'var(--admin-text-muted)'
          }}>
            {isPositive ? '+' : ''}{trend}%
          </span>
          <span style={{ color: 'var(--admin-text-muted)' }}>
            vs período anterior
          </span>
        </div>
      )}
    </div>
  );
};

// Componente de métrica detallada
const MetricDetail = ({ title, value, percentage }) => {
  return (
    <div style={{
      padding: '1rem',
      background: 'var(--admin-bg-hover)',
      borderRadius: '0.5rem',
      border: '1px solid var(--admin-border)'
    }}>
      <h4 style={{
        margin: '0 0 0.5rem 0',
        color: 'var(--admin-text-secondary)',
        fontSize: '0.75rem',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {title}
      </h4>
      <div style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--admin-text-primary)',
        marginBottom: '0.25rem'
      }}>
        {value}
      </div>
      {percentage !== undefined && (
        <div style={{
          fontSize: '0.75rem',
          color: percentage >= 0 ? 'var(--admin-success)' : 'var(--admin-error)',
          fontWeight: '500'
        }}>
          {percentage >= 0 ? '+' : ''}{percentage}%
        </div>
      )}
    </div>
  );
};

export default MetricsDashboard;
