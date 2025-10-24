-- 06_create_admin_logs_table.sql - Crear tabla de logs de actividad del administrador

-- Crear tabla de logs de actividad
CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('error', 'warning', 'info', 'success')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_email ON admin_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_resource ON admin_logs(resource);
CREATE INDEX IF NOT EXISTS idx_admin_logs_severity ON admin_logs(severity);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON admin_logs(user_id);

-- Crear índice compuesto para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_admin_logs_search ON admin_logs(user_email, action, created_at);

-- Insertar algunos logs de ejemplo
INSERT INTO admin_logs (user_email, action, resource, description, severity, ip_address, user_agent) VALUES
('admin@eram.com', 'login', 'auth', 'Inicio de sesión exitoso', 'success', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('admin@eram.com', 'create', 'productos', 'Producto "Casco de Seguridad" creado exitosamente', 'info', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('admin@eram.com', 'update', 'categorias', 'Categoría "Protección Personal" actualizada', 'info', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('admin@eram.com', 'export', 'productos', 'Exportación de 25 productos en formato CSV', 'info', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('admin@eram.com', 'import', 'productos', 'Importación masiva de 10 productos', 'info', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('admin@eram.com', 'delete', 'productos', 'Producto "Producto Obsoleto" eliminado', 'warning', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('admin@eram.com', 'error', 'system', 'Error al procesar imagen: Formato no soportado', 'error', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- Comentarios sobre la tabla
COMMENT ON TABLE admin_logs IS 'Registro de todas las actividades del administrador';
COMMENT ON COLUMN admin_logs.user_id IS 'ID del usuario (puede ser null para usuarios anónimos)';
COMMENT ON COLUMN admin_logs.user_email IS 'Email del usuario que realizó la acción';
COMMENT ON COLUMN admin_logs.action IS 'Tipo de acción realizada (create, update, delete, login, logout, export, import, error)';
COMMENT ON COLUMN admin_logs.resource IS 'Recurso afectado (productos, categorias, auth, system, etc.)';
COMMENT ON COLUMN admin_logs.resource_id IS 'ID específico del recurso afectado';
COMMENT ON COLUMN admin_logs.description IS 'Descripción detallada de la acción';
COMMENT ON COLUMN admin_logs.severity IS 'Nivel de severidad (error, warning, info, success)';
COMMENT ON COLUMN admin_logs.ip_address IS 'Dirección IP desde donde se realizó la acción';
COMMENT ON COLUMN admin_logs.user_agent IS 'User Agent del navegador';
COMMENT ON COLUMN admin_logs.metadata IS 'Datos adicionales en formato JSON';
COMMENT ON COLUMN admin_logs.created_at IS 'Fecha y hora de la acción';
