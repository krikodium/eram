// src/features/admin/components/BackupManager.jsx - Gestión de backups automáticos
import React, { useState, useEffect } from 'react';
import { FaDownload, FaTrash, FaHistory, FaPlay, FaPause, FaCog, FaInfo, FaExclamationTriangle } from 'react-icons/fa';
import { backupService } from '../services/backupService';
import { useToast } from './ToastContainer';

const BackupManager = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [backupInterval, setBackupInterval] = useState(24); // horas
  const [selectedBackups, setSelectedBackups] = useState([]);
  const { showSuccess, showError, showWarning, showLoading } = useToast();

  useEffect(() => {
    loadBackups();
    loadStats();
    loadSettings();
  }, []);

  const loadBackups = async () => {
    setLoading(true);
    try {
      const response = await backupService.getBackupHistory();
      if (response.success) {
        setBackups(response.data);
      }
    } catch (error) {
      console.error('Error cargando backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await backupService.getBackupStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const loadSettings = () => {
    // Cargar configuración desde localStorage
    const settings = JSON.parse(localStorage.getItem('backupSettings') || '{}');
    setAutoBackupEnabled(settings.autoBackupEnabled || false);
    setBackupInterval(settings.backupInterval || 24);
  };

  const saveSettings = () => {
    const settings = {
      autoBackupEnabled,
      backupInterval
    };
    localStorage.setItem('backupSettings', JSON.stringify(settings));
    showSuccess('Configuración guardada');
  };

  const handleCreateBackup = async (type = 'full') => {
    showLoading(`Creando backup ${type === 'full' ? 'completo' : 'incremental'}...`);
    
    try {
      const response = type === 'full' 
        ? await backupService.createFullBackup()
        : await backupService.createIncrementalBackup();
      
      if (response.success) {
        showSuccess(`Backup ${type} creado exitosamente`);
        loadBackups();
        loadStats();
      } else {
        showError(response.message || 'Error al crear backup');
      }
    } catch (error) {
      console.error('Error creando backup:', error);
      showError('Error al crear backup');
    }
  };

  const handleRestoreBackup = async (backupId) => {
    if (!window.confirm('¿Estás seguro de que quieres restaurar este backup? Se creará un backup de seguridad antes de proceder.')) {
      return;
    }

    showLoading('Restaurando backup...');
    
    try {
      const response = await backupService.restoreFromBackup(backupId);
      
      if (response.success) {
        showSuccess('Backup restaurado exitosamente');
        loadBackups();
      } else {
        showError(response.message || 'Error al restaurar backup');
      }
    } catch (error) {
      console.error('Error restaurando backup:', error);
      showError('Error al restaurar backup');
    }
  };

  const handleDeleteBackup = async (backupId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este backup?')) {
      return;
    }

    try {
      const response = await backupService.deleteBackup(backupId);
      
      if (response.success) {
        showSuccess('Backup eliminado exitosamente');
        loadBackups();
        loadStats();
      } else {
        showError(response.message || 'Error al eliminar backup');
      }
    } catch (error) {
      console.error('Error eliminando backup:', error);
      showError('Error al eliminar backup');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBackups.length === 0) return;
    
    if (!window.confirm(`¿Estás seguro de que quieres eliminar ${selectedBackups.length} backups?`)) {
      return;
    }

    showLoading('Eliminando backups seleccionados...');
    
    try {
      const promises = selectedBackups.map(id => backupService.deleteBackup(id));
      await Promise.all(promises);
      
      showSuccess(`${selectedBackups.length} backups eliminados exitosamente`);
      setSelectedBackups([]);
      loadBackups();
      loadStats();
    } catch (error) {
      console.error('Error eliminando backups:', error);
      showError('Error al eliminar backups');
    }
  };

  const handleCleanOldBackups = async () => {
    if (!window.confirm('¿Estás seguro de que quieres limpiar los backups antiguos (más de 30 días)?')) {
      return;
    }

    showLoading('Limpiando backups antiguos...');
    
    try {
      const response = await backupService.cleanOldBackups();
      
      if (response.success) {
        showSuccess(`${response.data.deletedCount} backups antiguos eliminados`);
        loadBackups();
        loadStats();
      } else {
        showError(response.message || 'Error al limpiar backups');
      }
    } catch (error) {
      console.error('Error limpiando backups:', error);
      showError('Error al limpiar backups');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getBackupTypeIcon = (type) => {
    switch (type) {
      case 'full': return '💾';
      case 'incremental': return '🔄';
      case 'restore': return '↩️';
      default: return '📁';
    }
  };

  const getBackupTypeColor = (type) => {
    switch (type) {
      case 'full': return 'var(--admin-primary)';
      case 'incremental': return 'var(--admin-info)';
      case 'restore': return 'var(--admin-warning)';
      default: return 'var(--admin-text-muted)';
    }
  };

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
            Gestión de Backups
          </h1>
          <p style={{ 
            margin: '0', 
            color: 'var(--admin-text-muted)',
            fontSize: '1rem'
          }}>
            Administra los backups automáticos y manuales
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => handleCreateBackup('incremental')}
          >
            <FaPlay />
            Backup Incremental
          </button>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => handleCreateBackup('full')}
          >
            <FaDownload />
            Backup Completo
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'var(--admin-bg-secondary)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--admin-border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-primary)', marginBottom: '0.5rem' }}>
              {stats.totalBackups}
            </div>
            <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
              Total de Backups
            </div>
          </div>
          
          <div style={{
            background: 'var(--admin-bg-secondary)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--admin-border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-success)', marginBottom: '0.5rem' }}>
              {formatFileSize(stats.totalSize)}
            </div>
            <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
              Tamaño Total
            </div>
          </div>
          
          <div style={{
            background: 'var(--admin-bg-secondary)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--admin-border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-info)', marginBottom: '0.5rem' }}>
              {stats.fullBackups}
            </div>
            <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
              Backups Completos
            </div>
          </div>
          
          <div style={{
            background: 'var(--admin-bg-secondary)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--admin-border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-warning)', marginBottom: '0.5rem' }}>
              {stats.incrementalBackups}
            </div>
            <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
              Backups Incrementales
            </div>
          </div>
        </div>
      )}

      {/* Configuración de Auto-Backup */}
      <div style={{
        background: 'var(--admin-bg-secondary)',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--admin-border)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ 
          margin: '0 0 1rem 0', 
          color: 'var(--admin-text-primary)',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          <FaCog style={{ marginRight: '0.5rem' }} />
          Configuración de Auto-Backup
        </h3>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoBackupEnabled}
              onChange={(e) => setAutoBackupEnabled(e.target.checked)}
              style={{ margin: 0 }}
            />
            <span style={{ color: 'var(--admin-text-primary)', fontWeight: '500' }}>
              Habilitar Auto-Backup
            </span>
          </label>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
              Intervalo:
            </label>
            <input
              type="number"
              value={backupInterval}
              onChange={(e) => setBackupInterval(parseInt(e.target.value) || 24)}
              min="1"
              max="168"
              style={{
                width: '80px',
                padding: '0.5rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.375rem',
                background: 'var(--admin-bg-primary)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.875rem'
              }}
            />
            <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
              horas
            </span>
          </div>
          
          <button
            className="admin-btn admin-btn-primary"
            onClick={saveSettings}
          >
            Guardar Configuración
          </button>
        </div>
        
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'var(--admin-bg-hover)',
          borderRadius: '0.5rem',
          border: '1px solid var(--admin-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <FaInfo style={{ color: 'var(--admin-info)' }} />
            <span style={{ color: 'var(--admin-text-primary)', fontWeight: '500' }}>
              Información sobre Auto-Backup
            </span>
          </div>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '1.5rem', 
            color: 'var(--admin-text-secondary)',
            fontSize: '0.875rem'
          }}>
            <li>Los backups automáticos se ejecutan en segundo plano</li>
            <li>Se crean backups incrementales cada {backupInterval} horas</li>
            <li>Se crea un backup completo semanalmente</li>
            <li>Los backups antiguos (más de 30 días) se eliminan automáticamente</li>
          </ul>
        </div>
      </div>

      {/* Lista de Backups */}
      <div style={{
        background: 'var(--admin-bg-secondary)',
        borderRadius: '0.75rem',
        border: '1px solid var(--admin-border)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--admin-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h3 style={{ 
            margin: 0, 
            color: 'var(--admin-text-primary)',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            <FaHistory style={{ marginRight: '0.5rem' }} />
            Historial de Backups
          </h3>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {selectedBackups.length > 0 && (
              <button
                className="admin-btn admin-btn-danger"
                onClick={handleDeleteSelected}
              >
                <FaTrash />
                Eliminar ({selectedBackups.length})
              </button>
            )}
            <button
              className="admin-btn admin-btn-secondary"
              onClick={handleCleanOldBackups}
            >
              <FaExclamationTriangle />
              Limpiar Antiguos
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="admin-loading-spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ margin: '1rem 0 0 0', color: 'var(--admin-text-muted)' }}>
              Cargando backups...
            </p>
          </div>
        ) : backups.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>
              No hay backups disponibles
            </p>
          </div>
        ) : (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--admin-bg-hover)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--admin-border)' }}>
                    <input
                      type="checkbox"
                      checked={selectedBackups.length === backups.length && backups.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBackups(backups.map(b => b.backup_id));
                        } else {
                          setSelectedBackups([]);
                        }
                      }}
                      style={{ margin: 0 }}
                    />
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)', fontWeight: '600' }}>
                    Tipo
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)', fontWeight: '600' }}>
                    Fecha
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)', fontWeight: '600' }}>
                    Tamaño
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)', fontWeight: '600' }}>
                    Estado
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)', fontWeight: '600' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup) => (
                  <tr key={backup.backup_id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <input
                        type="checkbox"
                        checked={selectedBackups.includes(backup.backup_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBackups(prev => [...prev, backup.backup_id]);
                          } else {
                            setSelectedBackups(prev => prev.filter(id => id !== backup.backup_id));
                          }
                        }}
                        style={{ margin: 0 }}
                      />
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>
                          {getBackupTypeIcon(backup.backup_type)}
                        </span>
                        <span style={{ 
                          color: getBackupTypeColor(backup.backup_type),
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {backup.backup_type}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--admin-text-primary)' }}>
                      {formatDate(backup.timestamp)}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--admin-text-secondary)' }}>
                      {formatFileSize(backup.file_size || 0)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: backup.status === 'completed' ? 'var(--admin-success)20' : 'var(--admin-error)20',
                        color: backup.status === 'completed' ? 'var(--admin-success)' : 'var(--admin-error)',
                        border: `1px solid ${backup.status === 'completed' ? 'var(--admin-success)40' : 'var(--admin-error)40'}`
                      }}>
                        {backup.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {backup.backup_type !== 'restore' && (
                          <button
                            className="admin-btn admin-btn-secondary"
                            onClick={() => handleRestoreBackup(backup.backup_id)}
                            style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                          >
                            Restaurar
                          </button>
                        )}
                        <button
                          className="admin-btn admin-btn-danger"
                          onClick={() => handleDeleteBackup(backup.backup_id)}
                          style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupManager;
