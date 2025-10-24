// src/features/admin/services/adminService.js - Servicios específicos del panel admin
import { supabase } from '../../../services/supabase';

// =============================================================================
// SERVICIOS DE PRODUCTOS PARA ADMIN
// =============================================================================

export const adminProductService = {
  // Obtener todos los productos con información completa
  getAllProducts: async (filters = {}) => {
    try {
      // Consulta básica primero
      let query = supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros básicos
      if (filters.categoria_id) {
        query = query.eq('categoria_id', filters.categoria_id);
      }
      if (filters.activo !== '' && filters.activo !== undefined) {
        query = query.eq('activo', filters.activo === 'true');
      }
      if (filters.precio_min) {
        query = query.gte('precio_unitario', parseFloat(filters.precio_min));
      }
      if (filters.precio_max) {
        query = query.lte('precio_unitario', parseFloat(filters.precio_max));
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error en consulta de productos:', error);
        throw error;
      }
      
      console.log('Productos obtenidos:', data?.length || 0);
      
      // Aplicar filtros adicionales en el cliente
      let filteredData = data || [];
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter(product => 
          product.nombre?.toLowerCase().includes(searchTerm) ||
          product.descripcion?.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.fecha_desde) {
        filteredData = filteredData.filter(product => 
          new Date(product.created_at) >= new Date(filters.fecha_desde)
        );
      }
      
      if (filters.fecha_hasta) {
        filteredData = filteredData.filter(product => 
          new Date(product.created_at) <= new Date(filters.fecha_hasta)
        );
      }
      
      if (filters.sin_imagen) {
        filteredData = filteredData.filter(product => 
          !product.imagen_url || product.imagen_url === ''
        );
      }
      
      // Cargar categorías por separado para evitar problemas de join
      if (filteredData.length > 0) {
        const categoriaIds = [...new Set(filteredData.map(p => p.categoria_id).filter(Boolean))];
        if (categoriaIds.length > 0) {
          const { data: categorias } = await supabase
            .from('categorias')
            .select('id, nombre')
            .in('id', categoriaIds);
          
          // Mapear categorías a productos
          filteredData = filteredData.map(product => ({
            ...product,
            categoria: categorias?.find(cat => cat.id === product.categoria_id) || null
          }));
        }
      }
      
      return filteredData;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      // Devolver array vacío en caso de error para evitar crashes
      return [];
    }
  },

  // Obtener un producto por ID
  getProductById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          categoria:categorias(nombre)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw new Error('Error al cargar producto');
    }
  },

  // Crear nuevo producto
  createProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw new Error('Error al crear producto');
    }
  },

  // Actualizar producto
  updateProduct: async (id, productData) => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw new Error('Error al actualizar producto');
    }
  },

  // Eliminar producto
  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw new Error('Error al eliminar producto');
    }
  },

  // Duplicar producto
  duplicateProduct: async (id) => {
    try {
      const originalProduct = await adminProductService.getProductById(id);
      const duplicatedData = {
        ...originalProduct,
        id: undefined,
        nombre: `${originalProduct.nombre} (Copia)`,
        created_at: undefined,
        updated_at: undefined
      };

      return await adminProductService.createProduct(duplicatedData);
    } catch (error) {
      console.error('Error al duplicar producto:', error);
      throw new Error('Error al duplicar producto');
    }
  }
};

// =============================================================================
// SERVICIOS DE CATEGORÍAS PARA ADMIN
// =============================================================================

export const adminCategoryService = {
  // Obtener todas las categorías
  getAllCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select(`
          *,
          productos(count)
        `)
        .order('nombre');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw new Error('Error al cargar categorías');
    }
  },

  // Crear nueva categoría
  createCategory: async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw new Error('Error al crear categoría');
    }
  },

  // Actualizar categoría
  updateCategory: async (id, categoryData) => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw new Error('Error al actualizar categoría');
    }
  },

  // Eliminar categoría
  deleteCategory: async (id) => {
    try {
      // Verificar si hay productos asociados
      const { data: products, error: productsError } = await supabase
        .from('productos')
        .select('id')
        .eq('categoria_id', id)
        .limit(1);

      if (productsError) throw productsError;

      if (products && products.length > 0) {
        throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
      }

      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw new Error(error.message || 'Error al eliminar categoría');
    }
  }
};

