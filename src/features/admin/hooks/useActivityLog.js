// src/features/admin/hooks/useActivityLog.js - Hook para registrar actividades automáticamente
import { useCallback } from 'react';
import { adminLogService } from '../services/adminService';
import { useAuth } from '../../../contexts/AuthContext';

export const useActivityLog = () => {
  const { user } = useAuth();

  const logActivity = useCallback(async (activityData) => {
    try {
      // Obtener información del navegador
      const userAgent = navigator.userAgent;
      const ipAddress = await getClientIP();

      const logData = {
        userId: user?.id || 'anonymous',
        userEmail: user?.email || 'anonymous@eram.com',
        action: activityData.action,
        resource: activityData.resource,
        resourceId: activityData.resourceId,
        description: activityData.description,
        severity: activityData.severity || 'info',
        ipAddress,
        userAgent,
        metadata: activityData.metadata || {}
      };

      await adminLogService.createLog(logData);
    } catch (error) {
      console.error('Error registrando actividad:', error);
    }
  }, [user]);

  // Funciones específicas para diferentes tipos de actividades
  const logProductAction = useCallback((action, product, details = '') => {
    const descriptions = {
      create: `Producto "${product.nombre}" creado exitosamente`,
      update: `Producto "${product.nombre}" actualizado`,
      delete: `Producto "${product.nombre}" eliminado`,
      view: `Producto "${product.nombre}" visualizado`
    };

    return logActivity({
      action,
      resource: 'productos',
      resourceId: product.id,
      description: descriptions[action] || details,
      severity: action === 'delete' ? 'warning' : 'info',
      metadata: {
        productName: product.nombre,
        productPrice: product.precio,
        productCategory: product.categoria
      }
    });
  }, [logActivity]);

  const logCategoryAction = useCallback((action, category, details = '') => {
    const descriptions = {
      create: `Categoría "${category.nombre}" creada exitosamente`,
      update: `Categoría "${category.nombre}" actualizada`,
      delete: `Categoría "${category.nombre}" eliminada`,
      view: `Categoría "${category.nombre}" visualizada`
    };

    return logActivity({
      action,
      resource: 'categorias',
      resourceId: category.id,
      description: descriptions[action] || details,
      severity: action === 'delete' ? 'warning' : 'info',
      metadata: {
        categoryName: category.nombre,
        categoryDescription: category.descripcion
      }
    });
  }, [logActivity]);

  const logImportAction = useCallback((type, count, details = '') => {
    return logActivity({
      action: 'import',
      resource: type,
      description: `Importación masiva de ${count} ${type}`,
      severity: 'info',
      metadata: {
        importType: type,
        itemCount: count,
        details
      }
    });
  }, [logActivity]);

  const logExportAction = useCallback((type, count, format, details = '') => {
    return logActivity({
      action: 'export',
      resource: type,
      description: `Exportación de ${count} ${type} en formato ${format}`,
      severity: 'info',
      metadata: {
        exportType: type,
        itemCount: count,
        format,
        details
      }
    });
  }, [logActivity]);

  const logLoginAction = useCallback((success = true, details = '') => {
    return logActivity({
      action: 'login',
      resource: 'auth',
      description: success ? 'Inicio de sesión exitoso' : 'Intento de inicio de sesión fallido',
      severity: success ? 'success' : 'error',
      metadata: {
        success,
        details
      }
    });
  }, [logActivity]);

  const logLogoutAction = useCallback(() => {
    return logActivity({
      action: 'logout',
      resource: 'auth',
      description: 'Cierre de sesión',
      severity: 'info'
    });
  }, [logActivity]);

  const logError = useCallback((error, context = '') => {
    return logActivity({
      action: 'error',
      resource: 'system',
      description: `Error en ${context}: ${error.message}`,
      severity: 'error',
      metadata: {
        errorMessage: error.message,
        errorStack: error.stack,
        context
      }
    });
  }, [logActivity]);

  const logSystemAction = useCallback((action, description, severity = 'info', metadata = {}) => {
    return logActivity({
      action,
      resource: 'system',
      description,
      severity,
      metadata
    });
  }, [logActivity]);

  return {
    logActivity,
    logProductAction,
    logCategoryAction,
    logImportAction,
    logExportAction,
    logLoginAction,
    logLogoutAction,
    logError,
    logSystemAction
  };
};

// Función auxiliar para obtener la IP del cliente
const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error obteniendo IP:', error);
    return 'unknown';
  }
};

export default useActivityLog;
