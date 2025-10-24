// src/features/admin/pages/Productos.jsx - Gestión de productos
import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaUpload, FaDownload, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import DataTable from '../components/DataTable';
import ProductForm from '../components/ProductForm';
import ImportProducts from '../components/ImportProducts';
import AdvancedFilters from '../components/AdvancedFilters';
import { adminProductService, adminCategoryService } from '../services/adminService';
import { useToast } from '../components/ToastContainer';

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categoria_id: '',
    activo: '',
    precio_min: '',
    precio_max: '',
    fecha_desde: '',
    fecha_hasta: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminProductService.getAllProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
      useToast().error('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await adminCategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.nombre}"?`)) {
      try {
        await adminProductService.deleteProduct(product.id);
        useToast().success('Éxito', 'Producto eliminado correctamente');
        loadProducts();
      } catch (error) {
        console.error('Error eliminando producto:', error);
        useToast().error('Error', 'No se pudo eliminar el producto');
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await adminProductService.updateProduct(editingProduct.id, productData);
        useToast().success('Éxito', 'Producto actualizado correctamente');
      } else {
        await adminProductService.createProduct(productData);
        useToast().success('Éxito', 'Producto creado correctamente');
      }
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Error guardando producto:', error);
      useToast().error('Error', 'No se pudo guardar el producto');
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleApplyFilters = () => {
    loadProducts();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      categoria_id: '',
      activo: '',
      precio_min: '',
      precio_max: '',
      fecha_desde: '',
      fecha_hasta: '',
      search: ''
    });
    loadProducts();
    setShowFilters(false);
  };

  const handleImportComplete = () => {
    setShowImportModal(false);
    loadProducts();
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (value, product) => (
        <div>
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{value}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            ID: {product.id}
          </div>
        </div>
      )
    },
    {
      key: 'precio_unitario',
      label: 'Precio',
      render: (value) => `$${value?.toLocaleString() || '0'}`
    },
    {
      key: 'categoria',
      label: 'Categoría',
      render: (value, product) => product.categoria?.nombre || 'Sin categoría'
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (value) => (
        <span style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          background: value ? 'var(--admin-success-light)' : 'var(--admin-error-light)',
          color: value ? 'var(--admin-success)' : 'var(--admin-error)'
        }}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Creado',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== null && value !== undefined).length;

  return (
    <div className="admin-fade-in">
      <div className="admin-card">
        <div className="admin-card-header">
          <h1 className="admin-card-title">Gestión de Productos</h1>
          <p className="admin-card-subtitle">
            Administra el catálogo de productos, precios y categorías
          </p>
        </div>

        {/* Barra de acciones */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleCreateProduct}
              className="admin-btn admin-btn-primary"
            >
              <FaPlus />
              Nuevo Producto
            </button>
            
            <button
              onClick={() => setShowImportModal(true)}
              className="admin-btn admin-btn-secondary"
            >
              <FaUpload />
              Importar
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="admin-btn admin-btn-secondary"
            >
              <FaFilter />
              Filtros
              {activeFiltersCount > 0 && (
                <span style={{
                  background: 'var(--admin-accent)',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '0.125rem 0.375rem',
                  fontSize: '0.75rem',
                  marginLeft: '0.25rem'
                }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
            {products.length} productos total
          </div>
        </div>

        {/* Filtros avanzados */}
        {showFilters && (
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            categories={categories}
          />
        )}

        {/* Tabla de productos */}
        <DataTable
          data={products}
          columns={columns}
          loading={loading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          searchable={true}
          selectable={true}
          selectedItems={selectedProducts}
          onSelectionChange={setSelectedProducts}
        />
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-content">
              <ProductForm
                product={editingProduct}
                categories={categories}
                onSave={handleSaveProduct}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de importación */}
      {showImportModal && (
        <ImportProducts
          onClose={() => setShowImportModal(false)}
          onImportComplete={handleImportComplete}
        />
      )}
    </div>
  );
};

export default Productos;