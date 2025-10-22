// src/services/supabase.js - Configuración de Supabase
import { createClient } from '@supabase/supabase-js'

// Obtener variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar que las variables estén configuradas
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Verifica VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env')
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// =============================================================================
// FUNCIONES DE CONSULTA PARA CATEGORÍAS
// =============================================================================

export const categoriaService = {
  // Obtener todas las categorías activas (excluyendo "Sin Categoría")
  getCategorias: async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('activa', true)
        .neq('id', 1) // Excluir categoría "Sin Categoría" (ID: 1)
        .order('nombre')
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Error al obtener categorías')
    }
  },

  // Obtener categoría por ID
  getCategoria: async (id) => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .eq('activa', true)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching category:', error)
      throw new Error('Error al obtener categoría')
    }
  }
}

// =============================================================================
// FUNCIONES DE CONSULTA PARA SUBCATEGORÍAS
// =============================================================================

export const subcategoriaService = {
  // Obtener subcategorías por categoría
  getSubcategoriasByCategoria: async (categoriaId) => {
    try {
      const { data, error } = await supabase
        .from('subcategorias')
        .select('*')
        .eq('categoria_id', categoriaId)
        .eq('activa', true)
        .order('nombre')
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      throw new Error('Error al obtener subcategorías')
    }
  }
}

// =============================================================================
// FUNCIONES DE CONSULTA PARA PRODUCTOS
// =============================================================================

export const productoService = {
  // Obtener todos los productos con paginación
  getProductos: async (page = 1, limit = 50, categoriaId = null) => {
    try {
      let query = supabase
        .from('productos')
        .select(`
          *,
          categorias (
            id,
            nombre
          )
        `, { count: 'exact' })
        .eq('activo', true)
        .order('nombre')
        .range((page - 1) * limit, page * limit - 1)

      if (categoriaId) {
        query = query.eq('categoria_id', categoriaId)
      }

      const { data, error, count } = await query

      if (error) throw error

      // Agregar categoria_nombre para compatibilidad
      if (data) {
        data.forEach(product => {
          if (product.categorias) {
            product.categoria_nombre = product.categorias.nombre;
          }
        });
      }

      return {
        data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      throw new Error('Error al obtener productos')
    }
  },

  // Obtener productos por categoría
  getProductosByCategoria: async (categoriaId, page = 1, limit = 50) => {
    try {
      const { data, error, count } = await supabase
        .from('productos')
        .select(`
          *,
          categorias (
            id,
            nombre
          )
        `, { count: 'exact' })
        .eq('categoria_id', categoriaId)
        .eq('activo', true)
        .order('nombre')
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      // Agregar categoria_nombre para compatibilidad
      if (data) {
        data.forEach(product => {
          if (product.categorias) {
            product.categoria_nombre = product.categorias.nombre;
          }
        });
      }

      return {
        data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw new Error('Error al obtener productos por categoría')
    }
  },

  // Obtener producto por ID
  getProducto: async (id) => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          categorias (
            id,
            nombre
          )
        `)
        .eq('id', id)
        .eq('activo', true)
        .single()
      
      if (error) throw error
      
      // Agregar categoria_nombre para compatibilidad
      if (data && data.categorias) {
        data.categoria_nombre = data.categorias.nombre;
      }
      
      return data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw new Error('Error al obtener producto')
    }
  },

  // Buscar productos por texto
  buscarProductos: async (searchTerm, page = 1, limit = 50) => {
    try {
      const { data, error, count } = await supabase
        .from('productos')
        .select('*', { count: 'exact' })
        .or(`nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%,codigo.ilike.%${searchTerm}%`)
        .eq('activo', true)
        .order('nombre')
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      return {
        data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    } catch (error) {
      console.error('Error searching products:', error)
      throw new Error('Error al buscar productos')
    }
  },

  // Obtener productos destacados
  getProductosDestacados: async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .eq('destacado', true)
        .order('nombre')
        .limit(limit)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw new Error('Error al obtener productos destacados')
    }
  },

  // Obtener TODOS los productos de una categoría (para random en frontend)
  getProductosSimilares: async (categoriaId, excludeId, limit = 3) => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          categorias (
            id,
            nombre
          )
        `)
        .eq('activo', true)
        .eq('categoria_id', categoriaId)
        .neq('id', excludeId)

      if (error) throw error

      // Agregar categoria_nombre para compatibilidad
      if (data) {
        data.forEach(product => {
          if (product.categorias) {
            product.categoria_nombre = product.categorias.nombre;
          }
        });
      }

      // Hacer random en el frontend - algoritmo Fisher-Yates
      const shuffled = [...data];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      const result = shuffled.slice(0, limit);
      console.log(`🎲 Productos similares aleatorios para categoría ${categoriaId}:`, result.map(p => p.nombre));
      return result;
    } catch (error) {
      console.error('Error fetching similar products:', error)
      throw new Error('Error al obtener productos similares')
    }
  }
}

// =============================================================================
// FUNCIONES DE ESTADÍSTICAS
// =============================================================================

export const estadisticasService = {
  // Obtener estadísticas de categorías
  getEstadisticasCategorias: async () => {
    try {
      const { data, error } = await supabase
        .from('estadisticas_categorias')
        .select('*')
        .order('total_productos', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching category statistics:', error)
      throw new Error('Error al obtener estadísticas de categorías')
    }
  }
}

// =============================================================================
// FUNCIONES DE AUTENTICACIÓN (Para futuro panel admin)
// =============================================================================

export const authService = {
  // Iniciar sesión
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error signing in:', error)
      throw new Error('Error al iniciar sesión')
    }
  },

  // Cerrar sesión
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw new Error('Error al cerrar sesión')
    }
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }
}

// Exportar por defecto
export default supabase
