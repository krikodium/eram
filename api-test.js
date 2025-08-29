#!/usr/bin/env node

/**
 * API Testing Script for ERAM Frontend
 * 
 * Este script verifica la conectividad y funcionalidad de la API del backend
 * 
 * Uso:
 * 1. Asegúrate de que tu archivo .env tenga VITE_API_URL configurado
 * 2. Ejecuta: node api-test.js
 * 3. O si tienes npm: npm run test:api
 */

import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar dotenv para cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Función para imprimir con colores
const log = (color, message) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Función para imprimir separadores
const separator = () => {
  log(colors.cyan, '='.repeat(80));
};

// Función para imprimir headers
const header = (title) => {
  separator();
  log(colors.bright + colors.blue, `🚀 ${title}`);
  separator();
};

// Función para imprimir resultados
const result = (success, message, data = null) => {
  const icon = success ? '✅' : '❌';
  const color = success ? colors.green : colors.red;
  
  log(color, `${icon} ${message}`);
  
  if (data && !success) {
    log(colors.yellow, `   Detalles: ${JSON.stringify(data, null, 2)}`);
  }
};

// Función para imprimir información
const info = (message) => {
  log(colors.white, `ℹ️  ${message}`);
};

// Función para imprimir warning
const warning = (message) => {
  log(colors.yellow, `⚠️  ${message}`);
};

// Función para imprimir error
const error = (message) => {
  log(colors.red, `💥 ${message}`);
};

// Configuración de la API
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';
const TIMEOUT = 10000;

// Crear instancia de axios para testing
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'ERAM-API-Test/1.0.0'
  }
});

// Función para test de conectividad básica
const testBasicConnectivity = async () => {
  header('TEST DE CONECTIVIDAD BÁSICA');
  
  try {
    info(`Probando conexión a: ${API_BASE_URL}`);
    
    const response = await api.get('/');
    result(true, `Conexión exitosa - Status: ${response.status}`);
    
    if (response.data) {
      info(`Respuesta del servidor: ${JSON.stringify(response.data, null, 2)}`);
    }
    
    return true;
  } catch (err) {
    result(false, `Error de conectividad: ${err.message}`);
    
    if (err.code === 'ECONNREFUSED') {
      warning('El servidor parece estar apagado o no accesible');
      warning('Verifica que el backend esté ejecutándose');
    } else if (err.code === 'ENOTFOUND') {
      warning('No se puede resolver la URL del servidor');
      warning('Verifica que VITE_API_URL sea correcta en tu .env');
    }
    
    return false;
  }
};

// Función para test de endpoints de productos
const testProductEndpoints = async () => {
  header('TEST DE ENDPOINTS DE PRODUCTOS');
  
  const tests = [
    {
      name: 'GET /api/productos',
      endpoint: '/api/productos',
      method: 'get',
      params: { page: 1, limit: 5 }
    },
    {
      name: 'GET /api/productos (sin parámetros)',
      endpoint: '/api/productos',
      method: 'get'
    },
    {
      name: 'GET /api/productos con paginación',
      endpoint: '/api/productos',
      method: 'get',
      params: { page: 2, limit: 10 }
    }
  ];
  
  let successCount = 0;
  
  for (const test of tests) {
    try {
      info(`Probando: ${test.name}`);
      
      const config = test.params ? { params: test.params } : {};
      const response = await api[test.method](test.endpoint, config);
      
      result(true, `${test.name} - Status: ${response.status}`);
      
      if (response.data) {
        const data = response.data;
        info(`   Total de productos: ${data.total || 'N/A'}`);
        info(`   Página actual: ${data.page || 'N/A'}`);
        info(`   Productos en respuesta: ${Array.isArray(data.productos) ? data.productos.length : 'N/A'}`);
        
        if (Array.isArray(data.productos) && data.productos.length > 0) {
          const firstProduct = data.productos[0];
          info(`   Primer producto: ${firstProduct.nombre || firstProduct.name || 'N/A'}`);
        }
      }
      
      successCount++;
      
    } catch (err) {
      result(false, `${test.name} - Error: ${err.message}`);
      
      if (err.response) {
        info(`   Status: ${err.response.status}`);
        info(`   Error: ${err.response.data?.message || err.response.data || 'Sin detalles'}`);
      }
    }
    
    console.log(''); // Espacio entre tests
  }
  
  return successCount === tests.length;
};

// Función para test de endpoints de categorías
const testCategoryEndpoints = async () => {
  header('TEST DE ENDPOINTS DE CATEGORÍAS');
  
  const tests = [
    {
      name: 'GET /api/categorias',
      endpoint: '/api/categorias',
      method: 'get'
    }
  ];
  
  let successCount = 0;
  
  for (const test of tests) {
    try {
      info(`Probando: ${test.name}`);
      
      const response = await api[test.method](test.endpoint);
      
      result(true, `${test.name} - Status: ${response.status}`);
      
      if (response.data) {
        const data = response.data;
        info(`   Total de categorías: ${Array.isArray(data) ? data.length : 'N/A'}`);
        
        if (Array.isArray(data) && data.length > 0) {
          const firstCategory = data[0];
          info(`   Primera categoría: ${firstCategory.nombre || firstCategory.name || 'N/A'}`);
        }
      }
      
      successCount++;
      
    } catch (err) {
      result(false, `${test.name} - Error: ${err.message}`);
      
      if (err.response) {
        info(`   Status: ${err.response.status}`);
        info(`   Error: ${err.response.data?.message || err.response.data || 'Sin detalles'}`);
      }
    }
    
    console.log(''); // Espacio entre tests
  }
  
  return successCount === tests.length;
};

