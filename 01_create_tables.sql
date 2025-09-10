-- =============================================================================
-- ERAM - Script de Creación de Tablas para Supabase
-- =============================================================================
-- Este script crea la estructura de base de datos para el catálogo de ERAM
-- Incluye tablas para categorías, subcategorías y productos
-- =============================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLA DE CATEGORÍAS
-- =============================================================================
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    fuente VARCHAR(20) NOT NULL CHECK (fuente IN ('99DIST', '159EXWORKS', 'AMBAS')),
    repetida BOOLEAN DEFAULT FALSE,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLA DE SUBCATEGORÍAS
-- =============================================================================
CREATE TABLE IF NOT EXISTS subcategorias (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(categoria_id, nombre)
);

-- =============================================================================
-- TABLA DE PRODUCTOS
-- =============================================================================
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    subcategoria_id INTEGER REFERENCES subcategorias(id) ON DELETE SET NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    medidas TEXT,
    presentacion VARCHAR(100),
    moneda VARCHAR(3) CHECK (moneda IN ('ARS', 'USD')),
    precio_unitario DECIMAL(12,2),
    precios_por_bulto JSONB, -- Almacena precios escalonados como JSON
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    imagen_url VARCHAR(255),
    fuente VARCHAR(20) NOT NULL CHECK (fuente IN ('99DIST', '159EXWORKS')),
    notas TEXT,
    activo BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLA DE USUARIOS (Para futuro panel admin)
-- =============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    rol VARCHAR(20) DEFAULT 'cliente' CHECK (rol IN ('admin', 'editor', 'cliente')),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================================================

-- Índices para categorías
CREATE INDEX IF NOT EXISTS idx_categorias_nombre ON categorias(nombre);
CREATE INDEX IF NOT EXISTS idx_categorias_fuente ON categorias(fuente);
CREATE INDEX IF NOT EXISTS idx_categorias_activa ON categorias(activa);

-- Índices para subcategorías
CREATE INDEX IF NOT EXISTS idx_subcategorias_categoria_id ON subcategorias(categoria_id);
CREATE INDEX IF NOT EXISTS idx_subcategorias_nombre ON subcategorias(nombre);
CREATE INDEX IF NOT EXISTS idx_subcategorias_activa ON subcategorias(activa);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_subcategoria_id ON productos(subcategoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_moneda ON productos(moneda);
CREATE INDEX IF NOT EXISTS idx_productos_precio_unitario ON productos(precio_unitario);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_destacado ON productos(destacado);
CREATE INDEX IF NOT EXISTS idx_productos_fuente ON productos(fuente);

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_productos_busqueda ON productos(categoria_id, activo, destacado);

-- =============================================================================
-- FUNCIONES DE ACTUALIZACIÓN AUTOMÁTICA
-- =============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_categorias_updated_at 
    BEFORE UPDATE ON categorias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategorias_updated_at 
    BEFORE UPDATE ON subcategorias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at 
    BEFORE UPDATE ON productos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) - Para futuro panel admin
-- =============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública (categorías y productos)
CREATE POLICY "Categorías públicas" ON categorias
    FOR SELECT USING (activa = true);

CREATE POLICY "Subcategorías públicas" ON subcategorias
    FOR SELECT USING (activa = true);

CREATE POLICY "Productos públicos" ON productos
    FOR SELECT USING (activo = true);

-- Políticas para administradores (futuro)
CREATE POLICY "Usuarios pueden ver su perfil" ON usuarios
    FOR SELECT USING (auth.uid() = id);

-- =============================================================================
-- COMENTARIOS EN TABLAS Y COLUMNAS
-- =============================================================================

COMMENT ON TABLE categorias IS 'Categorías principales del catálogo ERAM';
COMMENT ON TABLE subcategorias IS 'Subcategorías dentro de cada categoría principal';
COMMENT ON TABLE productos IS 'Productos del catálogo con precios y especificaciones';
COMMENT ON TABLE usuarios IS 'Usuarios del sistema (futuro panel admin)';

COMMENT ON COLUMN categorias.fuente IS 'Fuente del catálogo: 99DIST, 159EXWORKS o AMBAS';
COMMENT ON COLUMN categorias.repetida IS 'Indica si la categoría aparece en ambas fuentes';
COMMENT ON COLUMN productos.precios_por_bulto IS 'Precios escalonados en formato JSON: {"X30": 100, "X100": 90}';
COMMENT ON COLUMN productos.medidas IS 'Medidas del producto en formato libre';
COMMENT ON COLUMN productos.presentacion IS 'Presentación del producto (caja, pack, etc.)';
COMMENT ON COLUMN productos.notas IS 'Notas adicionales del producto';

-- =============================================================================
-- VISTAS ÚTILES
-- =============================================================================

-- Vista para productos con información completa
CREATE OR REPLACE VIEW productos_completos AS
SELECT 
    p.id,
    p.codigo,
    p.nombre,
    p.descripcion,
    p.medidas,
    p.presentacion,
    p.moneda,
    p.precio_unitario,
    p.precios_por_bulto,
    p.stock,
    p.stock_minimo,
    p.imagen_url,
    p.fuente,
    p.notas,
    p.activo,
    p.destacado,
    c.nombre as categoria_nombre,
    c.descripcion as categoria_descripcion,
    s.nombre as subcategoria_nombre,
    s.descripcion as subcategoria_descripcion,
    p.created_at,
    p.updated_at
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
WHERE p.activo = true AND c.activa = true;

-- Vista para estadísticas de categorías
CREATE OR REPLACE VIEW estadisticas_categorias AS
SELECT 
    c.id,
    c.nombre,
    c.descripcion,
    COUNT(p.id) as total_productos,
    COUNT(DISTINCT s.id) as total_subcategorias,
    MIN(p.precio_unitario) as precio_minimo,
    MAX(p.precio_unitario) as precio_maximo,
    AVG(p.precio_unitario) as precio_promedio
FROM categorias c
LEFT JOIN subcategorias s ON c.id = s.categoria_id AND s.activa = true
LEFT JOIN productos p ON c.id = p.categoria_id AND p.activo = true
WHERE c.activa = true
GROUP BY c.id, c.nombre, c.descripcion;

-- =============================================================================
-- DATOS INICIALES
-- =============================================================================

-- Insertar categoría especial para productos sin categoría
INSERT INTO categorias (nombre, descripcion, fuente, activa) 
VALUES ('Sin Categoría', 'Productos sin categoría asignada', 'AMBAS', true)
ON CONFLICT (nombre) DO NOTHING;

-- =============================================================================
-- MENSAJE DE ÉXITO
-- =============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Tablas creadas exitosamente en Supabase';
    RAISE NOTICE '📊 Estructura: Categorías, Subcategorías, Productos, Usuarios';
    RAISE NOTICE '🔒 RLS habilitado para seguridad';
    RAISE NOTICE '📈 Índices optimizados para rendimiento';
    RAISE NOTICE '🎯 Vistas útiles creadas';
END $$;
