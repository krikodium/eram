-- 08_create_usuarios_table.sql - Crear tabla de usuarios para el panel administrativo
-- Ejecutar este script en Supabase SQL Editor

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- En producción, esto debería estar hasheado
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  telefono VARCHAR(20),
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('admin', 'editor', 'viewer', 'client')),
  activo BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);
CREATE INDEX IF NOT EXISTS idx_usuarios_created_at ON usuarios(created_at);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_usuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_usuarios_updated_at ON usuarios;
CREATE TRIGGER trigger_update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_usuarios_updated_at();

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (email, password, nombre, apellido, role, activo)
VALUES (
  'admin@eram.com',
  'admin123', -- En producción, esto debería estar hasheado
  'Administrador',
  'Sistema',
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Insertar algunos usuarios de ejemplo
INSERT INTO usuarios (email, password, nombre, apellido, telefono, role, activo)
VALUES 
  (
    'editor@eram.com',
    'editor123',
    'Editor',
    'Ejemplo',
    '+54 11 1234-5678',
    'editor',
    true
  ),
  (
    'viewer@eram.com',
    'viewer123',
    'Visualizador',
    'Ejemplo',
    '+54 11 8765-4321',
    'viewer',
    true
  ),
  (
    'cliente@ejemplo.com',
    'cliente123',
    'Cliente',
    'Ejemplo',
    '+54 11 5555-1234',
    'client',
    true
  )
ON CONFLICT (email) DO NOTHING;

-- Comentarios sobre la tabla
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema administrativo';
COMMENT ON COLUMN usuarios.email IS 'Email único del usuario (usado para login)';
COMMENT ON COLUMN usuarios.password IS 'Contraseña del usuario (debe estar hasheada en producción)';
COMMENT ON COLUMN usuarios.role IS 'Rol del usuario: admin, editor, viewer, client';
COMMENT ON COLUMN usuarios.activo IS 'Indica si el usuario está activo en el sistema';
COMMENT ON COLUMN usuarios.last_login IS 'Fecha y hora del último acceso al sistema';