// =============================================================================
// SERVICIOS DE IMÁGENES
// =============================================================================

export const adminImageService = {
  // Subir imagen a Supabase Storage
  uploadImage: async (file, productId, imageNumber) => {
    try {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Solo se permiten archivos de imagen');
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('El archivo no puede ser mayor a 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `producto_${productId}_${imageNumber}_${Date.now()}.${fileExt}`;
      const filePath = `productos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('productos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase storage error:', error);
        throw new Error(`Error al subir imagen: ${error.message}`);
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('productos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw new Error(error.message || 'Error al subir imagen');
    }
  },

  // Eliminar imagen
  deleteImage: async (imageUrl) => {
    try {
      if (!imageUrl) return true;

      // Extraer el path del archivo de la URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `productos/${fileName}`;

      const { error } = await supabase.storage
        .from('productos')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting from storage:', error);
        // No lanzar error si la imagen no existe
        if (error.message.includes('not found')) {
          return true;
        }
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw new Error('Error al eliminar imagen');
    }
  },

  // Comprimir imagen antes de subir
  compressImage: async (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
};

// =============================================================================
// SERVICIOS DE ESTADÍSTICAS
// =============================================================================

export const adminStatsService = {
  // Obtener estadísticas generales
  getGeneralStats: async () => {
    try {
      const [
        { data: products, error: productsError },
        { data: categories, error: categoriesError },
        { data: productsWithoutImage, error: noImageError }
      ] = await Promise.all([
        supabase.from('productos').select('id', { count: 'exact' }),
        supabase.from('categorias').select('id', { count: 'exact' }),
        supabase
          .from('productos')
          .select('id', { count: 'exact' })
          .is('imagen_url', null)
      ]);

      if (productsError) throw productsError;
      if (categoriesError) throw categoriesError;
      if (noImageError) throw noImageError;

      return {
        totalProducts: products.length,
        totalCategories: categories.length,
        productsWithoutImage: productsWithoutImage.length,
        productsWithImage: products.length - productsWithoutImage.length
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error('Error al cargar estadísticas');
    }
  },

  // Obtener productos recientes
  getRecentProducts: async (limit = 5) => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, precio_unitario, created_at, categoria_id')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error en consulta de productos recientes:', error);
        throw error;
      }
      
      console.log('Productos recientes obtenidos:', data?.length || 0);
      
      // Cargar categorías por separado si hay productos
      if (data && data.length > 0) {
        const categoriaIds = [...new Set(data.map(p => p.categoria_id).filter(Boolean))];
        if (categoriaIds.length > 0) {
          const { data: categorias } = await supabase
            .from('categorias')
            .select('id, nombre')
            .in('id', categoriaIds);
          
          // Mapear categorías a productos
          return data.map(product => ({
            ...product,
            categoria: categorias?.find(cat => cat.id === product.categoria_id) || null
          }));
        }
      }
      
      return data || [];
    } catch (error) {
      console.error('Error al obtener productos recientes:', error);
      // Devolver array vacío en caso de error para evitar crashes
      return [];
    }
  }
};

// =============================================================================
// SERVICIOS DE EXPORTACIÓN
// =============================================================================

export const adminExportService = {
  // Exportar productos a CSV
  exportProductsToCSV: async (productIds = []) => {
    try {
      let query = supabase
        .from('productos')
        .select(`
          id,
          nombre,
          descripcion,
          precio_unitario,
          categoria:categorias(nombre),
          imagen_url,
          imagen_url_2,
          imagen_url_3,
          imagen_url_4,
          imagen_url_5
        `);

      if (productIds.length > 0) {
        query = query.in('id', productIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Convertir a CSV
      const headers = [
        'ID',
        'Nombre',
        'Descripción',
        'Precio',
        'Categoría',
        'Imagen 1',
        'Imagen 2',
        'Imagen 3',
        'Imagen 4',
        'Imagen 5'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(product => [
          product.id,
          `"${product.nombre}"`,
          `"${product.descripcion || ''}"`,
          product.precio_unitario,
          `"${product.categoria?.nombre || ''}"`,
          `"${product.imagen_url || ''}"`,
          `"${product.imagen_url_2 || ''}"`,
          `"${product.imagen_url_3 || ''}"`,
          `"${product.imagen_url_4 || ''}"`,
          `"${product.imagen_url_5 || ''}"`
        ].join(','))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error al exportar productos:', error);
      throw new Error('Error al exportar productos');
    }
  },

  // Obtener métricas avanzadas para el dashboard
  getAdvancedMetrics: async (timeRange = '7d') => {
    try {
      const now = new Date();
      const startDate = getStartDate(timeRange, now);
      
      const [productos, categorias, logs] = await Promise.all([
        supabase.from('productos').select('*'),
        supabase.from('categorias').select('*'),
        supabase.from('admin_logs').select('*').gte('created_at', startDate.toISOString())
      ]);

      const productosData = productos.data || [];
      const categoriasData = categorias.data || [];
      const logsData = logs.data || [];

      // Calcular métricas básicas
      const totalProducts = productosData.length;
      const totalCategories = categoriasData.length;
      const activeProducts = productosData.filter(p => p.activo).length;
      const activeCategories = categoriasData.filter(c => c.activo).length;
      const productsWithImages = productosData.filter(p => p.imagen_url).length;

      // Calcular valor total del inventario
      const totalInventoryValue = productosData.reduce((sum, p) => sum + (p.precio_unitario * (p.stock || 0)), 0);

      // Calcular productos por categoría
      const productsByCategory = categoriasData.map(cat => ({
        name: cat.nombre,
        value: productosData.filter(p => p.categoria_id === cat.id).length
      })).filter(item => item.value > 0);

      // Calcular distribución de precios
      const priceDistribution = calculatePriceDistribution(productosData);

      // Calcular actividad temporal (últimos 7 días)
      const activityOverTime = calculateActivityOverTime(logsData, 7);

      // Calcular tendencias de crecimiento
      const growthTrends = calculateGrowthTrends(productosData, categoriasData, timeRange);

      // Calcular métricas de tendencia
      const previousPeriod = getPreviousPeriod(timeRange, now);
      const previousProducts = await getPreviousPeriodData('productos', previousPeriod);
      const previousCategories = await getPreviousPeriodData('categorias', previousPeriod);

      const productsTrend = calculateTrend(totalProducts, previousProducts.length);
      const categoriesTrend = calculateTrend(totalCategories, previousCategories.length);

      return {
        totalProducts,
        totalCategories,
        totalInventoryValue,
        activeProducts,
        activeCategories,
        productsWithImages,
        recentActivity: logsData.length,
        
        // Porcentajes
        activeProductsPercentage: totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0,
        activeCategoriesPercentage: totalCategories > 0 ? Math.round((activeCategories / totalCategories) * 100) : 0,
        productsWithImagesPercentage: totalProducts > 0 ? Math.round((productsWithImages / totalProducts) * 100) : 0,
        
        // Tendencias
        productsTrend,
        categoriesTrend,
        inventoryTrend: 0, // Placeholder
        activityTrend: 0, // Placeholder
        
        // Nuevos elementos en este período
        newProductsThisPeriod: productosData.filter(p => new Date(p.created_at) >= startDate).length,
        newCategoriesThisPeriod: categoriasData.filter(c => new Date(c.created_at) >= startDate).length,
        
        // Promedios
        averagePrice: totalProducts > 0 ? totalInventoryValue / totalProducts : 0,
        averagePriceChange: 0, // Placeholder
        
        // Datos para gráficos
        productsByCategory,
        priceDistribution,
        activityOverTime,
        growthTrends
      };
    } catch (error) {
      console.error('Error obteniendo métricas avanzadas:', error);
      throw error;
    }
  }
};

// Funciones auxiliares para métricas
const getStartDate = (timeRange, now) => {
  const start = new Date(now);
  switch (timeRange) {
    case '7d':
      start.setDate(start.getDate() - 7);
      break;
    case '30d':
      start.setDate(start.getDate() - 30);
      break;
    case '90d':
      start.setDate(start.getDate() - 90);
      break;
    case '1y':
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      start.setDate(start.getDate() - 7);
  }
  return start;
};

const getPreviousPeriod = (timeRange, now) => {
  const start = new Date(now);
  const end = new Date(now);
  
  switch (timeRange) {
    case '7d':
      start.setDate(start.getDate() - 14);
      end.setDate(end.getDate() - 7);
      break;
    case '30d':
      start.setDate(start.getDate() - 60);
      end.setDate(end.getDate() - 30);
      break;
    case '90d':
      start.setDate(start.getDate() - 180);
      end.setDate(end.getDate() - 90);
      break;
    case '1y':
      start.setFullYear(start.getFullYear() - 2);
      end.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setDate(start.getDate() - 14);
      end.setDate(end.getDate() - 7);
  }
  
  return { start, end };
};

const getPreviousPeriodData = async (table, period) => {
  try {
    const { data } = await supabase
      .from(table)
      .select('*')
      .gte('created_at', period.start.toISOString())
      .lte('created_at', period.end.toISOString());
    return data || [];
  } catch (error) {
    console.error(`Error obteniendo datos previos de ${table}:`, error);
    return [];
  }
};

const calculateTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const calculatePriceDistribution = (productos) => {
  const ranges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '100-500', min: 100, max: 500 },
    { range: '500-1000', min: 500, max: 1000 },
    { range: '1000-5000', min: 1000, max: 5000 },
    { range: '5000+', min: 5000, max: Infinity }
  ];

  return ranges.map(range => ({
    range: range.range,
    count: productos.filter(p => p.precio_unitario >= range.min && p.precio_unitario < range.max).length
  }));
};

const calculateActivityOverTime = (logs, days) => {
  const result = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayLogs = logs.filter(log => 
      log.created_at.startsWith(dateStr)
    );
    
    result.push({
      date: date.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' }),
      products: dayLogs.filter(log => log.resource === 'productos').length,
      categories: dayLogs.filter(log => log.resource === 'categorias').length
    });
  }
  
  return result;
};

const calculateGrowthTrends = (productos, categorias, timeRange) => {
  const periods = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const result = [];
  
  for (let i = periods - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const productsCount = productos.filter(p => 
      new Date(p.created_at) <= date
    ).length;
    
    const categoriesCount = categorias.filter(c => 
      new Date(c.created_at) <= date
    ).length;
    
    result.push({
      period: date.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' }),
      products: productsCount,
      categories: categoriesCount
    });
  }
  
  return result;
};

// =============================================================================
// IMPORTACIÓN MASIVA
// =============================================================================

export const adminImportService = {
  // Procesar archivo CSV/Excel para importación
  async processImportFile(file) {
    try {
      // Simular procesamiento de archivo
      // En una implementación real, aquí se procesaría el CSV/Excel
      const mockData = [
        {
          nombre: 'Producto Importado 1',
          descripcion: 'Descripción del producto importado',
          precio_unitario: 199.99,
          categoria: 'Categoría Importada',
          stock: 50,
          imagen_url_1: '',
          imagen_url_2: '',
          imagen_url_3: '',
          imagen_url_4: '',
          imagen_url_5: '',
          activo: true
        },
        {
          nombre: 'Producto Importado 2',
          descripcion: 'Segundo producto importado',
          precio_unitario: 299.99,
          categoria: 'Categoría Importada',
          stock: 25,
          imagen_url_1: '',
          imagen_url_2: '',
          imagen_url_3: '',
          imagen_url_4: '',
          imagen_url_5: '',
          activo: true
        }
      ];

      return {
        success: true,
        data: mockData
      };
    } catch (error) {
      console.error('Error procesando archivo:', error);
      return {
        success: false,
        message: error.message || 'Error al procesar el archivo'
      };
    }
  },

  // Crear productos masivamente
  async bulkCreateProducts(products) {
    try {
      const results = {
        successful: 0,
        errors: []
      };

      for (let i = 0; i < products.length; i++) {
        try {
          const product = products[i];
          
          // Validar datos requeridos
          if (!product.nombre || !product.precio_unitario || !product.categoria) {
            results.errors.push({
              row: i + 1,
              message: 'Faltan datos requeridos (nombre, precio_unitario, categoría)'
            });
            continue;
          }

          // Buscar o crear categoría
          let categoriaId;
          const { data: existingCategory } = await supabase
            .from('categorias')
            .select('id')
            .eq('nombre', product.categoria)
            .single();

          if (existingCategory) {
            categoriaId = existingCategory.id;
          } else {
            // Crear nueva categoría
            const { data: newCategory, error: categoryError } = await supabase
              .from('categorias')
              .insert({
                nombre: product.categoria,
                descripcion: `Categoría creada automáticamente para ${product.categoria}`,
                activo: true
              })
              .select()
              .single();

            if (categoryError) throw categoryError;
            categoriaId = newCategory.id;
          }

          // Crear producto
          const { error: productError } = await supabase
            .from('productos')
            .insert({
              nombre: product.nombre,
              descripcion: product.descripcion || '',
              precio_unitario: parseFloat(product.precio_unitario),
              stock: parseInt(product.stock) || 0,
              categoria_id: categoriaId,
              imagen_url_1: product.imagen_url_1 || '',
              imagen_url_2: product.imagen_url_2 || '',
              imagen_url_3: product.imagen_url_3 || '',
              imagen_url_4: product.imagen_url_4 || '',
              imagen_url_5: product.imagen_url_5 || '',
              activo: product.activo !== false
            });

          if (productError) {
            results.errors.push({
              row: i + 1,
              message: productError.message
            });
          } else {
            results.successful++;
          }
        } catch (error) {
          results.errors.push({
            row: i + 1,
            message: error.message || 'Error desconocido'
          });
        }
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Error creando productos masivamente:', error);
      return {
        success: false,
        message: error.message || 'Error al crear productos'
      };
    }
  }
};

// =============================================================================
// LOGS DE ACTIVIDAD
// =============================================================================

export const adminLogService = {
  // Crear un nuevo log de actividad
  async createLog(logData) {
    try {
      const { error } = await supabase
        .from('admin_logs')
        .insert({
          user_id: logData.userId,
          user_email: logData.userEmail,
          action: logData.action,
          resource: logData.resource,
          resource_id: logData.resourceId,
          description: logData.description,
          severity: logData.severity || 'info',
          ip_address: logData.ipAddress,
          user_agent: logData.userAgent,
          metadata: logData.metadata || {}
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error creando log:', error);
      return { success: false, message: error.message };
    }
  },

  // Obtener logs con filtros y paginación
  async getLogs(filters = {}) {
    try {
      let query = supabase
        .from('admin_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%,resource.ilike.%${filters.search}%`);
      }

      if (filters.action) {
        query = query.eq('action', filters.action);
      }

      if (filters.user) {
        query = query.ilike('user_email', `%${filters.user}%`);
      }

      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      // Paginación
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: {
          logs: data || [],
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          totalItems: count
        }
      };
    } catch (error) {
      console.error('Error obteniendo logs:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Eliminar logs seleccionados
  async deleteLogs(logIds) {
    try {
      const { error } = await supabase
        .from('admin_logs')
        .delete()
        .in('id', logIds);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error eliminando logs:', error);
      return { success: false, message: error.message };
    }
  },

  // Exportar logs a CSV
  async exportLogs(filters = {}) {
    try {
      let query = supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%,resource.ilike.%${filters.search}%`);
      }

      if (filters.action) {
        query = query.eq('action', filters.action);
      }

      if (filters.user) {
        query = query.ilike('user_email', `%${filters.user}%`);
      }

      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      if (filters.selectedIds) {
        query = query.in('id', filters.selectedIds);
      }

      // Limitar a 10000 registros para exportación
      query = query.limit(10000);

      const { data, error } = await query;

      if (error) throw error;

      // Convertir a CSV
      const csvContent = this.convertLogsToCSV(data || []);

      return {
        success: true,
        data: csvContent
      };
    } catch (error) {
      console.error('Error exportando logs:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Convertir logs a formato CSV
  convertLogsToCSV(logs) {
    if (!logs || logs.length === 0) return '';

    const headers = [
      'Fecha/Hora',
      'Usuario',
      'Acción',
      'Recurso',
      'Descripción',
      'Severidad',
      'IP',
      'User Agent'
    ];

    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        `"${new Date(log.created_at).toLocaleString()}"`,
        `"${log.user_email}"`,
        `"${log.action}"`,
        `"${log.resource}"`,
        `"${log.description}"`,
        `"${log.severity}"`,
        `"${log.ip_address || ''}"`,
        `"${log.user_agent || ''}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  },

  // Limpiar logs antiguos (más de 90 días)
  async cleanOldLogs() {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { error } = await supabase
        .from('admin_logs')
        .delete()
        .lt('created_at', ninetyDaysAgo.toISOString());

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error limpiando logs antiguos:', error);
      return { success: false, message: error.message };
    }
  }
};

// =============================================================================
// SERVICIOS DE USUARIOS
// =============================================================================

export const adminUserService = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw new Error('Error al cargar usuarios');
    }
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw new Error('Error al cargar usuario');
    }
  },

  // Crear nuevo usuario
  createUser: async (userData) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          email: userData.email,
          password: userData.password, // En producción, esto debería estar hasheado
          nombre: userData.nombre,
          apellido: userData.apellido,
          telefono: userData.telefono,
          role: userData.role || 'client',
          activo: userData.activo !== undefined ? userData.activo : true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw new Error('Error al crear usuario');
    }
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    try {
      const updateData = { ...userData };
      if (!updateData.password) {
        delete updateData.password; // No actualizar contraseña si está vacía
      }

      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw new Error('Error al actualizar usuario');
    }
  },

  // Eliminar usuario
  deleteUser: async (id) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw new Error('Error al eliminar usuario');
    }
  },

  // Resetear contraseña
  resetPassword: async (id) => {
    try {
      // Generar contraseña temporal
      const tempPassword = Math.random().toString(36).slice(-8);
      
      const { data, error } = await supabase
        .from('usuarios')
        .update({ password: tempPassword })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // En producción, aquí se enviaría un email con la nueva contraseña
      console.log(`Nueva contraseña para usuario ${id}: ${tempPassword}`);
      
      return { success: true, tempPassword };
    } catch (error) {
      console.error('Error reseteando contraseña:', error);
      throw new Error('Error al resetear contraseña');
    }
  },

  // Obtener estadísticas de usuarios
  getUserStats: async () => {
    try {
      const { data: users, error } = await supabase
        .from('usuarios')
        .select('role, activo, created_at');

      if (error) throw error;

      const stats = {
        total: users.length,
        active: users.filter(u => u.activo).length,
        inactive: users.filter(u => !u.activo).length,
        byRole: {
          admin: users.filter(u => u.role === 'admin').length,
          editor: users.filter(u => u.role === 'editor').length,
          viewer: users.filter(u => u.role === 'viewer').length,
          client: users.filter(u => u.role === 'client').length
        },
        newThisMonth: users.filter(u => {
          const created = new Date(u.created_at);
          const now = new Date();
          return created.getMonth() === now.getMonth() && 
                 created.getFullYear() === now.getFullYear();
        }).length
      };

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas de usuarios:', error);
      throw new Error('Error al cargar estadísticas de usuarios');
    }
  }
};

