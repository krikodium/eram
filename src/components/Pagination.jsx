import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage,
  loading = false 
}) => {
  // Calcular rango de páginas a mostrar
  const getVisiblePages = () => {
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      {/* Información de productos */}
      <div className="pagination-info">
        <span className="pagination-stats">
          Mostrando {startItem}-{endItem} de {totalItems} productos
        </span>
      </div>

      {/* Controles de paginación */}
      <div className="pagination-controls">
        {/* Botón anterior */}
        <button
          className={`pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          title="Página anterior"
        >
          <FaChevronLeft />
        </button>

        {/* Números de página */}
        <div className="pagination-pages">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="pagination-dots">...</span>
              ) : (
                <button
                  className={`pagination-btn page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                  title={`Ir a página ${page}`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          className={`pagination-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          title="Página siguiente"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
