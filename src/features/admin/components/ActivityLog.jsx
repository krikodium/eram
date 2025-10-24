// src/features/admin/components/ActivityLog.jsx - Componente para mostrar logs de actividad
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaDownload, FaEye, FaTrash, FaCalendarAlt, FaUser, FaCog } from 'react-icons/fa';
import { adminLogService } from '../services/adminService';
import DataTable from './DataTable';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    dateFrom: '',
    dateTo: '',
    severity: ''
  });
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadLogs();
  }, [currentPage, filters]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await adminLogService.getLogs({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        ...filters
      });
      
      if (response.success) {
        setLogs(response.data.logs);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error cargando logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadLogs();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      action: '',
      user: '',
      dateFrom: '',
      dateTo: '',
      severity: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSelectLog = (logId) => {
    setSelectedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === logs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(logs.map(log => log.id));
    }
  };

  const handleDeleteLogs = async () => {
    if (selectedLogs.length === 0) return;
    
    try {
      const response = await adminLogService.deleteLogs(selectedLogs);
      if (response.success) {
        setSelectedLogs([]);
        loadLogs();
      }
    } catch (error) {
      console.error('Error eliminando logs:', error);
    }
  };

  const handleExportLogs = async () => {
    try {
      const response = await adminLogService.exportLogs({
        search: searchTerm,
        ...filters,
        selectedIds: selectedLogs.length > 0 ? selectedLogs : null
      });
      
      if (response.success) {
        // Descargar archivo
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exportando logs:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'var(--admin-error)';
      case 'warning': return 'var(--admin-warning)';
      case 'info': return 'var(--admin-info)';
      case 'success': return 'var(--admin-success)';
      default: return 'var(--admin-text-muted)';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      case 'success': return '🟢';
      default: return '⚪';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'login': return '🔐';
      case 'logout': return '🚪';
      case 'export': return '📤';
      case 'import': return '📥';
      default: return '⚙️';
    }
  };

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={selectedLogs.length === logs.length && logs.length > 0}
          onChange={handleSelectAll}
          style={{ margin: 0 }}
        />
      ),
      render: (_, log) => (
        <input
          type="checkbox"
          checked={selectedLogs.includes(log.id)}
          onChange={() => handleSelectLog(log.id)}
          style={{ margin: 0 }}
        />
      )
    },
    {
      key: 'timestamp',
      label: 'Fecha/Hora',
      render: (value) => (
        <div style={{ fontSize: '0.875rem' }}>
          <div style={{ fontWeight: '500', color: 'var(--admin-text-primary)' }}>
            {new Date(value).toLocaleDateString()}
          </div>
          <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      key: 'user',
      label: 'Usuario',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaUser style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }} />
          <span style={{ fontSize: '0.875rem' }}>{value}</span>
        </div>
      )
    },
    {
      key: 'action',
      label: 'Acción',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>{getActionIcon(value)}</span>
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'resource',
      label: 'Recurso',
      render: (value) => (
        <span style={{ 
          fontSize: '0.875rem',
          color: 'var(--admin-text-primary)',
          fontWeight: '500'
        }}>
          {value}
        </span>
      )
    },
    {
      key: 'description',
      label: 'Descripción',
      render: (value) => (
        <div style={{ 
          fontSize: '0.875rem',
          color: 'var(--admin-text-secondary)',
          maxWidth: '300px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {value}
        </div>
      )
    },
    {
      key: 'severity',
      label: 'Severidad',
      render: (value) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          background: `${getSeverityColor(value)}20`,
          border: `1px solid ${getSeverityColor(value)}40`,
          width: 'fit-content'
        }}>
          <span style={{ fontSize: '0.75rem' }}>{getSeverityIcon(value)}</span>
          <span style={{ 
            fontSize: '0.75rem',
            fontWeight: '500',
            color: getSeverityColor(value),
            textTransform: 'uppercase'
          }}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'ip_address',
      label: 'IP',
      render: (value) => (
        <span style={{ 
          fontSize: '0.75rem',
          color: 'var(--admin-text-muted)',
          fontFamily: 'monospace'
        }}>
          {value}
        </span>
      )
    }
  ];

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
            Logs de Actividad
          </h1>
          <p style={{ 
            margin: '0', 
            color: 'var(--admin-text-muted)',
            fontSize: '1rem'
          }}>
            Registro de todas las acciones del administrador
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {selectedLogs.length > 0 && (
            <button
              className="admin-btn admin-btn-danger"
              onClick={handleDeleteLogs}
            >
              <FaTrash />
              Eliminar ({selectedLogs.length})
            </button>
          )}
          <button
            className="admin-btn admin-btn-secondary"
            onClick={handleExportLogs}
          >
            <FaDownload />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        background: 'var(--admin-bg-secondary)',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--admin-border)',
        marginBottom: '1.5rem'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--admin-text-primary)'
            }}>
              Buscar
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en logs..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.5rem',
                  background: 'var(--admin-bg-primary)',
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.875rem'
                }}
              />
              <FaSearch style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--admin-text-muted)',
                fontSize: '0.875rem'
              }} />
            </div>
          </div>

          <div style={{ minWidth: '150px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--admin-text-primary)'
            }}>
              Acción
            </label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.5rem',
                background: 'var(--admin-bg-primary)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="">Todas las acciones</option>
              <option value="create">Crear</option>
              <option value="update">Actualizar</option>
              <option value="delete">Eliminar</option>
              <option value="login">Iniciar sesión</option>
              <option value="logout">Cerrar sesión</option>
              <option value="export">Exportar</option>
              <option value="import">Importar</option>
            </select>
          </div>

          <div style={{ minWidth: '150px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--admin-text-primary)'
            }}>
              Severidad
            </label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.5rem',
                background: 'var(--admin-bg-primary)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="">Todas las severidades</option>
              <option value="error">Error</option>
              <option value="warning">Advertencia</option>
              <option value="info">Información</option>
              <option value="success">Éxito</option>
            </select>
          </div>

          <div style={{ minWidth: '150px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--admin-text-primary)'
            }}>
              Desde
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.5rem',
                background: 'var(--admin-bg-primary)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ minWidth: '150px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--admin-text-primary)'
            }}>
              Hasta
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.5rem',
                background: 'var(--admin-bg-primary)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
            >
              <FaSearch />
              Buscar
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={clearFilters}
            >
              <FaFilter />
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de logs */}
      <div style={{
        background: 'var(--admin-bg-secondary)',
        borderRadius: '0.75rem',
        border: '1px solid var(--admin-border)',
        overflow: 'hidden'
      }}>
        <DataTable
          data={logs}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron logs de actividad"
        />

        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{
            padding: '1rem',
            borderTop: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            
            <span style={{ 
              color: 'var(--admin-text-secondary)',
              fontSize: '0.875rem'
            }}>
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
