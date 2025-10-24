// src/features/admin/components/CategoryForm.jsx - Formulario de categorías
import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const CategoryForm = ({ 
  category = null, 
  onSave, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activa: true,
    orden: 0
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        nombre: category.nombre || '',
        descripcion: category.descripcion || '',
        activa: category.activa !== undefined ? category.activa : true,
        orden: category.orden || 0
      });
    }
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre.trim().length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }
    
    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }
    
    if (formData.orden < 0) {
      newErrors.orden = 'El orden debe ser mayor o igual a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const categoryData = {
      ...formData,
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      orden: parseInt(formData.orden) || 0
    };
    
    onSave(categoryData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Información básica */}
      <div style={{
        background: 'var(--admin-bg-tertiary)',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--admin-border)'
      }}>
        <h3 style={{ 
          margin: '0 0 1.5rem 0', 
          color: 'var(--admin-text-primary)',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          Información de la Categoría
        </h3>
        
        <div className="admin-form-group">
          <label className="admin-form-label">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="admin-form-input"
            placeholder="Nombre de la categoría"
            maxLength="100"
          />
          {errors.nombre && (
            <p style={{ color: 'var(--admin-error)', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
              {errors.nombre}
            </p>
          )}
        </div>
        
        <div className="admin-form-group">
          <label className="admin-form-label">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className="admin-form-input admin-form-textarea"
            placeholder="Descripción de la categoría (opcional)"
            rows="3"
            maxLength="500"
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '0.25rem'
          }}>
            {errors.descripcion && (
              <p style={{ color: 'var(--admin-error)', fontSize: '0.75rem', margin: '0' }}>
                {errors.descripcion}
              </p>
            )}
            <p style={{ 
              color: 'var(--admin-text-muted)', 
              fontSize: '0.75rem', 
              margin: '0',
              marginLeft: 'auto'
            }}>
              {formData.descripcion.length}/500 caracteres
            </p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Orden</label>
            <input
              type="number"
              name="orden"
              value={formData.orden}
              onChange={handleInputChange}
              className="admin-form-input"
              placeholder="0"
              min="0"
            />
            {errors.orden && (
              <p style={{ color: 'var(--admin-error)', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                {errors.orden}
              </p>
            )}
            <p style={{ 
              color: 'var(--admin-text-muted)', 
              fontSize: '0.75rem', 
              margin: '0.25rem 0 0 0'
            }}>
              Menor número = aparece primero
            </p>
          </div>
          
          <div className="admin-form-group">
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              cursor: 'pointer',
              marginBottom: '0.5rem'
            }}>
              <input
                type="checkbox"
                name="activa"
                checked={formData.activa}
                onChange={handleInputChange}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ color: 'var(--admin-text-primary)', fontWeight: '500' }}>
                Categoría Activa
              </span>
            </label>
            <p style={{ 
              color: 'var(--admin-text-muted)', 
              fontSize: '0.75rem', 
              margin: '0'
            }}>
              Las categorías inactivas no se muestran en el catálogo
            </p>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      {category && (
        <div style={{
          background: 'var(--admin-bg-tertiary)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--admin-border)'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: 'var(--admin-text-primary)',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Información Adicional
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ 
                color: 'var(--admin-text-muted)', 
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.25rem',
                display: 'block'
              }}>
                ID de la Categoría
              </label>
              <div style={{
                padding: '0.75rem',
                background: 'var(--admin-bg-secondary)',
                borderRadius: '0.375rem',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-primary)',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                {category.id}
              </div>
            </div>
            
            <div>
              <label style={{ 
                color: 'var(--admin-text-muted)', 
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.25rem',
                display: 'block'
              }}>
                Fecha de Creación
              </label>
              <div style={{
                padding: '0.75rem',
                background: 'var(--admin-bg-secondary)',
                borderRadius: '0.375rem',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.875rem'
              }}>
                {new Date(category.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end',
        paddingTop: '1rem',
        borderTop: '1px solid var(--admin-border)'
      }}>
        <button
          type="button"
          onClick={onCancel}
          className="admin-btn admin-btn-secondary"
          disabled={loading}
        >
          <FaTimes />
          Cancelar
        </button>
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={loading}
        >
          {loading ? (
            <div className="admin-btn-loading"></div>
          ) : (
            <>
              <FaSave />
              {category ? 'Actualizar Categoría' : 'Crear Categoría'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
