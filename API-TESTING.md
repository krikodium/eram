# 🧪 API Testing Script - ERAM Frontend

Este script de testing verifica la conectividad y funcionalidad de la API del backend antes de integrarla con el frontend.

## 📋 Prerrequisitos

1. **Node.js 18+** instalado en tu sistema
2. **Archivo .env** configurado con `VITE_API_URL`
3. **Backend ejecutándose** y accesible
4. **Dependencias instaladas**: `npm install`

## 🚀 Instalación

1. **Instalar dependencias** (si no las tienes):
```bash
npm install axios dotenv
```

2. **Verificar archivo .env**:
```env
VITE_API_URL=http://localhost:8000
# o la URL real de tu backend
```

## 🎯 Uso del Script

### Ejecutar Todos los Tests
```bash
npm run test:api
```

### Ejecutar Tests Específicos
```bash
# Solo test de conectividad
npm run test:api:connectivity

# Solo test de productos
npm run test:api:products

# Test completo con verbose
npm run test:api:verbose
```

### Ejecutar Directamente
```bash
node api-test.js
```

## 🔍 Tests Incluidos

### 1. **Test de Conectividad Básica**
- Verifica que el servidor esté accesible
- Prueba la conexión al endpoint raíz
- Detecta problemas de red o configuración

### 2. **Test de Endpoints de Productos**
- `GET /api/productos` (con y sin parámetros)
- `GET /api/productos` con paginación
- Verifica estructura de respuesta
- Valida datos de productos

### 3. **Test de Endpoints de Categorías**
- `GET /api/categorias`
- Verifica estructura de respuesta
- Valida datos de categorías

### 4. **Test de Endpoints de Rubros**
- `GET /api/rubros`
- Verifica estructura de respuesta
- Valida datos de rubros

### 5. **Test de Performance**
- Mide tiempo de respuesta de cada endpoint
- Clasifica performance (Excelente < 1s, Bueno < 3s, Lento > 3s)

### 6. **Test de Headers y CORS**
- Verifica configuración de CORS
- Valida headers de respuesta
- Detecta problemas de configuración del servidor

## 📊 Interpretación de Resultados

### ✅ **Tests Exitosos**
- Endpoint responde correctamente
- Estructura de datos válida
- Performance aceptable

### ❌ **Tests Fallidos**
- Endpoint no responde
- Error de autenticación/autorización
- Estructura de datos incorrecta
- Timeout o error de red

### ⚠️ **Warnings**
- Performance lenta
- CORS no configurado
- Headers faltantes

## 🛠️ Solución de Problemas

### **Error: ECONNREFUSED**
```bash
# El servidor no está ejecutándose
# Solución: Inicia tu backend
```

### **Error: ENOTFOUND**
```bash
# URL incorrecta en .env
# Solución: Verifica VITE_API_URL
```

### **Error: 404 Not Found**
```bash
# Endpoint no implementado
# Solución: Verifica rutas del backend
```

### **Error: 500 Internal Server Error**
```bash
# Error del servidor
# Solución: Revisa logs del backend
```

### **Error: CORS**
```bash
# CORS no configurado
# Solución: Configura CORS en el backend
```

## 📝 Ejemplo de Salida Exitosa

```
================================================================================
🚀 INICIANDO TEST COMPLETO DE LA API
================================================================================
ℹ️  URL de la API: http://localhost:8000
ℹ️  Timeout configurado: 10000ms
ℹ️  Fecha y hora: 15/12/2024, 14:30:25

================================================================================
🚀 TEST DE CONECTIVIDAD BÁSICA
================================================================================
ℹ️  Probando conexión a: http://localhost:8000
✅ Conexión exitosa - Status: 200

================================================================================
🚀 TEST DE ENDPOINTS DE PRODUCTOS
================================================================================
ℹ️  Probando: GET /api/productos
✅ GET /api/productos - Status: 200
   Total de productos: 150
   Página actual: 1
   Productos en respuesta: 5
   Primer producto: Casco Industrial Pro

================================================================================
🚀 RESUMEN DE RESULTADOS
================================================================================
ℹ️  Tests ejecutados: 6
ℹ️  Tests exitosos: 6
ℹ️  Tests fallidos: 0
🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!
================================================================================
```

## 🔧 Personalización

### **Agregar Nuevos Tests**
```javascript
// En api-test.js
const testCustomEndpoint = async () => {
  try {
    const response = await api.get('/api/custom');
    result(true, 'Custom endpoint funciona');
    return true;
  } catch (err) {
    result(false, `Custom endpoint falló: ${err.message}`);
    return false;
  }
};

// Agregar a runAllTests()
const results = {
  // ... otros tests
  custom: await testCustomEndpoint()
};
```

### **Modificar Timeout**
```javascript
// En api-test.js
const TIMEOUT = 15000; // 15 segundos
```

### **Agregar Headers Personalizados**
```javascript
// En api-test.js
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'ERAM-API-Test/1.0.0',
    'X-Custom-Header': 'custom-value'
  }
});
```

## 📚 Integración con CI/CD

### **GitHub Actions**
```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:api
```

### **Pre-commit Hook**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:api"
    }
  }
}
```

## 🎯 Próximos Pasos

1. **Ejecuta el script** para verificar el estado actual
2. **Resuelve errores** identificados
3. **Integra la API real** en el frontend
4. **Ejecuta tests regularmente** durante el desarrollo
5. **Configura CI/CD** para testing automático

## 📞 Soporte

Si encuentras problemas:

1. **Verifica logs** del backend
2. **Confirma configuración** del .env
3. **Prueba endpoints** manualmente (Postman, curl)
4. **Revisa documentación** de la API
5. **Contacta al equipo** de backend

---

**¡Happy Testing! 🚀**