// =============================================================================
// SERVICIOS DE CONFIGURACIÓN
// =============================================================================

export const adminConfigService = {
  // Obtener configuración actual
  getConfiguration: async () => {
    try {
      const { data, error } = await supabase
        .from('store_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      // Si no existe configuración, devolver valores por defecto
      if (!data) {
        return {
          store_name: 'Mi Tienda',
          store_tagline: '',
          store_description: '',
          currency: 'ARS',
          timezone: 'America/Argentina/Buenos_Aires',
          logo_url: '',
          favicon_url: '',
          primary_color: '#3B82F6',
          secondary_color: '#10B981',
          contact_email: '',
          contact_phone: '',
          whatsapp: '',
          address: '',
          social_facebook: '',
          social_instagram: '',
          social_twitter: '',
          social_linkedin: '',
          social_youtube: '',
          seo_title: '',
          seo_description: '',
          seo_keywords: '',
          maintenance_mode: false,
          analytics_enabled: false,
          google_analytics_id: '',
          custom_head_code: ''
        };
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo configuración:', error);
      throw new Error('Error al cargar configuración');
    }
  },

  // Actualizar configuración
  updateConfiguration: async (configData) => {
    try {
      // Verificar si existe configuración
      const { data: existingConfig } = await supabase
        .from('store_config')
        .select('id')
        .single();

      if (existingConfig) {
        // Actualizar configuración existente
        const { error } = await supabase
          .from('store_config')
          .update({
            ...configData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id);

        if (error) throw error;
      } else {
        // Crear nueva configuración
        const { error } = await supabase
          .from('store_config')
          .insert([{
            ...configData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      throw new Error('Error al guardar configuración');
    }
  },

  // Subir imagen de configuración
  uploadImage: async (file, type) => {
    try {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Solo se permiten archivos de imagen');
      }

      // Validar tamaño (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('El archivo no puede ser mayor a 2MB');
      }

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `store-config/${fileName}`;

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw new Error('Error al subir imagen');
    }
  },

  // Resetear configuración a valores por defecto
  resetConfiguration: async () => {
    try {
      const defaultConfig = {
        store_name: 'Mi Tienda',
        store_tagline: '',
        store_description: '',
        currency: 'ARS',
        timezone: 'America/Argentina/Buenos_Aires',
        logo_url: '',
        favicon_url: '',
        primary_color: '#3B82F6',
        secondary_color: '#10B981',
        contact_email: '',
        contact_phone: '',
        whatsapp: '',
        address: '',
        social_facebook: '',
        social_instagram: '',
        social_twitter: '',
        social_linkedin: '',
        social_youtube: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        maintenance_mode: false,
        analytics_enabled: false,
        google_analytics_id: '',
        custom_head_code: '',
        updated_at: new Date().toISOString()
      };

      // Verificar si existe configuración
      const { data: existingConfig } = await supabase
        .from('store_config')
        .select('id')
        .single();

      if (existingConfig) {
        // Actualizar configuración existente
        const { error } = await supabase
          .from('store_config')
          .update(defaultConfig)
          .eq('id', existingConfig.id);

        if (error) throw error;
      } else {
        // Crear nueva configuración
        const { error } = await supabase
          .from('store_config')
          .insert([{
            ...defaultConfig,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error reseteando configuración:', error);
      throw new Error('Error al resetear configuración');
    }
  },

  // Obtener configuración pública (para el frontend)
  getPublicConfiguration: async () => {
    try {
      const { data, error } = await supabase
        .from('store_config')
        .select(`
          store_name,
          store_tagline,
          store_description,
          currency,
          logo_url,
          favicon_url,
          primary_color,
          secondary_color,
          contact_email,
          contact_phone,
          whatsapp,
          address,
          social_facebook,
          social_instagram,
          social_twitter,
          social_linkedin,
          social_youtube,
          seo_title,
          seo_description,
          seo_keywords,
          maintenance_mode,
          analytics_enabled,
          google_analytics_id,
          custom_head_code
        `)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || {};
    } catch (error) {
      console.error('Error obteniendo configuración pública:', error);
      return {};
    }
  }
};

export default {
  adminProductService,
  adminCategoryService,
  adminImageService,
  adminStatsService,
  adminExportService,
  adminImportService,
  adminLogService,
  adminUserService,
  adminConfigService
};
