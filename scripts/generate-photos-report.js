const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
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

async function generatePhotosReport() {
  console.log('🔍 Generando reporte detallado de productos con/sin fotos...\n');
  
  try {
    // Consultar todos los productos activos con información de categorías
    const { data: productos, error } = await supabase
      .from('productos')
      .select(`
        id, 
        nombre, 
        codigo, 
        imagen_url, 
        categoria_id, 
        activo,
        categorias (
          id,
          nombre
        )
      `)
      .eq('activo', true)
      .order('id');

    if (error) {
      throw error;
    }

    if (!productos || productos.length === 0) {
      console.log('❌ No se encontraron productos en la base de datos');
      return;
    }

    // Categorizar productos
    const productosConFoto = [];
    const productosSinFoto = [];
    const productosConFotoInvalida = [];

    productos.forEach(producto => {
      const imagenUrl = producto.imagen_url;
      const categoriaNombre = producto.categorias?.nombre || 'Sin categoría';
      
      const productoInfo = {
        id: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        categoria_id: producto.categoria_id,
        categoria_nombre: categoriaNombre,
        imagen_url: imagenUrl
      };
      
      if (!imagenUrl) {
        // Sin imagen_url
        productosSinFoto.push(productoInfo);
      } else if (imagenUrl.trim() === '') {
        // imagen_url vacía
        productosSinFoto.push(productoInfo);
      } else if (imagenUrl.includes('default-product.jpg')) {
        // Imagen por defecto
        productosSinFoto.push(productoInfo);
      } else if (imagenUrl.startsWith('http') || imagenUrl.startsWith('/')) {
        // Imagen válida
        productosConFoto.push(productoInfo);
      } else {
        // URL inválida o extraña
        productosConFotoInvalida.push(productoInfo);
      }
    });

    // Análisis por categoría
    const porCategoria = {};
    
    productos.forEach(producto => {
      const categoriaId = producto.categoria_id || 'Sin categoría';
      const categoriaNombre = producto.categorias?.nombre || 'Sin categoría';
      
      if (!porCategoria[categoriaId]) {
        porCategoria[categoriaId] = {
          nombre: categoriaNombre,
          total: 0,
          conFoto: 0,
          sinFoto: 0,
          conFotoInvalida: 0,
          productos: []
        };
      }
      
      porCategoria[categoriaId].total++;
      porCategoria[categoriaId].productos.push(producto);
      
      const imagenUrl = producto.imagen_url;
      if (!imagenUrl || imagenUrl.trim() === '' || imagenUrl.includes('default-product.jpg')) {
        porCategoria[categoriaId].sinFoto++;
      } else if (imagenUrl.startsWith('http') || imagenUrl.startsWith('/')) {
        porCategoria[categoriaId].conFoto++;
      } else {
        porCategoria[categoriaId].conFotoInvalida++;
      }
    });

    // Generar contenido del reporte
    const reporte = [];
    const fecha = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    reporte.push('='.repeat(80));
    reporte.push('REPORTE DETALLADO DE PRODUCTOS CON/SIN FOTOS - ERAM');
    reporte.push('='.repeat(80));
    reporte.push(`Fecha de generación: ${fecha}`);
    reporte.push(`Generado por: Script de análisis automático`);
    reporte.push('');
    
    // Estadísticas generales
    reporte.push('📊 ESTADÍSTICAS GENERALES');
    reporte.push('-'.repeat(50));
    reporte.push(`Total de productos activos: ${productos.length}`);
    reporte.push(`Productos CON foto válida: ${productosConFoto.length} (${((productosConFoto.length / productos.length) * 100).toFixed(1)}%)`);
    reporte.push(`Productos SIN foto: ${productosSinFoto.length} (${((productosSinFoto.length / productos.length) * 100).toFixed(1)}%)`);
    reporte.push(`Productos con foto inválida: ${productosConFotoInvalida.length} (${((productosConFotoInvalida.length / productos.length) * 100).toFixed(1)}%)`);
    reporte.push('');
    
    // Resumen de impacto
    reporte.push('📈 IMPACTO DE OCULTAR PRODUCTOS SIN FOTO');
    reporte.push('-'.repeat(50));
    reporte.push(`Productos que se MOSTRARÁN en el catálogo: ${productosConFoto.length}`);
    reporte.push(`Productos que se OCULTARÁN del catálogo: ${productosSinFoto.length + productosConFotoInvalida.length}`);
    reporte.push(`Reducción del catálogo: ${((productosSinFoto.length + productosConFotoInvalida.length) / productos.length * 100).toFixed(1)}%`);
    reporte.push('');
    
    // Análisis por categoría
    reporte.push('📂 ANÁLISIS DETALLADO POR CATEGORÍA');
    reporte.push('-'.repeat(50));
    
    Object.entries(porCategoria)
      .sort(([,a], [,b]) => b.total - a.total)
      .forEach(([categoriaId, stats]) => {
        const porcentajeConFoto = ((stats.conFoto / stats.total) * 100).toFixed(1);
        const porcentajeSinFoto = ((stats.sinFoto / stats.total) * 100).toFixed(1);
        
        reporte.push(`Categoría ${categoriaId}: ${stats.nombre}`);
        reporte.push(`  Total: ${stats.total} productos`);
        reporte.push(`  Con foto: ${stats.conFoto} (${porcentajeConFoto}%)`);
        reporte.push(`  Sin foto: ${stats.sinFoto} (${porcentajeSinFoto}%)`);
        if (stats.conFotoInvalida > 0) {
          reporte.push(`  Con foto inválida: ${stats.conFotoInvalida}`);
        }
        reporte.push('');
      });
    
    // Lista completa de productos CON foto
    reporte.push('✅ LISTA COMPLETA DE PRODUCTOS CON FOTO');
    reporte.push('-'.repeat(50));
    reporte.push(`Total: ${productosConFoto.length} productos`);
    reporte.push('');
    
    productosConFoto.forEach((producto, index) => {
      reporte.push(`${index + 1}. ID: ${producto.id} | Código: ${producto.codigo}`);
      reporte.push(`   Nombre: ${producto.nombre}`);
      reporte.push(`   Categoría: ${producto.categoria_nombre} (ID: ${producto.categoria_id})`);
      reporte.push(`   Imagen: ${producto.imagen_url}`);
      reporte.push('');
    });
    
    // Lista completa de productos SIN foto
    reporte.push('❌ LISTA COMPLETA DE PRODUCTOS SIN FOTO');
    reporte.push('-'.repeat(50));
    reporte.push(`Total: ${productosSinFoto.length} productos`);
    reporte.push('');
    
    productosSinFoto.forEach((producto, index) => {
      reporte.push(`${index + 1}. ID: ${producto.id} | Código: ${producto.codigo}`);
      reporte.push(`   Nombre: ${producto.nombre}`);
      reporte.push(`   Categoría: ${producto.categoria_nombre} (ID: ${producto.categoria_id})`);
      reporte.push(`   Imagen: ${producto.imagen_url || 'null'}`);
      reporte.push('');
    });
    
    // Lista de productos con foto inválida (si los hay)
    if (productosConFotoInvalida.length > 0) {
      reporte.push('⚠️  LISTA DE PRODUCTOS CON FOTO INVÁLIDA');
      reporte.push('-'.repeat(50));
      reporte.push(`Total: ${productosConFotoInvalida.length} productos`);
      reporte.push('');
      
      productosConFotoInvalida.forEach((producto, index) => {
        reporte.push(`${index + 1}. ID: ${producto.id} | Código: ${producto.codigo}`);
        reporte.push(`   Nombre: ${producto.nombre}`);
        reporte.push(`   Categoría: ${producto.categoria_nombre} (ID: ${producto.categoria_id})`);
        reporte.push(`   Imagen: ${producto.imagen_url}`);
        reporte.push('');
      });
    }
    
    // Resumen de IDs para programadores
    reporte.push('💾 DATOS TÉCNICOS PARA DESARROLLADORES');
    reporte.push('-'.repeat(50));
    reporte.push(`IDs de productos CON foto: [${productosConFoto.map(p => p.id).join(', ')}]`);
    reporte.push(`IDs de productos SIN foto: [${productosSinFoto.map(p => p.id).join(', ')}]`);
    if (productosConFotoInvalida.length > 0) {
      reporte.push(`IDs de productos con foto inválida: [${productosConFotoInvalida.map(p => p.id).join(', ')}]`);
    }
    reporte.push('');
    
    // Footer
    reporte.push('='.repeat(80));
    reporte.push('FIN DEL REPORTE');
    reporte.push('='.repeat(80));
    
    // Escribir archivo
    const reportePath = path.join(__dirname, 'reporte-productos-fotos.txt');
    const contenidoReporte = reporte.join('\n');
    
    fs.writeFileSync(reportePath, contenidoReporte, 'utf8');
    
    console.log('✅ Reporte generado exitosamente!');
    console.log(`📄 Archivo guardado en: ${reportePath}`);
    console.log(`📊 Resumen:`);
    console.log(`   - Total productos: ${productos.length}`);
    console.log(`   - Con foto: ${productosConFoto.length} (${((productosConFoto.length / productos.length) * 100).toFixed(1)}%)`);
    console.log(`   - Sin foto: ${productosSinFoto.length} (${((productosSinFoto.length / productos.length) * 100).toFixed(1)}%)`);
    console.log(`   - Reducción del catálogo: ${((productosSinFoto.length + productosConFotoInvalida.length) / productos.length * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Error al generar reporte:', error);
  }
}

// Ejecutar el análisis
generatePhotosReport();
