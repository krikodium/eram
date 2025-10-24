// src/contexts/AuthContext.jsx - Placeholder for Phase 1
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate login - will be replaced with real API in Phase 2
  const login = async (credentials) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login - determinar rol basado en email
      const isAdmin = credentials.email === 'admin@eram.com' || credentials.email.includes('admin');
      const mockUser = {
        id: isAdmin ? 1 : 2,
        email: credentials.email,
        role: isAdmin ? 'admin' : 'cliente',
        name: isAdmin ? 'Administrador ERAM' : 'Usuario Cliente',
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('eram-auth', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: 'Error de autenticación' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('eram-auth');
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('eram-auth');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('eram-auth');
      }
    } else {
      // Para desarrollo: auto-login como admin si no hay sesión guardada
      // Esto se puede quitar en producción
      const devAdmin = {
        id: 1,
        email: 'admin@eram.com',
        role: 'admin',
        name: 'Administrador ERAM',
      };
      setUser(devAdmin);
      setIsAuthenticated(true);
      localStorage.setItem('eram-auth', JSON.stringify(devAdmin));
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;