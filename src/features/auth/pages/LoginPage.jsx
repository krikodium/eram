// src/features/auth/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaShieldAlt } from 'react-icons/fa';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/catalogo');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate('/catalogo');
      } else {
        setError(result.error || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Demo login function
  const handleDemoLogin = async () => {
    setFormData({
      email: 'proveedor@eram.com',
      password: 'demo123'
    });
    
    setIsLoading(true);
    
    try {
      const result = await login({
        email: 'proveedor@eram.com',
        password: 'demo123'
      });
      
      if (result.success) {
        navigate('/catalogo');
      }
    } catch (err) {
      setError('Error en login demo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-icon">
            <FaShieldAlt />
          </div>
          <h1>Área de Proveedores</h1>
          <p>Accede a precios especiales y condiciones exclusivas</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu-email@empresa.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Tu contraseña"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading || !formData.email || !formData.password}
          >
            {isLoading ? (
              <LoadingSpinner size="small" message="" />
            ) : (
              <>
                <FaSignInAlt />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="login-demo">
          <div className="demo-divider">
            <span>Demo para pruebas</span>
          </div>
          
          <button
            onClick={handleDemoLogin}
            className="demo-button"
            disabled={isLoading}
          >
            Probar con cuenta demo
          </button>
          
          <div className="demo-info">
            <p><strong>Cuenta Demo:</strong></p>
            <p>Email: proveedor@eram.com</p>
            <p>Contraseña: demo123</p>
          </div>
        </div>

        <div className="login-features">
          <h3>Beneficios del Área de Proveedores:</h3>
          <ul>
            <li>✅ Precios especiales para mayoristas</li>
            <li>✅ Condiciones de pago preferenciales</li>
            <li>✅ Acceso a productos exclusivos</li>
            <li>✅ Soporte técnico especializado</li>
          </ul>
        </div>

        <div className="login-footer">
          <p>¿No tienes cuenta? <span className="contact-info">Contacta a nuestro equipo comercial</span></p>
          <p className="note">* En esta demo, la autenticación es simulada para efectos de demostración.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;