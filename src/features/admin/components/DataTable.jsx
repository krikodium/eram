// src/features/admin/components/DataTable.jsx - Tabla de datos reutilizable
import React, { useState, useMemo } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaFilter } from 'react-icons/fa';

const DataTable = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onDuplicate,
  loading = false,
  searchable = true,
  sortable = true,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  actions = true,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar datos
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item =>
      columns.some(column => {
        const value = item[column.key];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginación
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Manejar ordenamiento
  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Manejar selección
  const handleSelectAll = (checked) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange(paginatedData.map(item => item.id));
      } else {
        onSelectionChange([]);
      }
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange([...selectedItems, itemId]);
      } else {
        onSelectionChange(selectedItems.filter(id => id !== itemId));
      }
    }
  };

  // Obtener icono de ordenamiento
  const getSortIcon = (key) => {
    if (!sortable) return null;
    if (sortConfig.key !== key) return <FaSort className="admin-sort-icon" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="admin-sort-icon active" />
      : <FaSortDown className="admin-sort-icon active" />;
  };

  if (loading) {
    return (
      <div className="admin-table-container">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="admin-loading-spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--admin-text-muted)' }}>
            Cargando datos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-table-container ${className}`}>
      {/* Barra de búsqueda */}
      {searchable && (
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid var(--admin-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
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
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
            {filteredData.length} de {data.length} elementos
          </div>
        </div>
      )}

      {/* Tabla */}
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              {selectable && (
                <th style={{ width: '50px' }}>
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every(item => selectedItems.includes(item.id))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  style={{
                    cursor: sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {column.label}
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions && (
                <th style={{ width: '120px' }}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--admin-text-muted)'
                  }}
                >
                  {searchTerm ? 'No se encontraron resultados' : 'No hay datos disponibles'}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id || index}>
                  {selectable && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {onEdit && (
                          <button
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            onClick={() => onEdit(item)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                        )}
                        {onDuplicate && (
                          <button
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            onClick={() => onDuplicate(item)}
                            title="Duplicar"
                          >
                            📋
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className="admin-btn admin-btn-sm admin-btn-danger"
                            onClick={() => onDelete(item)}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--admin-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
            Página {currentPage} de {totalPages}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="admin-btn admin-btn-sm admin-btn-secondary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`admin-btn admin-btn-sm ${
                  page === currentPage ? 'admin-btn-primary' : 'admin-btn-secondary'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="admin-btn admin-btn-sm admin-btn-secondary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
