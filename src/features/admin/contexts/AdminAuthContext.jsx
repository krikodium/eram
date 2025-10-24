// src/features/admin/contexts/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth debe ser usado dentro de AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Credenciales del administrador
  const ADMIN_CREDENTIALS = {
    username: 'TomasE',
    password: 'Ron5776',
    name: 'Tomas Eram',
    role: 'admin'
  };

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar
    const savedSession = localStorage.getItem('eram-admin-session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        // Verificar que la sesión no haya expirado (24 horas)
        if (Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
          setAdminUser(sessionData.user);
        } else {
          localStorage.removeItem('eram-admin-session');
        }
      } catch (error) {
        localStorage.removeItem('eram-admin-session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const userData = {
        id: 1,
        username: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
        loginTime: new Date().toISOString()
      };
      
      // Guardar sesión en localStorage
      const sessionData = {
        user: userData,
        timestamp: Date.now()
      };
      localStorage.setItem('eram-admin-session', JSON.stringify(sessionData));
      
      setAdminUser(userData);
      setIsLoading(false);
      return { success: true, user: userData };
    } else {
      setIsLoading(false);
      return { 
        success: false, 
        error: 'Credenciales incorrectas. Usuario o contraseña inválidos.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('eram-admin-session');
    setAdminUser(null);
  };

  const isAuthenticated = () => {
    return adminUser !== null;
  };

  const value = {
    adminUser,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
