// src/features/admin/services/backupService.js - Servicio de backup automático
import { supabase } from '../../../services/supabase';

export const backupService = {
  // Crear backup completo de la base de datos
  async createFullBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupId = `backup_${timestamp}`;
      
      // Obtener todos los datos de las tablas principales
      const [productos, categorias, logs] = await Promise.all([
        this.getTableData('productos'),
        this.getTableData('categorias'),
        this.getTableData('admin_logs')
      ]);

      const backupData = {
        id: backupId,
        timestamp: new Date().toISOString(),
        version: '1.0',
        tables: {
          productos: productos.data || [],
          categorias: categorias.data || [],
          admin_logs: logs.data || []
        },
        metadata: {
          totalProducts: productos.data?.length || 0,
          totalCategories: categorias.data?.length || 0,
          totalLogs: logs.data?.length || 0,
          createdBy: 'admin@eram.com'
        }
      };

      // Guardar backup en Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('backups')
        .upload(`${backupId}.json`, JSON.stringify(backupData, null, 2), {
          contentType: 'application/json',
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Registrar en la tabla de backups
      const { error: dbError } = await supabase
        .from('backup_history')
        .insert({
          backup_id: backupId,
          backup_type: 'full',
          file_path: `backups/${backupId}.json`,
          file_size: JSON.stringify(backupData).length,
          status: 'completed',
          metadata: backupData.metadata
        });

      if (dbError) throw dbError;

      return {
        success: true,
        data: {
          backupId,
          timestamp: backupData.timestamp,
          metadata: backupData.metadata
        }
      };
    } catch (error) {
      console.error('Error creando backup completo:', error);
      return {
        success: false,
        message: error.message || 'Error al crear backup'
      };
    }
  },

  // Crear backup incremental (solo cambios desde el último backup)
  async createIncrementalBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupId = `incremental_${timestamp}`;
      
      // Obtener el último backup para comparar fechas
      const { data: lastBackup } = await supabase
        .from('backup_history')
        .select('timestamp')
        .eq('backup_type', 'full')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      const lastBackupDate = lastBackup?.timestamp || new Date(0).toISOString();

      // Obtener solo los datos modificados desde el último backup
      const [productos, categorias, logs] = await Promise.all([
        this.getTableData('productos', lastBackupDate),
        this.getTableData('categorias', lastBackupDate),
        this.getTableData('admin_logs', lastBackupDate)
      ]);

      const backupData = {
        id: backupId,
        timestamp: new Date().toISOString(),
        version: '1.0',
        type: 'incremental',
        lastBackupDate,
        tables: {
          productos: productos.data || [],
          categorias: categorias.data || [],
          admin_logs: logs.data || []
        },
        metadata: {
          totalProducts: productos.data?.length || 0,
          totalCategories: categorias.data?.length || 0,
          totalLogs: logs.data?.length || 0,
          createdBy: 'admin@eram.com'
        }
      };

      // Guardar backup incremental
      const { error: uploadError } = await supabase.storage
        .from('backups')
        .upload(`incremental/${backupId}.json`, JSON.stringify(backupData, null, 2), {
          contentType: 'application/json',
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Registrar en la tabla de backups
      const { error: dbError } = await supabase
        .from('backup_history')
        .insert({
          backup_id: backupId,
          backup_type: 'incremental',
          file_path: `backups/incremental/${backupId}.json`,
          file_size: JSON.stringify(backupData).length,
          status: 'completed',
          metadata: backupData.metadata
        });

      if (dbError) throw dbError;

      return {
        success: true,
        data: {
          backupId,
          timestamp: backupData.timestamp,
          metadata: backupData.metadata
        }
      };
    } catch (error) {
      console.error('Error creando backup incremental:', error);
      return {
        success: false,
        message: error.message || 'Error al crear backup incremental'
      };
    }
  },

  // Obtener datos de una tabla con filtro de fecha opcional
  async getTableData(tableName, sinceDate = null) {
    try {
      let query = supabase.from(tableName).select('*');
      
      if (sinceDate) {
        query = query.gte('updated_at', sinceDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error(`Error obteniendo datos de ${tableName}:`, error);
      return { data: null, error };
    }
  },

  // Obtener historial de backups
  async getBackupHistory(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('backup_history')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error obteniendo historial de backups:', error);
      return {
        success: false,
        message: error.message || 'Error al obtener historial de backups'
      };
    }
  },

  // Restaurar desde un backup
  async restoreFromBackup(backupId) {
    try {
      // Obtener información del backup
      const { data: backupInfo, error: infoError } = await supabase
        .from('backup_history')
        .select('*')
        .eq('backup_id', backupId)
        .single();

      if (infoError) throw infoError;

      // Descargar archivo de backup
      const { data: backupFile, error: downloadError } = await supabase.storage
        .from('backups')
        .download(backupInfo.file_path);

      if (downloadError) throw downloadError;

      // Leer contenido del archivo
      const backupContent = await backupFile.text();
      const backupData = JSON.parse(backupContent);

      // Crear backup de seguridad antes de restaurar
      const safetyBackup = await this.createFullBackup();
      if (!safetyBackup.success) {
        throw new Error('No se pudo crear backup de seguridad');
      }

      // Restaurar datos tabla por tabla
      const restoreResults = [];

      // Restaurar productos
      if (backupData.tables.productos?.length > 0) {
        const { error: productError } = await supabase
          .from('productos')
          .upsert(backupData.tables.productos, { onConflict: 'id' });
        
        restoreResults.push({
          table: 'productos',
          success: !productError,
          error: productError?.message
        });
      }

      // Restaurar categorías
      if (backupData.tables.categorias?.length > 0) {
        const { error: categoryError } = await supabase
          .from('categorias')
          .upsert(backupData.tables.categorias, { onConflict: 'id' });
        
        restoreResults.push({
          table: 'categorias',
          success: !categoryError,
          error: categoryError?.message
        });
      }

      // Registrar la restauración
      const { error: logError } = await supabase
        .from('backup_history')
        .insert({
          backup_id: `restore_${backupId}_${Date.now()}`,
          backup_type: 'restore',
          file_path: backupInfo.file_path,
          status: 'completed',
          metadata: {
            restoredFrom: backupId,
            restoreResults,
            safetyBackupId: safetyBackup.data.backupId
          }
        });

      if (logError) console.error('Error registrando restauración:', logError);

      return {
        success: true,
        data: {
          backupId,
          restoreResults,
          safetyBackupId: safetyBackup.data.backupId
        }
      };
    } catch (error) {
      console.error('Error restaurando backup:', error);
      return {
        success: false,
        message: error.message || 'Error al restaurar backup'
      };
    }
  },

  // Eliminar backup
  async deleteBackup(backupId) {
    try {
      // Obtener información del backup
      const { data: backupInfo, error: infoError } = await supabase
        .from('backup_history')
        .select('*')
        .eq('backup_id', backupId)
        .single();

      if (infoError) throw infoError;

      // Eliminar archivo del storage
      const { error: deleteError } = await supabase.storage
        .from('backups')
        .remove([backupInfo.file_path]);

      if (deleteError) throw deleteError;

      // Eliminar registro de la base de datos
      const { error: dbError } = await supabase
        .from('backup_history')
        .delete()
        .eq('backup_id', backupId);

      if (dbError) throw dbError;

      return { success: true };
    } catch (error) {
      console.error('Error eliminando backup:', error);
      return {
        success: false,
        message: error.message || 'Error al eliminar backup'
      };
    }
  },

  // Limpiar backups antiguos (mantener solo los últimos 30 días)
  async cleanOldBackups() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Obtener backups antiguos
      const { data: oldBackups, error: queryError } = await supabase
        .from('backup_history')
        .select('backup_id, file_path')
        .lt('timestamp', thirtyDaysAgo.toISOString());

      if (queryError) throw queryError;

      if (oldBackups && oldBackups.length > 0) {
        // Eliminar archivos del storage
        const filePaths = oldBackups.map(backup => backup.file_path);
        const { error: deleteError } = await supabase.storage
          .from('backups')
          .remove(filePaths);

        if (deleteError) throw deleteError;

        // Eliminar registros de la base de datos
        const backupIds = oldBackups.map(backup => backup.backup_id);
        const { error: dbError } = await supabase
          .from('backup_history')
          .delete()
          .in('backup_id', backupIds);

        if (dbError) throw dbError;
      }

      return {
        success: true,
        data: {
          deletedCount: oldBackups?.length || 0
        }
      };
    } catch (error) {
      console.error('Error limpiando backups antiguos:', error);
      return {
        success: false,
        message: error.message || 'Error al limpiar backups antiguos'
      };
    }
  },

  // Obtener estadísticas de backups
  async getBackupStats() {
    try {
      const { data: stats, error } = await supabase
        .from('backup_history')
        .select('backup_type, file_size, timestamp')
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const totalBackups = stats?.length || 0;
      const totalSize = stats?.reduce((sum, backup) => sum + (backup.file_size || 0), 0) || 0;
      const fullBackups = stats?.filter(b => b.backup_type === 'full').length || 0;
      const incrementalBackups = stats?.filter(b => b.backup_type === 'incremental').length || 0;

      return {
        success: true,
        data: {
          totalBackups,
          totalSize,
          fullBackups,
          incrementalBackups,
          averageSize: totalBackups > 0 ? Math.round(totalSize / totalBackups) : 0
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de backups:', error);
      return {
        success: false,
        message: error.message || 'Error al obtener estadísticas'
      };
    }
  }
};

export default backupService;
