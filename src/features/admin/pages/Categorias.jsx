// src/features/admin/pages/Categorias.jsx - Gestión de categorías
import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import DataTable from '../components/DataTable';
import CategoryForm from '../components/CategoryForm';
import { adminCategoryService } from '../services/adminService';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [filters, setFilters] = useState({
    activa: '',
    orden: ''
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await adminCategoryService.getAllCategories();
      setCategorias(data);
    } catch (error) {
      console.error('Error loading categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (categoria) => {
    setEditingCategory(categoria);
    setShowModal(true);
  };

  const handleDelete = async (categoria) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
        await adminCategoryService.deleteCategory(categoria.id);
        window.adminToast?.success('Categoría eliminada', `"${categoria.nombre}" ha sido eliminada correctamente`);
        await loadCategorias();
      } catch (error) {
        window.adminToast?.error('Error al eliminar', error.message || 'No se pudo eliminar la categoría');
        console.error('Error deleting categoria:', error);
      }
    }
  };

  const handleSave = async (categoryData) => {
    try {
      setModalLoading(true);
      
      if (editingCategory) {
        await adminCategoryService.updateCategory(editingCategory.id, categoryData);
        window.adminToast?.success('Categoría actualizada', 'La categoría se ha actualizado correctamente');
      } else {
        await adminCategoryService.createCategory(categoryData);
        window.adminToast?.success('Categoría creada', 'La categoría se ha creado correctamente');
      }
      
      await loadCategorias();
      setShowModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      window.adminToast?.error('Error al guardar', 'No se pudo guardar la categoría. Intenta nuevamente.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleToggleStatus = async (categoria) => {
    try {
      const newStatus = !categoria.activa;
      await adminCategoryService.updateCategory(categoria.id, { activa: newStatus });
      window.adminToast?.success(
        'Estado actualizado', 
        `"${categoria.nombre}" ha sido ${newStatus ? 'activada' : 'desactivada'}`
      );
      await loadCategorias();
    } catch (error) {
      console.error('Error toggling status:', error);
      window.adminToast?.error('Error al cambiar estado', 'No se pudo cambiar el estado de la categoría');
    }
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (value, item) => (
        <div>
          <div style={{ 
            fontWeight: '500', 
            color: 'var(--admin-text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {value}
            {!item.activa && (
              <span style={{
                background: 'var(--admin-error)',
                color: 'white',
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
                fontSize: '0.625rem',
                fontWeight: '600'
              }}>
                INACTIVA
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            ID: {item.id} • Orden: {item.orden || 0}
          </div>
        </div>
      )
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (value) => (
        <div style={{ 
          color: 'var(--admin-text-secondary)',
          fontSize: '0.875rem',
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {value || 'Sin descripción'}
        </div>
      )
    },
    {
      key: 'productos',
      label: 'Productos',
      render: (value) => (
        <span style={{ 
          background: 'var(--admin-accent)20', 
          color: 'var(--admin-accent)',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          {value?.length || 0} productos
        </span>
      )
    },
    {
      key: 'activa',
      label: 'Estado',
      render: (value, item) => (
        <button
          onClick={() => handleToggleStatus(item)}
          style={{
            background: value ? 'var(--admin-success)20' : 'var(--admin-error)20',
            color: value ? 'var(--admin-success)' : 'var(--admin-error)',
            border: 'none',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}
        >
          {value ? <FaEye /> : <FaEyeSlash />}
          {value ? 'Activa' : 'Inactiva'}
        </button>
      )
    },
    {
      key: 'created_at',
      label: 'Fecha',
      render: (value) => (
        <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
          {new Date(value).toLocaleDateString()}
        </span>
      )
    }
  ];

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
            Gestión de Categorías
          </h1>
          <p style={{ 
            margin: '0', 
            color: 'var(--admin-text-muted)',
            fontSize: '1rem'
          }}>
            Administra las categorías de productos
          </p>
        </div>

        <button
          className="admin-btn admin-btn-primary"
          onClick={handleCreate}
        >
          <FaPlus />
          Agregar Categoría
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{
        background: 'var(--admin-bg-secondary)',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--admin-border)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FaSearch style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--admin-text-muted)',
              fontSize: '0.875rem'
            }} />
            <input
              type="text"
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
            {categorias.length} categorías
          </div>
        </div>
      </div>

      {/* Tabla de categorías */}
      <DataTable
        data={categorias}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchable={false} // Usamos nuestra propia búsqueda
      />

      {/* Modal de creación/edición */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--admin-bg-secondary)',
            borderRadius: '0.5rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid var(--admin-border)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--admin-border)'
            }}>
              <h3 style={{ 
                margin: '0', 
                color: 'var(--admin-text-primary)',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                {editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
              </h3>
              <button
                onClick={handleCancel}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--admin-bg-tertiary)';
                  e.target.style.color = 'var(--admin-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = 'var(--admin-text-muted)';
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <CategoryForm
              category={editingCategory}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={modalLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;