// Función para test de endpoints de rubros
const testRubrosEndpoints = async () => {
  header('TEST DE ENDPOINTS DE RUBROS');
  
  const tests = [
    {
      name: 'GET /api/rubros',
      endpoint: '/api/rubros',
      method: 'get'
    }
  ];
  
  let successCount = 0;
  
  for (const test of tests) {
    try {
      info(`Probando: ${test.name}`);
      
      const response = await api[test.method](test.endpoint);
      
      result(true, `${test.name} - Status: ${response.status}`);
      
      if (response.data) {
        const data = response.data;
        info(`   Total de rubros: ${Array.isArray(data) ? data.length : 'N/A'}`);
        
        if (Array.isArray(data) && data.length > 0) {
          const firstRubro = data[0];
          info(`   Primer rubro: ${firstRubro.nombre || firstRubro.name || 'N/A'}`);
        }
      }
      
      successCount++;
      
    } catch (err) {
      result(false, `${test.name} - Error: ${err.message}`);
      
      if (err.response) {
        info(`   Status: ${err.response.status}`);
        info(`   Error: ${err.response.data?.message || err.response.data || 'Sin detalles'}`);
      }
    }
    
    console.log(''); // Espacio entre tests
  }
  
  return successCount === tests.length;
};

// Función para test de performance
const testPerformance = async () => {
  header('TEST DE PERFORMANCE');
  
  const endpoints = [
    '/api/productos?page=1&limit=10',
    '/api/categorias',
    '/api/rubros'
  ];
  
  for (const endpoint of endpoints) {
    try {
      info(`Probando performance de: ${endpoint}`);
      
      const startTime = Date.now();
      const response = await api.get(endpoint);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      
      if (responseTime < 1000) {
        result(true, `✅ ${endpoint} - ${responseTime}ms (Excelente)`);
      } else if (responseTime < 3000) {
        result(true, `✅ ${endpoint} - ${responseTime}ms (Bueno)`);
      } else {
        warning(`⚠️  ${endpoint} - ${responseTime}ms (Lento)`);
      }
      
    } catch (err) {
      result(false, `❌ ${endpoint} - Error: ${err.message}`);
    }
  }
};

// Función para test de headers y CORS
const testHeadersAndCORS = async () => {
  header('TEST DE HEADERS Y CORS');
  
  try {
    const response = await api.get('/api/productos?page=1&limit=1');
    
    const headers = response.headers;
    
    info('Headers de respuesta:');
    info(`   Content-Type: ${headers['content-type'] || 'N/A'}`);
    info(`   Access-Control-Allow-Origin: ${headers['access-control-allow-origin'] || 'N/A'}`);
    info(`   Cache-Control: ${headers['cache-control'] || 'N/A'}`);
    
    if (headers['access-control-allow-origin']) {
      result(true, 'CORS configurado correctamente');
    } else {
      warning('CORS no configurado - puede causar problemas en el frontend');
    }
    
    return true;
    
  } catch (err) {
    result(false, `Error al verificar headers: ${err.message}`);
    return false;
  }
};

// Función principal de testing
const runAllTests = async () => {
  header('INICIANDO TEST COMPLETO DE LA API');
  
  info(`URL de la API: ${API_BASE_URL}`);
  info(`Timeout configurado: ${TIMEOUT}ms`);
  info(`Fecha y hora: ${new Date().toLocaleString('es-AR')}`);
  
  console.log('');
  
  // Ejecutar todos los tests
  const results = {
    connectivity: await testBasicConnectivity(),
    products: await testProductEndpoints(),
    categories: await testCategoryEndpoints(),
    rubros: await testRubrosEndpoints(),
    performance: await testPerformance(),
    headers: await testHeadersAndCORS()
  };
  
  console.log('');
  header('RESUMEN DE RESULTADOS');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  info(`Tests ejecutados: ${totalTests}`);
  info(`Tests exitosos: ${passedTests}`);
  info(`Tests fallidos: ${totalTests - passedTests}`);
  
  if (passedTests === totalTests) {
    log(colors.green, '🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!');
  } else {
    log(colors.red, '⚠️  ALGUNOS TESTS FALLARON - Revisa los errores arriba');
  }
  
  console.log('');
  
  // Recomendaciones
  if (!results.connectivity) {
    error('RECOMENDACIONES:');
    warning('1. Verifica que el backend esté ejecutándose');
    warning('2. Verifica que VITE_API_URL sea correcta en tu .env');
    warning('3. Verifica que no haya firewall bloqueando la conexión');
  }
  
  if (!results.products) {
    warning('4. Verifica que el endpoint /api/productos esté implementado');
    warning('5. Verifica que la base de datos esté funcionando');
  }
  
  separator();
};

// Función para manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  error('Promesa rechazada no manejada:');
  error(`   Razón: ${reason}`);
  error(`   Promesa: ${promise}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  error('Excepción no capturada:');
  error(`   Error: ${error.message}`);
  error(`   Stack: ${error.stack}`);
  process.exit(1);
});

// Ejecutar tests si el script se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch((error) => {
    error(`Error fatal en el testing: ${error.message}`);
    process.exit(1);
  });
}

export {
  runAllTests,
  testBasicConnectivity,
  testProductEndpoints,
  testCategoryEndpoints,
  testRubrosEndpoints,
  testPerformance,
  testHeadersAndCORS
};
