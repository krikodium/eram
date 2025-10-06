# ERAM Category Debugger - Professional Database Tools

Herramientas profesionales para analizar y corregir las relaciones entre productos y categorías en la base de datos de ERAM.

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
cd scripts
npm install

# 2. Verificar que tienes las variables de entorno
# Asegúrate de que tu archivo .env tenga:
# VITE_SUPABASE_URL=tu_url_aqui
# VITE_SUPABASE_ANON_KEY=tu_key_aqui
```

## 🔍 Análisis de Categorías

### Ejecutar Análisis Completo

```bash
npm run debug
# o
node debug-categories.js
```

**¿Qué hace este script?**
- ✅ Analiza todas las categorías en la base de datos
- ✅ Verifica todos los productos y sus relaciones con categorías
- ✅ Identifica inconsistencias y problemas
- ✅ Genera recomendaciones de corrección
- ✅ Crea reportes detallados en formato JSON, SQL y CSV

**Archivos generados:**
- `reports/category-analysis.json` - Análisis completo
- `reports/category-fixes.sql` - Script SQL de corrección
- `reports/products-with-issues.csv` - Productos con problemas

## 🔧 Corrección de Categorías

### Modo Dry Run (Recomendado primero)

```bash
npm run fix-dry
# o
node fix-categories.js --dry-run
```

**¿Qué hace?**
- 🔍 Muestra qué cambios se harían SIN modificar la base de datos
- 📊 Te permite revisar las correcciones antes de aplicarlas
- ⚠️ Es completamente seguro ejecutar

### Aplicar Correcciones

```bash
npm run fix
# o
node fix-categories.js
```

**¿Qué hace?**
- 🔧 Aplica las correcciones automáticamente
- 📝 Asigna categorías a productos sin categoría
- 🛠️ Corrige referencias inválidas
- ⚠️ **SOLO ejecutar después de revisar el dry run**

## 📊 Tipos de Problemas Detectados

### 🚨 CRITICAL - Referencias Inválidas
- Productos que referencian `categoria_id` que no existe
- **Ejemplo:** Producto con `categoria_id: 999` pero no hay categoría con ID 999

### ⚠️ HIGH - Sin Categoría Asignada
- Productos sin `categoria_id` asignado
- **Ejemplo:** Producto "Casco de seguridad" sin categoría

### 🔍 MEDIUM - Categorías No Especificadas
- Productos con categorías "No especificada", "N/A", o vacías
- **Ejemplo:** Categoría "No especificada" en lugar de "Cascos"

## 🎯 Proceso Recomendado

### Paso 1: Análisis Inicial
```bash
npm run debug
```

### Paso 2: Revisar Resultados
- Abre `reports/category-analysis.json` para ver el análisis completo
- Revisa `reports/products-with-issues.csv` para productos problemáticos
- Examina `reports/category-fixes.sql` para las correcciones propuestas

### Paso 3: Dry Run
```bash
npm run fix-dry
```

### Paso 4: Aplicar Correcciones
```bash
npm run fix
```

### Paso 5: Verificar Resultados
```bash
npm run debug
```

## 📁 Estructura de Archivos

```
scripts/
├── debug-categories.js    # Script de análisis
├── fix-categories.js      # Script de corrección
├── package.json          # Dependencias
├── README.md             # Esta documentación
└── reports/              # Reportes generados
    ├── category-analysis.json
    ├── category-fixes.sql
    └── products-with-issues.csv
```

## 🔒 Seguridad

- ✅ **Dry run por defecto** - No hace cambios sin confirmación
- ✅ **Backup recomendado** - Siempre haz backup antes de aplicar cambios
- ✅ **Logs detallados** - Registra todas las operaciones
- ✅ **Validación** - Verifica datos antes de aplicar cambios

## 🆘 Solución de Problemas

### Error: "Missing Supabase credentials"
```bash
# Verifica que tu archivo .env tenga:
VITE_SUPABASE_URL=tu_url_aqui
VITE_SUPABASE_ANON_KEY=tu_key_aqui
```

### Error: "Analysis report not found"
```bash
# Ejecuta primero el análisis:
npm run debug
```

### Error: "Database error"
- Verifica que tu clave de Supabase tenga permisos de escritura
- Revisa que la tabla `productos` tenga la columna `categoria_id`

## 📞 Soporte

Si encuentras problemas o necesitas ayuda:
1. Revisa los logs de error
2. Verifica las credenciales de Supabase
3. Asegúrate de tener permisos de base de datos
4. Contacta al equipo de desarrollo

---

**⚠️ IMPORTANTE:** Siempre ejecuta `npm run fix-dry` antes de `npm run fix` para revisar los cambios propuestos.



