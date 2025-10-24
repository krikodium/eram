// src/features/admin/pages/Exportar.jsx - Exportación de datos
import React, { useState, useEffect } from 'react';
import { FaDownload, FaFile, FaFilePdf, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { adminProductService, adminCategoryService, adminExportService } from '../services/adminService';
import { pdfService } from '../services/pdfService';

const Exportar = () => {
  const [activeTab, setActiveTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pdfOptions, setPdfOptions] = useState({
    includeImages: false,
    includeDescription: true,
    includeInactive: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        adminProductService.getAllProducts(),
        adminCategoryService.getAllCategories()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (type) => {
    if (type === 'productos') {
      if (selectedProducts.length === productos.length) {
        setSelectedProducts([]);
      } else {
        setSelectedProducts(productos.map(p => p.id));
      }
    } else {
      if (selectedCategories.length === categorias.length) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(categorias.map(c => c.id));
      }
    }
  };

  const handleSelectItem = (id, type) => {
    if (type === 'productos') {
      setSelectedProducts(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setSelectedCategories(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const csvContent = await adminExportService.exportProductsToCSV(selectedProducts);
      
      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `productos_eram_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error al exportar archivo CSV');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      
      if (activeTab === 'productos') {
        const productsToExport = selectedProducts.length > 0 
          ? productos.filter(p => selectedProducts.includes(p.id))
          : productos;
        
        if (productsToExport.length === 0) {
          window.adminToast?.warning('Sin productos', 'Selecciona al menos un producto para exportar');
          return;
        }

        const doc = await pdfService.generateProductPriceList(productsToExport, {
          includeDescription: pdfOptions.includeDescription,
          includeImages: pdfOptions.includeImages
        });
        
        pdfService.downloadPDF(doc, 'lista_precios_productos');
        window.adminToast?.success('PDF generado', 'La lista de precios se ha descargado correctamente');
        
      } else {
        const categoriesToExport = selectedCategories.length > 0 
          ? categorias.filter(c => selectedCategories.includes(c.id))
          : categorias;
        
        if (categoriesToExport.length === 0) {
          window.adminToast?.warning('Sin categorías', 'Selecciona al menos una categoría para exportar');
          return;
        }

        const doc = await pdfService.generateCategoryList(categoriesToExport);
        pdfService.downloadPDF(doc, 'lista_categorias');
        window.adminToast?.success('PDF generado', 'La lista de categorías se ha descargado correctamente');
      }
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      window.adminToast?.error('Error al exportar', 'No se pudo generar el archivo PDF');
    } finally {
      setExporting(false);
    }
  };

  const tabs = [
    { id: 'productos', label: 'Productos', count: productos.length },
    { id: 'categorias', label: 'Categorías', count: categorias.length }
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div className="admin-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0', 
          color: 'var(--admin-text-primary)',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Exportar Datos
        </h1>
        <p style={{ 
          margin: '0', 
          color: 'var(--admin-text-muted)',
          fontSize: '1rem'
        }}>
          Exporta productos y categorías en diferentes formatos
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--admin-border)',
        marginBottom: '2rem'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--admin-accent)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {tab.label}
            <span style={{
              background: activeTab === tab.id ? 'var(--admin-accent)20' : 'var(--admin-bg-tertiary)',
              color: activeTab === tab.id ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Contenido de tabs */}
      <div className="export-page-layout">
        {/* Lista de selección */}
        <div className="export-list-container">
          <div style={{
            background: 'var(--admin-bg-secondary)',
            borderRadius: '0.5rem',
            border: '1px solid var(--admin-border)',
            overflow: 'hidden'
          }}>
            {/* Header con selección */}
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid var(--admin-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  className="export-checkbox"
                  checked={
                    activeTab === 'productos' 
                      ? selectedProducts.length === productos.length && productos.length > 0
                      : selectedCategories.length === categorias.length && categorias.length > 0
                  }
                  onChange={() => handleSelectAll(activeTab)}
                />
                <span style={{ 
                  color: 'var(--admin-text-primary)', 
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}>
                  Seleccionar todo
                </span>
              </div>
              <span style={{ 
                color: 'var(--admin-text-muted)', 
                fontSize: '0.875rem' 
              }}>
                {activeTab === 'productos' ? selectedProducts.length : selectedCategories.length} seleccionados
              </span>
            </div>

            {/* Lista de elementos */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {activeTab === 'productos' ? (
                productos.map(producto => (
                  <div
                    key={producto.id}
                    className="export-list-item"
                    onClick={() => handleSelectItem(producto.id, 'productos')}
                  >
                    <input
                      type="checkbox"
                      className="export-checkbox"
                      checked={selectedProducts.includes(producto.id)}
                      onChange={() => handleSelectItem(producto.id, 'productos')}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="export-item-content">
                      <div className="export-item-main">
                        <div className="export-item-title">
                          {producto.nombre}
                        </div>
                        <div className="export-item-meta">
                          <div className="export-item-category">
                            {producto.categoria?.nombre || 'Sin categoría'}
                          </div>
                        </div>
                      </div>
                      {producto.descripcion && (
                        <div className="export-item-description">
                          {producto.descripcion}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                categorias.map(categoria => (
                  <div
                    key={categoria.id}
                    className="export-list-item"
                    onClick={() => handleSelectItem(categoria.id, 'categorias')}
                  >
                    <input
                      type="checkbox"
                      className="export-checkbox"
                      checked={selectedCategories.includes(categoria.id)}
                      onChange={() => handleSelectItem(categoria.id, 'categorias')}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="export-item-content">
                      <div className="export-item-main">
                        <div className="export-item-title">
                          {categoria.nombre}
                        </div>
                        <div className="export-item-meta">
                          <div className="export-item-category">
                            {categoria.productos?.length || 0} productos
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Panel de exportación */}
        <div className="export-panel-container">
          <div className="admin-card">
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              color: 'var(--admin-text-primary)',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              Opciones de Exportación
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleExportCSV}
                disabled={exporting || (activeTab === 'productos' ? selectedProducts.length === 0 : selectedCategories.length === 0)}
                style={{ width: '100%' }}
              >
                {exporting ? (
                  <div className="admin-btn-loading"></div>
                ) : (
                  <>
                    <FaFile />
                    Exportar CSV
                  </>
                )}
              </button>

              <button
                className="admin-btn admin-btn-secondary"
                onClick={handleExportPDF}
                disabled={exporting || (activeTab === 'productos' ? selectedProducts.length === 0 : selectedCategories.length === 0)}
                style={{ width: '100%' }}
              >
                {exporting ? (
                  <div className="admin-btn-loading"></div>
                ) : (
                  <>
                    <FaFilePdf />
                    Exportar PDF
                  </>
                )}
              </button>
            </div>

            {/* Opciones de PDF */}
            {activeTab === 'productos' && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'var(--admin-bg-tertiary)',
                borderRadius: '0.375rem',
                border: '1px solid var(--admin-border)'
              }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  Opciones de PDF
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={pdfOptions.includeDescription}
                      onChange={(e) => setPdfOptions(prev => ({
                        ...prev,
                        includeDescription: e.target.checked
                      }))}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ color: 'var(--admin-text-primary)' }}>
                      Incluir descripciones
                    </span>
                  </label>
                  
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={pdfOptions.includeImages}
                      onChange={(e) => setPdfOptions(prev => ({
                        ...prev,
                        includeImages: e.target.checked
                      }))}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ color: 'var(--admin-text-primary)' }}>
                      Incluir imágenes (experimental)
                    </span>
                  </label>
                </div>
              </div>
            )}

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--admin-bg-tertiary)',
              borderRadius: '0.375rem',
              border: '1px solid var(--admin-border)'
            }}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: 'var(--admin-text-primary)',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                Información
              </h4>
              <p style={{ 
                margin: '0', 
                color: 'var(--admin-text-muted)',
                fontSize: '0.75rem',
                lineHeight: '1.4'
              }}>
                • CSV: Datos en formato tabla<br/>
                • PDF: Lista de precios profesional<br/>
                • Selecciona elementos para exportar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exportar;
