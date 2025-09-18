# 🔄 PASO A PASO PARA REINICIAR BASE DE DATOS

## **⚠️ IMPORTANTE:**
Este proceso eliminará TODOS los datos existentes y creará una nueva estructura desde cero.

---

## **📋 PASOS A SEGUIR:**

### **1. 🗑️ ELIMINAR TABLAS EXISTENTES**
```sql
-- Ejecutar en Supabase SQL Editor
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS subcategorias CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
```

### **2. 🆕 CREAR NUEVA ESTRUCTURA**
```sql
-- Crear tablas con estructura mejorada
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  fuente VARCHAR(20) CHECK (fuente IN ('99DIST', '159EXWORKS')),
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subcategorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
  fuente VARCHAR(20) CHECK (fuente IN ('99DIST', '159EXWORKS')),
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  medidas VARCHAR(100),
  moneda VARCHAR(10) CHECK (moneda IN ('ARS', 'USD')),
  precio_unitario DECIMAL(10,2),
  precios_por_bulto JSONB DEFAULT '{}',
  presentacion_bulto VARCHAR(100),
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  subcategoria_id INTEGER REFERENCES subcategorias(id) ON DELETE SET NULL,
  fuente VARCHAR(20) CHECK (fuente IN ('99DIST', '159EXWORKS')),
  notas TEXT,
  stock_disponible INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **3. 🔧 CONFIGURAR RLS Y TRIGGERS**
```sql
-- Habilitar RLS
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público
CREATE POLICY "Public read access" ON categorias FOR SELECT USING (true);
CREATE POLICY "Public read access" ON subcategorias FOR SELECT USING (true);
CREATE POLICY "Public read access" ON productos FOR SELECT USING (true);

-- Función para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subcategorias_updated_at BEFORE UPDATE ON subcategorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **4. 📊 INSERTAR DATOS MANUALMENTE**
```sql
-- Insertar categorías principales
INSERT INTO categorias (nombre, descripcion, fuente, activa) VALUES
('SEÑALIZACION VIAL', 'Señalización y seguridad vial', '99DIST', true),
('PROTECCION PERSONAL', 'Equipos de protección personal', '99DIST', true),
('INCENDIO', 'Equipos contra incendios', '99DIST', true),
('PRIMEROS AUXILIOS', 'Kits y equipos de primeros auxilios', '99DIST', true);

-- Insertar productos de ejemplo
INSERT INTO productos (codigo, nombre, descripcion, medidas, moneda, precio_unitario, categoria_id, fuente, activo) VALUES
('001', 'Casco de Seguridad', 'Casco de seguridad industrial', 'Talla M', 'ARS', 15000.00, 1, '99DIST', true),
('002', 'Guantes de Seguridad', 'Guantes de protección', 'Talla L', 'ARS', 8500.00, 1, '99DIST', true);
```

### **5. ✅ VERIFICAR ESTRUCTURA**
```sql
-- Verificar que las tablas se crearon correctamente
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categorias', 'subcategorias', 'productos');

-- Verificar datos
SELECT COUNT(*) as total_categorias FROM categorias;
SELECT COUNT(*) as total_productos FROM productos;
```

---

## **🎯 VENTAJAS DE LA NUEVA ESTRUCTURA:**

1. **✅ Campos más claros** y organizados
2. **✅ Mejor validación** de datos
3. **✅ Estructura más limpia** sin datos incorrectos
4. **✅ Fácil mantenimiento** manual
5. **✅ Escalabilidad** para futuras mejoras

---

## **📝 NOTAS IMPORTANTES:**

- **Backup**: Antes de eliminar, exporta los datos importantes
- **Testing**: Prueba la nueva estructura antes de cargar todos los productos
- **Validación**: Verifica que todos los campos estén correctos
- **Documentación**: Mantén registro de los cambios realizados

---

## **🚀 PRÓXIMOS PASOS:**

1. Ejecutar scripts de eliminación
2. Crear nueva estructura
3. Insertar datos manualmente
4. Probar en frontend
5. Cargar productos gradualmente

