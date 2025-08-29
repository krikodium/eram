#!/usr/bin/env node

/**
 * Quick API Test - ERAM Frontend
 * 
 * Script simple para verificar conectividad básica de la API
 * 
 * Uso: node quick-api-test.js
 */

import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (color, message) => console.log(`${color}${message}${colors.reset}`);

// Configuración
const API_URL = process.env.VITE_API_URL || 'http://localhost:8000';
const TIMEOUT = 5000;

console.log(`${colors.cyan}🔍 Quick API Test - ERAM Frontend${colors.reset}`);
console.log(`${colors.blue}URL: ${API_URL}${colors.reset}`);
console.log(`${colors.blue}Timeout: ${TIMEOUT}ms${colors.reset}\n`);

// Test de conectividad básica
const testConnectivity = async () => {
  try {
    log(colors.cyan, '📡 Probando conectividad...');
    
    const response = await axios.get(API_URL, { timeout: TIMEOUT });
    
    log(colors.green, `✅ Conexión exitosa!`);
    log(colors.green, `   Status: ${response.status}`);
    log(colors.green, `   Tiempo: ${response.headers['x-response-time'] || 'N/A'}`);
    
    return true;
  } catch (error) {
    log(colors.red, `❌ Error de conexión: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      log(colors.yellow, '💡 El servidor parece estar apagado');
      log(colors.yellow, '   Verifica que el backend esté ejecutándose');
    } else if (error.code === 'ENOTFOUND') {
      log(colors.yellow, '💡 No se puede resolver la URL');
      log(colors.yellow, '   Verifica VITE_API_URL en tu .env');
    } else if (error.code === 'ETIMEDOUT') {
      log(colors.yellow, '💡 Timeout - el servidor responde muy lento');
    }
    
    return false;
  }
};

// Test de endpoint de productos
const testProducts = async () => {
  try {
    log(colors.cyan, '📦 Probando endpoint de productos...');
    
    const response = await axios.get(`${API_URL}/api/productos?page=1&limit=5`, { 
      timeout: TIMEOUT 
    });
    
    log(colors.green, `✅ Endpoint de productos funciona!`);
    log(colors.green, `   Status: ${response.status}`);
    
    if (response.data) {
      const data = response.data;
      log(colors.green, `   Total: ${data.total || 'N/A'}`);
      log(colors.green, `   Productos: ${Array.isArray(data.productos) ? data.productos.length : 'N/A'}`);
      
      if (Array.isArray(data.productos) && data.productos.length > 0) {
        const first = data.productos[0];
        log(colors.green, `   Primer producto: ${first.nombre || first.name || 'N/A'}`);
      }
    }
    
    return true;
  } catch (error) {
    log(colors.red, `❌ Error en productos: ${error.message}`);
    
    if (error.response) {
      log(colors.yellow, `   Status: ${error.response.status}`);
      log(colors.yellow, `   Error: ${error.response.data?.message || 'Sin detalles'}`);
    }
    
    return false;
  }
};

// Test de endpoint de categorías
const testCategories = async () => {
  try {
    log(colors.cyan, '🏷️  Probando endpoint de categorías...');
    
    const response = await axios.get(`${API_URL}/api/categorias`, { 
      timeout: TIMEOUT 
    });
    
    log(colors.green, `✅ Endpoint de categorías funciona!`);
    log(colors.green, `   Status: ${response.status}`);
    
    if (response.data) {
      const data = response.data;
      log(colors.green, `   Total categorías: ${Array.isArray(data) ? data.length : 'N/A'}`);
    }
    
    return true;
  } catch (error) {
    log(colors.red, `❌ Error en categorías: ${error.message}`);
    
    if (error.response) {
      log(colors.yellow, `   Status: ${error.response.status}`);
    }
    
    return false;
  }
};

// Test de performance
const testPerformance = async () => {
  try {
    log(colors.cyan, '⚡ Probando performance...');
    
    const endpoints = [
      '/api/productos?page=1&limit=1',
      '/api/categorias'
    ];
    
    for (const endpoint of endpoints) {
      const start = Date.now();
      await axios.get(`${API_URL}${endpoint}`, { timeout: TIMEOUT });
      const time = Date.now() - start;
      
      if (time < 1000) {
        log(colors.green, `✅ ${endpoint}: ${time}ms (Excelente)`);
      } else if (time < 3000) {
        log(colors.green, `✅ ${endpoint}: ${time}ms (Bueno)`);
      } else {
        log(colors.yellow, `⚠️  ${endpoint}: ${time}ms (Lento)`);
      }
    }
    
    return true;
  } catch (error) {
    log(colors.red, `❌ Error en performance: ${error.message}`);
    return false;
  }
};

// Función principal
const runQuickTest = async () => {
  console.log(`${colors.cyan}🚀 Iniciando Quick API Test...\n`);
  
  const results = {
    connectivity: await testConnectivity(),
    products: await testProducts(),
    categories: await testCategories(),
    performance: await testPerformance()
  };
  
  console.log(`\n${colors.cyan}📊 RESUMEN:${colors.reset}`);
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  
  log(colors.cyan, `Tests ejecutados: ${total}`);
  log(colors.green, `Tests exitosos: ${passed}`);
  log(colors.red, `Tests fallidos: ${total - passed}`);
  
  if (passed === total) {
    console.log(`\n${colors.green}🎉 ¡API funcionando perfectamente!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}⚠️  Algunos tests fallaron - Revisa los errores arriba${colors.reset}`);
  }
  
  console.log(`\n${colors.cyan}💡 Para tests completos ejecuta: npm run test:api${colors.reset}`);
};

// Manejo de errores
process.on('unhandledRejection', (reason) => {
  log(colors.red, `💥 Error no manejado: ${reason}`);
  process.exit(1);
});

// Ejecutar test
runQuickTest().catch((error) => {
  log(colors.red, `💥 Error fatal: ${error.message}`);
  process.exit(1);
});
