// src/features/admin/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/dasheram');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <div className="logo-icon">
              <FaUser />
            </div>
          </div>
          <h1 className="admin-login-title">Panel Administrativo</h1>
          <p className="admin-login-subtitle">Acceso exclusivo para administradores</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-login-error">
              <span>{error}</span>
            </div>
          )}

          <div className="admin-login-field">
            <label htmlFor="username" className="admin-login-label">
              <FaUser className="field-icon" />
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-login-input"
              placeholder="Ingresa tu usuario"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password" className="admin-login-label">
              <FaLock className="field-icon" />
              Contraseña
            </label>
            <div className="admin-login-password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-login-input"
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="admin-login-spinner">
                <div className="spinner"></div>
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              <>
                <FaSignInAlt />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="admin-login-footer">
          <p className="admin-login-footer-text">
            Sistema de gestión ERAM - Acceso restringido
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
