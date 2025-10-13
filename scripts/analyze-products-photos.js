const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  console.log('Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeProductsPhotos() {
  console.log('🔍 Analizando productos con y sin fotos...\n');
  
  try {
    // Consultar todos los productos activos
    const { data: productos, error } = await supabase
      .from('productos')
      .select('id, nombre, codigo, imagen_url, categoria_id, activo')
      .eq('activo', true)
      .order('id');

    if (error) {
      throw error;
    }

    if (!productos || productos.length === 0) {
      console.log('❌ No se encontraron productos en la base de datos');
      return;
    }

    console.log(`📊 Total de productos activos: ${productos.length}\n`);

    // Categorizar productos
    const productosConFoto = [];
    const productosSinFoto = [];
    const productosConFotoInvalida = [];

    productos.forEach(producto => {
      const imagenUrl = producto.imagen_url;
      
      if (!imagenUrl) {
        // Sin imagen_url
        productosSinFoto.push(producto);
      } else if (imagenUrl.trim() === '') {
        // imagen_url vacía
        productosSinFoto.push(producto);
      } else if (imagenUrl.includes('default-product.jpg')) {
        // Imagen por defecto
        productosSinFoto.push(producto);
      } else if (imagenUrl.startsWith('http') || imagenUrl.startsWith('/')) {
        // Imagen válida
        productosConFoto.push(producto);
      } else {
        // URL inválida o extraña
        productosConFotoInvalida.push(producto);
      }
    });

    // Estadísticas generales
    console.log('📈 ESTADÍSTICAS GENERALES:');
    console.log('=' .repeat(50));
    console.log(`✅ Productos CON foto válida: ${productosConFoto.length} (${((productosConFoto.length / productos.length) * 100).toFixed(1)}%)`);
    console.log(`❌ Productos SIN foto: ${productosSinFoto.length} (${((productosSinFoto.length / productos.length) * 100).toFixed(1)}%)`);
    console.log(`⚠️  Productos con foto inválida: ${productosConFotoInvalida.length} (${((productosConFotoInvalida.length / productos.length) * 100).toFixed(1)}%)`);
    console.log('');

    // Análisis por categoría
    console.log('📂 ANÁLISIS POR CATEGORÍA:');
    console.log('=' .repeat(50));
    
    // Agrupar por categoría
    const porCategoria = {};
    
    productos.forEach(producto => {
      const categoriaId = producto.categoria_id || 'Sin categoría';
      if (!porCategoria[categoriaId]) {
        porCategoria[categoriaId] = {
          total: 0,
          conFoto: 0,
          sinFoto: 0,
          conFotoInvalida: 0
        };
      }
      
      porCategoria[categoriaId].total++;
      
      const imagenUrl = producto.imagen_url;
      if (!imagenUrl || imagenUrl.trim() === '' || imagenUrl.includes('default-product.jpg')) {
        porCategoria[categoriaId].sinFoto++;
      } else if (imagenUrl.startsWith('http') || imagenUrl.startsWith('/')) {
        porCategoria[categoriaId].conFoto++;
      } else {
        porCategoria[categoriaId].conFotoInvalida++;
      }
    });

    // Mostrar estadísticas por categoría
    Object.entries(porCategoria).forEach(([categoriaId, stats]) => {
      const porcentajeConFoto = ((stats.conFoto / stats.total) * 100).toFixed(1);
      console.log(`Categoría ${categoriaId}:`);
      console.log(`  Total: ${stats.total} | Con foto: ${stats.conFoto} (${porcentajeConFoto}%) | Sin foto: ${stats.sinFoto}`);
      if (stats.conFotoInvalida > 0) {
        console.log(`  ⚠️  Con foto inválida: ${stats.conFotoInvalida}`);
      }
      console.log('');
    });

    // Mostrar algunos ejemplos de productos sin foto
    if (productosSinFoto.length > 0) {
      console.log('🔍 EJEMPLOS DE PRODUCTOS SIN FOTO (primeros 10):');
      console.log('=' .repeat(50));
      productosSinFoto.slice(0, 10).forEach((producto, index) => {
        console.log(`${index + 1}. ID: ${producto.id} | Código: ${producto.codigo} | Nombre: ${producto.nombre}`);
        console.log(`   imagen_url: "${producto.imagen_url || 'null'}"`);
        console.log('');
      });
      
      if (productosSinFoto.length > 10) {
        console.log(`... y ${productosSinFoto.length - 10} productos más sin foto`);
      }
    }

    // Mostrar algunos ejemplos de productos con foto inválida
    if (productosConFotoInvalida.length > 0) {
      console.log('⚠️  EJEMPLOS DE PRODUCTOS CON FOTO INVÁLIDA (primeros 5):');
      console.log('=' .repeat(50));
      productosConFotoInvalida.slice(0, 5).forEach((producto, index) => {
        console.log(`${index + 1}. ID: ${producto.id} | Código: ${producto.codigo} | Nombre: ${producto.nombre}`);
        console.log(`   imagen_url: "${producto.imagen_url}"`);
        console.log('');
      });
    }

    // Resumen final
    console.log('📋 RESUMEN FINAL:');
    console.log('=' .repeat(50));
    console.log(`Si ocultamos productos sin foto en el catálogo:`);
    console.log(`- Productos que se MOSTRARÁN: ${productosConFoto.length}`);
    console.log(`- Productos que se OCULTARÁN: ${productosSinFoto.length + productosConFotoInvalida.length}`);
    console.log(`- Reducción del catálogo: ${((productosSinFoto.length + productosConFotoInvalida.length) / productos.length * 100).toFixed(1)}%`);
    console.log('');

    // Guardar IDs de productos sin foto para referencia
    const idsSinFoto = productosSinFoto.map(p => p.id);
    const idsConFotoInvalida = productosConFotoInvalida.map(p => p.id);
    
    console.log('💾 DATOS PARA REFERENCIA:');
    console.log(`- IDs de productos sin foto: [${idsSinFoto.slice(0, 10).join(', ')}${idsSinFoto.length > 10 ? '...' : ''}]`);
    console.log(`- IDs de productos con foto inválida: [${idsConFotoInvalida.slice(0, 10).join(', ')}${idsConFotoInvalida.length > 10 ? '...' : ''}]`);

  } catch (error) {
    console.error('❌ Error al analizar productos:', error);
  }
}

// Ejecutar el análisis
analyzeProductsPhotos();
