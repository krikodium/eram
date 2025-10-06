# 📸 Scripts de Subida de Fotos a Supabase

Scripts profesionales para subir fotos de productos desde Google Drive o archivos locales a Supabase Storage.

## 🚀 Instalación

```bash
# Instalar dependencias
pip install -r requirements.txt

# O instalar individualmente
pip install google-api-python-client google-auth-oauthlib supabase
```

## 📋 Scripts Disponibles

### 1. `count-drive-photos.py` - Contador de Fotos
**Propósito**: Contar cuántas fotos hay en las carpetas de Google Drive

```bash
python count-drive-photos.py
```

**Requisitos**:
- Archivo `credentials.json` de Google Drive API
- Acceso a las carpetas de Drive

**Resultado**: Muestra estadísticas detalladas de todas las fotos encontradas

### 2. `upload-local-photos.py` - Subida Local
**Propósito**: Subir fotos descargadas localmente a Supabase

```bash
# Crear directorio para fotos
mkdir fotos_productos

# Colocar las fotos descargadas en el directorio
# Las fotos deben tener el nombre del código del producto (ej: 12345.jpg)

# Ejecutar script
python upload-local-photos.py
```

**Requisitos**:
- Directorio `fotos_productos/` con las fotos
- Nombres de archivo = código del producto (ej: `12345.jpg`)

### 3. `upload-photos-hybrid.py` - Híbrido (Recomendado)
**Propósito**: Subir fotos desde Google Drive O archivos locales

```bash
python upload-photos-hybrid.py
```

**Opciones**:
1. **Google Drive**: Requiere `credentials.json`
2. **Archivos locales**: Requiere carpeta `fotos_productos/`
3. **Ambos**: Combina las dos opciones

## 🔧 Configuración

### Para Google Drive:
1. **Habilitar Google Drive API** en Google Cloud Console
2. **Crear credenciales** y descargar `credentials.json`
3. **Colocar** `credentials.json` en el directorio `scripts/`
4. **Compartir las carpetas** con la cuenta de servicio

### Para Archivos Locales:
1. **Descargar fotos** de Google Drive manualmente
2. **Crear directorio** `fotos_productos/` en `scripts/`
3. **Colocar fotos** con nombres = código del producto
4. **Ejecutar script** local

## 📊 Carpetas de Google Drive

### Carpetas Originales:
- `1OKSMHIWGeeO_TKkWFmHaYE019ZdH5i9v`
- `1H4Ul3p0wjFrStA1I-Oj-qZEMR0gAcyqT`
- `1759cgufQ3botgdnnGWMeVYFguvaOyxva`
- `1EBug7re42Vtw-OSfJOcVdsShoBNioRMA`
- `1uNDpBk0F4uE2Yl_xobVHJweYObjiFmhi`

### Carpeta de Producción:
- `1WE_HGMrhsv5LRE7CrYFOgPljN6MKvRls` (Producción 11/08)

## 🎯 Flujo de Trabajo Recomendado

### Opción 1: Solo Google Drive
```bash
# 1. Contar fotos disponibles
python count-drive-photos.py

# 2. Subir todas las fotos
python upload-photos-hybrid.py
# Seleccionar opción 1 (Google Drive)
```

### Opción 2: Solo Archivos Locales
```bash
# 1. Descargar fotos de Google Drive manualmente
# 2. Colocar en directorio fotos_productos/
# 3. Subir fotos
python upload-photos-hybrid.py
# Seleccionar opción 2 (Archivos locales)
```

### Opción 3: Híbrido (Recomendado)
```bash
# 1. Contar fotos en Drive
python count-drive-photos.py

# 2. Subir desde Drive Y archivos locales
python upload-photos-hybrid.py
# Seleccionar opción 3 (Ambos)
```

## 📈 Estadísticas

Los scripts muestran estadísticas detalladas:

- **Total de archivos procesados**
- **Archivos subidos exitosamente**
- **Registros actualizados en la base de datos**
- **Productos no encontrados en la DB**
- **Errores encontrados**

## 🔍 Solución de Problemas

### Error: "No se encontraron archivos"
- Verificar que las carpetas de Drive estén compartidas
- Verificar que `credentials.json` esté en el directorio correcto
- Verificar que el directorio local `fotos_productos/` exista

### Error: "Producto no encontrado en DB"
- Verificar que el nombre del archivo = código del producto
- Verificar que el producto exista en la tabla `productos`

### Error: "Error de Supabase"
- Verificar credenciales de Supabase
- Verificar que el bucket `PRODUCT-PHOTO` exista
- Verificar permisos de la clave de servicio

## 📝 Notas Importantes

1. **Nombres de archivo**: Deben coincidir exactamente con el código del producto
2. **Extensiones soportadas**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.webp`, `.tiff`
3. **Bucket de Supabase**: `PRODUCT-PHOTO`
4. **Tabla de BD**: `productos`
5. **Columna de imagen**: `imagen_url`
6. **Columna de código**: `codigo`

## 🚨 Seguridad

- **NO compartir** las credenciales de Supabase
- **NO subir** `credentials.json` a repositorios públicos
- **Usar** claves de servicio para producción
- **Hacer backup** de la base de datos antes de ejecutar

---

**Desarrollado para ERAM - Sistema de Gestión de Productos**


