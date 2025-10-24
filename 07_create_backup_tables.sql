-- 07_create_backup_tables.sql - Crear tablas para el sistema de backups

-- Crear tabla de historial de backups
CREATE TABLE IF NOT EXISTS backup_history (
    id SERIAL PRIMARY KEY,
    backup_id VARCHAR(255) UNIQUE NOT NULL,
    backup_type VARCHAR(50) NOT NULL CHECK (backup_type IN ('full', 'incremental', 'restore')),
    file_path TEXT NOT NULL,
    file_size BIGINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_backup_history_backup_id ON backup_history(backup_id);
CREATE INDEX IF NOT EXISTS idx_backup_history_type ON backup_history(backup_type);
CREATE INDEX IF NOT EXISTS idx_backup_history_status ON backup_history(status);
CREATE INDEX IF NOT EXISTS idx_backup_history_created_at ON backup_history(created_at);

-- Crear bucket de storage para backups (esto se hace desde la interfaz de Supabase)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('backups', 'backups', false);

-- Insertar algunos backups de ejemplo
INSERT INTO backup_history (backup_id, backup_type, file_path, file_size, status, metadata) VALUES
('backup_2024-01-15T10-30-00-000Z', 'full', 'backups/backup_2024-01-15T10-30-00-000Z.json', 1024000, 'completed', '{"totalProducts": 150, "totalCategories": 25, "totalLogs": 500}'),
('incremental_2024-01-15T14-30-00-000Z', 'incremental', 'backups/incremental/incremental_2024-01-15T14-30-00-000Z.json', 51200, 'completed', '{"totalProducts": 5, "totalCategories": 1, "totalLogs": 25}'),
('backup_2024-01-16T10-30-00-000Z', 'full', 'backups/backup_2024-01-16T10-30-00-000Z.json', 1056000, 'completed', '{"totalProducts": 155, "totalCategories": 26, "totalLogs": 525}'),
('incremental_2024-01-16T14-30-00-000Z', 'incremental', 'backups/incremental/incremental_2024-01-16T14-30-00-000Z.json', 25600, 'completed', '{"totalProducts": 2, "totalCategories": 0, "totalLogs": 15}'),
('restore_backup_2024-01-15T10-30-00-000Z_1705320000000', 'restore', 'backups/backup_2024-01-15T10-30-00-000Z.json', 0, 'completed', '{"restoredFrom": "backup_2024-01-15T10-30-00-000Z", "restoreResults": [{"table": "productos", "success": true}]}');

-- Comentarios sobre la tabla
COMMENT ON TABLE backup_history IS 'Historial de todos los backups realizados';
COMMENT ON COLUMN backup_history.backup_id IS 'Identificador único del backup';
COMMENT ON COLUMN backup_history.backup_type IS 'Tipo de backup (full, incremental, restore)';
COMMENT ON COLUMN backup_history.file_path IS 'Ruta del archivo de backup en el storage';
COMMENT ON COLUMN backup_history.file_size IS 'Tamaño del archivo de backup en bytes';
COMMENT ON COLUMN backup_history.status IS 'Estado del backup (pending, completed, failed)';
COMMENT ON COLUMN backup_history.metadata IS 'Metadatos adicionales del backup en formato JSON';
COMMENT ON COLUMN backup_history.created_at IS 'Fecha y hora de creación del backup';

-- Crear función para limpiar backups antiguos automáticamente
CREATE OR REPLACE FUNCTION clean_old_backups()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Eliminar backups más antiguos de 30 días
    DELETE FROM backup_history 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Crear función para obtener estadísticas de backups
CREATE OR REPLACE FUNCTION get_backup_stats()
RETURNS TABLE (
    total_backups BIGINT,
    total_size BIGINT,
    full_backups BIGINT,
    incremental_backups BIGINT,
    average_size NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_backups,
        COALESCE(SUM(file_size), 0) as total_size,
        COUNT(*) FILTER (WHERE backup_type = 'full') as full_backups,
        COUNT(*) FILTER (WHERE backup_type = 'incremental') as incremental_backups,
        COALESCE(AVG(file_size), 0) as average_size
    FROM backup_history
    WHERE created_at >= NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar timestamp de modificación en productos y categorías
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a la tabla productos si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_productos_updated_at') THEN
        CREATE TRIGGER update_productos_updated_at
            BEFORE UPDATE ON productos
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Aplicar trigger a la tabla categorias si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categorias_updated_at') THEN
        CREATE TRIGGER update_categorias_updated_at
            BEFORE UPDATE ON categorias
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
