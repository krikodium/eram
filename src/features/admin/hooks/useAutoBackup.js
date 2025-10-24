// src/features/admin/hooks/useAutoBackup.js - Hook para backup automático
import { useEffect, useRef } from 'react';
import { backupService } from '../services/backupService';
import { useActivityLog } from './useActivityLog';

export const useAutoBackup = () => {
  const intervalRef = useRef(null);
  const { logSystemAction } = useActivityLog();

  useEffect(() => {
    // Cargar configuración de auto-backup
    const settings = JSON.parse(localStorage.getItem('backupSettings') || '{}');
    const { autoBackupEnabled, backupInterval } = settings;

    if (autoBackupEnabled && backupInterval) {
      startAutoBackup(backupInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startAutoBackup = (intervalHours) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const intervalMs = intervalHours * 60 * 60 * 1000; // Convertir horas a milisegundos

    intervalRef.current = setInterval(async () => {
      try {
        // Verificar si es lunes para hacer backup completo semanal
        const today = new Date();
        const isMonday = today.getDay() === 1;
        const isFirstBackupOfDay = today.getHours() === 2; // 2 AM

        if (isMonday && isFirstBackupOfDay) {
          // Backup completo semanal
          const response = await backupService.createFullBackup();
          if (response.success) {
            await logSystemAction('backup', 'Backup completo semanal creado automáticamente', 'info', {
              backupId: response.data.backupId,
              type: 'weekly_full'
            });
          }
        } else {
          // Backup incremental diario
          const response = await backupService.createIncrementalBackup();
          if (response.success) {
            await logSystemAction('backup', 'Backup incremental creado automáticamente', 'info', {
              backupId: response.data.backupId,
              type: 'daily_incremental'
            });
          }
        }

        // Limpiar backups antiguos una vez por semana
        if (isMonday && isFirstBackupOfDay) {
          const cleanResponse = await backupService.cleanOldBackups();
          if (cleanResponse.success) {
            await logSystemAction('backup', `Limpieza automática: ${cleanResponse.data.deletedCount} backups antiguos eliminados`, 'info', {
              deletedCount: cleanResponse.data.deletedCount
            });
          }
        }
      } catch (error) {
        console.error('Error en backup automático:', error);
        await logSystemAction('error', `Error en backup automático: ${error.message}`, 'error', {
          context: 'auto_backup',
          error: error.message
        });
      }
    }, intervalMs);

    console.log(`Auto-backup iniciado con intervalo de ${intervalHours} horas`);
  };

  const stopAutoBackup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Auto-backup detenido');
    }
  };

  const updateAutoBackupSettings = (enabled, intervalHours) => {
    const settings = {
      autoBackupEnabled: enabled,
      backupInterval: intervalHours
    };
    localStorage.setItem('backupSettings', JSON.stringify(settings));

    if (enabled) {
      startAutoBackup(intervalHours);
    } else {
      stopAutoBackup();
    }
  };

  return {
    startAutoBackup,
    stopAutoBackup,
    updateAutoBackupSettings
  };
};

export default useAutoBackup;
