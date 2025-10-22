// src/contexts/CatalogContext.jsx - Contexto para manejar el estado del catálogo
import React, { createContext, useContext, useState, useCallback } from 'react';

const CatalogContext = createContext();

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog debe ser usado dentro de CatalogProvider');
  }
  return context;
};

export const CatalogProvider = ({ children }) => {
  // Estado del catálogo que se mantiene al navegar
  const [catalogState, setCatalogState] = useState({
    currentPage: 1,
    selectedCategory: null,
    selectedCategoryId: null, // ID de la categoría seleccionada para navegación
    searchTerm: '',
    sortBy: 'nombre',
    viewMode: 'grid',
    totalPages: 1,
    totalProducts: 0,
    itemsPerPage: 24,
    lastVisitedFrom: null, // Para saber desde dónde vino el usuario
    breadcrumbPath: [] // Para mantener el breadcrumb
  });

  // Función para actualizar el estado del catálogo
  const updateCatalogState = useCallback((newState) => {
    setCatalogState(prev => ({
      ...prev,
      ...newState
    }));
  }, []);

  // Función para guardar el estado cuando se navega al detalle del producto
  const saveCatalogState = useCallback((state) => {
    setCatalogState(prev => ({
      ...prev,
      ...state,
      lastVisitedFrom: 'catalog'
    }));
  }, []);

  // Función para limpiar el estado cuando se navega fuera del catálogo
  const clearCatalogState = useCallback(() => {
    setCatalogState({
      currentPage: 1,
      selectedCategory: null,
      selectedCategoryId: null,
      searchTerm: '',
      sortBy: 'nombre',
      viewMode: 'grid',
      totalPages: 1,
      totalProducts: 0,
      itemsPerPage: 24,
      lastVisitedFrom: null,
      breadcrumbPath: []
    });
  }, []);

  // Función para restaurar el estado cuando se regresa del detalle
  const restoreCatalogState = useCallback(() => {
    return catalogState;
  }, [catalogState]);

  // Función para actualizar el breadcrumb
  const updateBreadcrumb = useCallback((path) => {
    setCatalogState(prev => ({
      ...prev,
      breadcrumbPath: path
    }));
  }, []);

  // Función para establecer la categoría seleccionada
  const setSelectedCategory = useCallback((categoryId, categoryData = null) => {
    setCatalogState(prev => ({
      ...prev,
      selectedCategoryId: categoryId,
      selectedCategory: categoryData,
      lastVisitedFrom: 'catalog'
    }));
  }, []);

  // Función para limpiar la categoría seleccionada
  const clearSelectedCategory = useCallback(() => {
    setCatalogState(prev => ({
      ...prev,
      selectedCategoryId: null,
      selectedCategory: null
    }));
  }, []);

  // Función para obtener la URL de navegación basada en la categoría seleccionada
  const getCatalogUrl = useCallback(() => {
    if (catalogState.selectedCategoryId) {
      return `/catalogo?categoria_id=${catalogState.selectedCategoryId}`;
    }
    return '/catalogo';
  }, [catalogState.selectedCategoryId]);

  const value = {
    catalogState,
    updateCatalogState,
    saveCatalogState,
    clearCatalogState,
    restoreCatalogState,
    updateBreadcrumb,
    setSelectedCategory,
    clearSelectedCategory,
    getCatalogUrl
  };

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
};

