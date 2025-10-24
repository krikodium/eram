// src/features/admin/components/ProductForm.jsx - Formulario de productos
import React, { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaEye, FaTimes } from 'react-icons/fa';
import { adminImageService } from '../services/adminService';

const ProductForm = ({ 
  product = null, 
  onSave, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_unitario: '',
    categoria_id: '',
    rubro_id: '',
    imagen_url: '',
    imagen_url_2: '',
    imagen_url_3: '',
    imagen_url_4: '',
    imagen_url_5: ''
  });
  
  const [categorias, setCategorias] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [uploadingImages, setUploadingImages] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio_unitario: product.precio_unitario || '',
        categoria_id: product.categoria_id || '',
        rubro_id: product.rubro_id || '',
        imagen_url: product.imagen_url || '',
        imagen_url_2: product.imagen_url_2 || '',
        imagen_url_3: product.imagen_url_3 || '',
        imagen_url_4: product.imagen_url_4 || '',
        imagen_url_5: product.imagen_url_5 || ''
      });
    }
    loadCategorias();
    loadRubros();
  }, [product]);

  const loadCategorias = async () => {
    try {
      // TODO: Implementar carga de categorías desde API
      setCategorias([
        { id: 1, nombre: 'Protección Personal' },
        { id: 2, nombre: 'Trabajo en Altura' },
        { id: 3, nombre: 'Seguridad Vial' }
      ]);
    } catch (error) {
      console.error('Error loading categorías:', error);
    }
  };

  const loadRubros = async () => {
    try {
      // TODO: Implementar carga de rubros desde API
      setRubros([
        { id: 1, nombre: 'Protección Personal' },
        { id: 2, nombre: 'Trabajo en Altura' }
      ]);
    } catch (error) {
      console.error('Error loading rubros:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = async (file, imageKey) => {
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        [imageKey]: 'Solo se permiten archivos de imagen'
      }));
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [imageKey]: 'El archivo no puede ser mayor a 5MB'
      }));
      return;
    }

    try {
      setUploadingImages(prev => ({ ...prev, [imageKey]: true }));
      
      // Generar ID temporal para el producto si es nuevo
      const productId = product?.id || 'temp_' + Date.now();
      const imageNumber = imageKey.split('_')[2] || '1';
      
      const imageUrl = await adminImageService.uploadImage(file, productId, imageNumber);
      
      setFormData(prev => ({
        ...prev,
        [imageKey]: imageUrl
      }));
      
      setErrors(prev => ({
        ...prev,
        [imageKey]: ''
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({
        ...prev,
        [imageKey]: 'Error al subir la imagen'
      }));
    } finally {
      setUploadingImages(prev => ({ ...prev, [imageKey]: false }));
    }
  };

  const handleRemoveImage = (imageKey) => {
    setFormData(prev => ({
      ...prev,
      [imageKey]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.precio_unitario || formData.precio_unitario <= 0) {
      newErrors.precio_unitario = 'El precio debe ser mayor a 0';
    }
    
    if (!formData.categoria_id) {
      newErrors.categoria_id = 'La categoría es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const productData = {
      ...formData,
      precio_unitario: parseFloat(formData.precio_unitario)
    };
    
    onSave(productData);
  };

  const ImageUploader = ({ imageKey, label, value }) => (
    <div className="admin-form-group">
      <label className="admin-form-label">{label}</label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0], imageKey)}
            className="admin-form-input"
            style={{ padding: '0.5rem' }}
          />
          {errors[imageKey] && (
            <p style={{ 
              color: 'var(--admin-error)', 
              fontSize: '0.75rem', 
              margin: '0.25rem 0 0 0' 
            }}>
              {errors[imageKey]}
            </p>
          )}
        </div>
        
        {value && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <img
              src={value}
              alt="Preview"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '0.375rem',
                border: '1px solid var(--admin-border)'
              }}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(imageKey)}
              style={{
                background: 'var(--admin-error)',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaTrash />
            </button>
          </div>
        )}
        
        {uploadingImages[imageKey] && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--admin-accent)',
            fontSize: '0.875rem'
          }}>
            <div className="admin-loading-spinner" style={{ width: '20px', height: '20px' }}></div>
            Subiendo...
          </div>
        )}
      </div>
    </div>
  );

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
          Información Básica
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="admin-form-input"
              placeholder="Nombre del producto"
            />
            {errors.nombre && (
              <p style={{ color: 'var(--admin-error)', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                {errors.nombre}
              </p>
            )}
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Precio *</label>
            <input
              type="number"
              name="precio_unitario"
              value={formData.precio_unitario}
              onChange={handleInputChange}
              className="admin-form-input"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.precio_unitario && (
              <p style={{ color: 'var(--admin-error)', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                {errors.precio_unitario}
              </p>
            )}
          </div>
        </div>
        
        <div className="admin-form-group">
          <label className="admin-form-label">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className="admin-form-input admin-form-textarea"
            placeholder="Descripción del producto"
            rows="3"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Categoría *</label>
            <select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleInputChange}
              className="admin-form-input admin-form-select"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            {errors.categoria_id && (
              <p style={{ color: 'var(--admin-error)', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                {errors.categoria_id}
              </p>
            )}
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Rubro</label>
            <select
              name="rubro_id"
              value={formData.rubro_id}
              onChange={handleInputChange}
              className="admin-form-input admin-form-select"
            >
              <option value="">Seleccionar rubro</option>
              {rubros.map(rubro => (
                <option key={rubro.id} value={rubro.id}>{rubro.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Imágenes */}
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
          Imágenes del Producto
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <ImageUploader
            imageKey="imagen_url"
            label="Imagen Principal *"
            value={formData.imagen_url}
          />
          <ImageUploader
            imageKey="imagen_url_2"
            label="Imagen 2"
            value={formData.imagen_url_2}
          />
          <ImageUploader
            imageKey="imagen_url_3"
            label="Imagen 3"
            value={formData.imagen_url_3}
          />
          <ImageUploader
            imageKey="imagen_url_4"
            label="Imagen 4"
            value={formData.imagen_url_4}
          />
          <ImageUploader
            imageKey="imagen_url_5"
            label="Imagen 5"
            value={formData.imagen_url_5}
          />
        </div>
      </div>

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
            product ? 'Actualizar Producto' : 'Crear Producto'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
