// src/features/admin/components/ImportProducts.jsx - Componente para importar productos masivamente
import React, { useState, useRef } from 'react';
import { FaUpload, FaFile, FaDownload, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { adminImportService } from '../services/adminService';
import { useToast } from './ToastContainer';

const ImportProducts = ({ onClose, onImportComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [step, setStep] = useState(1); // 1: Seleccionar archivo, 2: Preview, 3: Resultados
  const fileInputRef = useRef(null);
  const { showSuccess, showError, showWarning, showLoading } = useToast();

  // Plantilla de ejemplo
  const templateData = [
    {
      nombre: 'Producto Ejemplo 1',
      descripcion: 'Descripción del producto ejemplo',
      precio_unitario: 150.50,
      categoria: 'Categoría Ejemplo',
      stock: 100,
      imagen_url_1: 'https://ejemplo.com/imagen1.jpg',
      imagen_url_2: 'https://ejemplo.com/imagen2.jpg',
      imagen_url_3: '',
      imagen_url_4: '',
      imagen_url_5: '',
      activo: true
    }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(file.type)) {
      showError('Tipo de archivo no válido. Solo se permiten archivos CSV y Excel.');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    setSelectedFile(file);
    await processFile(file);
  };

  const processFile = async (file) => {
    setIsLoading(true);
    showLoading('Procesando archivo...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await adminImportService.processImportFile(file);
      
      if (response.success) {
        setPreviewData(response.data);
        setStep(2);
        showSuccess('Archivo procesado correctamente');
      } else {
        showError(response.message || 'Error al procesar el archivo');
      }
    } catch (error) {
      console.error('Error procesando archivo:', error);
      showError('Error al procesar el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!previewData || previewData.length === 0) {
      showWarning('No hay datos para importar');
      return;
    }

    setIsLoading(true);
    showLoading('Importando productos...');

    try {
      const response = await adminImportService.bulkCreateProducts(previewData);
      
      if (response.success) {
        setImportResults(response.data);
        setStep(3);
        showSuccess(`Se importaron ${response.data.successful} productos correctamente`);
        
        if (response.data.errors.length > 0) {
          showWarning(`${response.data.errors.length} productos tuvieron errores`);
        }
      } else {
        showError(response.message || 'Error al importar productos');
      }
    } catch (error) {
      console.error('Error importando productos:', error);
      showError('Error al importar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = convertToCSV(templateData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_productos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const resetImport = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setImportResults(null);
    setStep(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderStep1 = () => (
    <div className="import-step">
      <div className="import-header">
        <h3>Importar Productos Masivamente</h3>
        <p>Selecciona un archivo CSV o Excel para importar productos</p>
      </div>

      <div className="import-actions">
        <button
          onClick={downloadTemplate}
          className="admin-btn admin-btn-secondary"
          style={{ marginBottom: '1rem' }}
        >
          <FaDownload /> Descargar Plantilla CSV
        </button>
      </div>

      <div
        className={`import-dropzone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <div className="dropzone-content">
          <FaUpload className="dropzone-icon" />
          <h4>Arrastra tu archivo aquí o haz clic para seleccionar</h4>
          <p>Formatos soportados: CSV, Excel (.xlsx, .xls)</p>
          <p>Tamaño máximo: 10MB</p>
        </div>
      </div>

      {selectedFile && (
        <div className="file-selected">
          <FaFile className="file-icon" />
          <span>{selectedFile.name}</span>
          <span className="file-size">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="import-step">
      <div className="import-header">
        <h3>Vista Previa de Datos</h3>
        <p>Revisa los datos antes de importar</p>
      </div>

      <div className="preview-stats">
        <div className="stat-item">
          <span className="stat-number">{previewData?.length || 0}</span>
          <span className="stat-label">Productos a importar</span>
        </div>
      </div>

      <div className="preview-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {previewData?.slice(0, 10).map((product, index) => (
              <tr key={index}>
                <td>{product.nombre}</td>
                <td>${product.precio_unitario}</td>
                <td>{product.categoria}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.activo ? 'active' : 'inactive'}`}>
                    {product.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {previewData?.length > 10 && (
          <p className="preview-more">
            ... y {previewData.length - 10} productos más
          </p>
        )}
      </div>

      <div className="import-actions">
        <button
          onClick={resetImport}
          className="admin-btn admin-btn-secondary"
        >
          <FaTimes /> Cancelar
        </button>
        <button
          onClick={handleImport}
          className="admin-btn admin-btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="admin-loading-spinner" style={{ width: '16px', height: '16px' }}></div>
          ) : (
            <FaCheck />
          )}
          Importar Productos
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="import-step">
      <div className="import-header">
        <h3>Resultados de la Importación</h3>
        <p>Resumen del proceso de importación</p>
      </div>

      <div className="import-results">
        <div className="result-stats">
          <div className="result-item success">
            <FaCheck className="result-icon" />
            <div>
              <span className="result-number">{importResults?.successful || 0}</span>
              <span className="result-label">Importados correctamente</span>
            </div>
          </div>
          
          <div className="result-item error">
            <FaExclamationTriangle className="result-icon" />
            <div>
              <span className="result-number">{importResults?.errors?.length || 0}</span>
              <span className="result-label">Con errores</span>
            </div>
          </div>
        </div>

        {importResults?.errors && importResults.errors.length > 0 && (
          <div className="errors-list">
            <h4>Errores encontrados:</h4>
            <ul>
              {importResults.errors.slice(0, 5).map((error, index) => (
                <li key={index} className="error-item">
                  <strong>Fila {error.row}:</strong> {error.message}
                </li>
              ))}
              {importResults.errors.length > 5 && (
                <li>... y {importResults.errors.length - 5} errores más</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="import-actions">
        <button
          onClick={resetImport}
          className="admin-btn admin-btn-secondary"
        >
          <FaUpload /> Nueva Importación
        </button>
        <button
          onClick={() => {
            onImportComplete?.();
            onClose?.();
          }}
          className="admin-btn admin-btn-primary"
        >
          <FaCheck /> Finalizar
        </button>
      </div>
    </div>
  );

  return (
    <div className="import-modal-overlay">
      <div className="import-modal">
        <div className="import-modal-header">
          <h2>Importar Productos</h2>
          <button
            onClick={onClose}
            className="close-btn"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>

        <div className="import-modal-content">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

export default ImportProducts;
