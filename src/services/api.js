// src/services/api.js - Centralized API service layer
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens (Phase 2)
api.interceptors.request.use((config) => {
  // TODO Phase 2: Add auth token if available
  // const token = localStorage.getItem('eram-token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// =============================================================================
// EXISTING API CALLS (Keep current functionality)
// =============================================================================

export const productService = {
  // Get all products with pagination
  getProducts: async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/api/productos', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error fetching products');
    }
  },

  // Get products by category
  getProductsByCategory: async (categoriaId, page = 1, limit = 20) => {
    try {
      const response = await api.get('/api/productos/por-categoria', {
        params: { categoria_id: categoriaId, page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error fetching products by category');
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const response = await api.get(`/api/productos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching product details');
    }
  },
};

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/api/categorias');
      return response.data;
    } catch (error) {
      throw new Error('Error fetching categories');
    }
  },
};

// =============================================================================
// NEW API STUBS FOR PHASE 1 FEATURES (Mock implementations for now)
// =============================================================================

export const rubrosService = {
  // TODO Phase 2: Connect to real backend
  // For now, return mock data
  getRubros: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock rubros data - will be replaced with real API call
    return [
      {
        id: 1,
        nombre: 'Protección Personal',
        descripcion: 'Equipo de protección individual',
        icon: 'shield',
        categorias: [1, 2, 3, 4] // Category IDs that belong to this rubro
      },
      {
        id: 2,
        nombre: 'Trabajo en Altura',
        descripcion: 'Equipos para trabajo seguro en altura',
        icon: 'hard-hat',
        categorias: [5, 6, 7]
      },
      {
        id: 3,
        nombre: 'Protección Respiratoria',
        descripcion: 'Máscaras y filtros de protección',
        icon: 'lungs',
        categorias: [8, 9, 10]
      },
      {
        id: 4,
        nombre: 'Señalización y Demarcación',
        descripcion: 'Elementos de señalización industrial',
        icon: 'warning',
        categorias: [11, 12]
      },
    ];
  },

  // Get categories by rubro
  getCategoriesByRubro: async (rubroId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // This will be implemented when we connect to real backend
    // For now, filter existing categories based on rubro
    const allCategories = await categoryService.getCategories();
    
    // Mock filtering - in real implementation, this would come from backend
    const rubroCategories = {
      1: allCategories.filter((_, index) => index < 4),
      2: allCategories.filter((_, index) => index >= 4 && index < 7),
      3: allCategories.filter((_, index) => index >= 7 && index < 10),
      4: allCategories.filter((_, index) => index >= 10),
    };
    
    return rubroCategories[rubroId] || [];
  },
};

export const authService = {
  // TODO Phase 2: Connect to real backend authentication
  // For now, simulate login
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - replace with real API call
    if (credentials.email && credentials.password) {
      return {
        success: true,
        user: {
          id: 1,
          email: credentials.email,
          role: 'proveedor',
          name: 'Usuario Proveedor'
        },
        token: 'mock-jwt-token'
      };
    }
    
    throw new Error('Credenciales inválidas');
  },

  // Register endpoint stub
  register: async (userData) => {
    // TODO Phase 2: Implement real registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error('Registro no disponible en versión demo');
  },
};

// Default export for convenience
export default api;