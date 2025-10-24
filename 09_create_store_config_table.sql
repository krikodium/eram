-- 09_create_store_config_table.sql - Crear tabla de configuración de la tienda
-- Ejecutar este script en Supabase SQL Editor

-- Crear tabla de configuración de la tienda
CREATE TABLE IF NOT EXISTS store_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Información general
  store_name VARCHAR(255) DEFAULT 'Mi Tienda',
  store_tagline VARCHAR(500),
  store_description TEXT,
  currency VARCHAR(10) DEFAULT 'ARS',
  timezone VARCHAR(50) DEFAULT 'America/Argentina/Buenos_Aires',
  
  -- Identidad visual
  logo_url TEXT,
  favicon_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  secondary_color VARCHAR(7) DEFAULT '#10B981',
  
  -- Información de contacto
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  whatsapp VARCHAR(50),
  address TEXT,
  
  -- Redes sociales
  social_facebook TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  social_linkedin TEXT,
  social_youtube TEXT,
  
  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  
  -- Configuración avanzada
  maintenance_mode BOOLEAN DEFAULT false,
  analytics_enabled BOOLEAN DEFAULT false,
  google_analytics_id VARCHAR(50),
  custom_head_code TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_store_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_store_config_updated_at ON store_config;
CREATE TRIGGER trigger_update_store_config_updated_at
  BEFORE UPDATE ON store_config
  FOR EACH ROW
  EXECUTE FUNCTION update_store_config_updated_at();

-- Insertar configuración por defecto
INSERT INTO store_config (
  store_name,
  store_tagline,
  store_description,
  currency,
  timezone,
  primary_color,
  secondary_color,
  contact_email,
  contact_phone,
  whatsapp,
  address,
  seo_title,
  seo_description,
  seo_keywords,
  maintenance_mode,
  analytics_enabled
) VALUES (
  'ERAM',
  'Equipos de Protección Personal',
  'Especialistas en equipos de protección personal y seguridad industrial. Ofrecemos productos de alta calidad para proteger a los trabajadores en diferentes industrias.',
  'ARS',
  'America/Argentina/Buenos_Aires',
  '#3B82F6',
  '#10B981',
  'contacto@eram.com',
  '+54 11 1234-5678',
  '+54 9 11 1234-5678',
  'Buenos Aires, Argentina',
  'ERAM - Equipos de Protección Personal',
  'Especialistas en equipos de protección personal y seguridad industrial. Productos de alta calidad para proteger a los trabajadores.',
  'protección personal, seguridad industrial, equipos de seguridad, EPP, cascos, guantes, calzado de seguridad',
  false,
  false
) ON CONFLICT DO NOTHING;

-- Comentarios sobre la tabla
COMMENT ON TABLE store_config IS 'Configuración general de la tienda y sitio web';
COMMENT ON COLUMN store_config.store_name IS 'Nombre de la tienda/empresa';
COMMENT ON COLUMN store_config.store_tagline IS 'Eslogan o descripción corta de la tienda';
COMMENT ON COLUMN store_config.store_description IS 'Descripción completa de la tienda';
COMMENT ON COLUMN store_config.currency IS 'Moneda principal de la tienda';
COMMENT ON COLUMN store_config.timezone IS 'Zona horaria de la tienda';
COMMENT ON COLUMN store_config.logo_url IS 'URL del logo de la tienda';
COMMENT ON COLUMN store_config.favicon_url IS 'URL del favicon de la tienda';
COMMENT ON COLUMN store_config.primary_color IS 'Color primario de la marca (hex)';
COMMENT ON COLUMN store_config.secondary_color IS 'Color secundario de la marca (hex)';
COMMENT ON COLUMN store_config.contact_email IS 'Email de contacto principal';
COMMENT ON COLUMN store_config.contact_phone IS 'Teléfono de contacto';
COMMENT ON COLUMN store_config.whatsapp IS 'Número de WhatsApp';
COMMENT ON COLUMN store_config.address IS 'Dirección física de la tienda';
COMMENT ON COLUMN store_config.social_facebook IS 'URL de Facebook';
COMMENT ON COLUMN store_config.social_instagram IS 'URL de Instagram';
COMMENT ON COLUMN store_config.social_twitter IS 'URL de Twitter';
COMMENT ON COLUMN store_config.social_linkedin IS 'URL de LinkedIn';
COMMENT ON COLUMN store_config.social_youtube IS 'URL de YouTube';
COMMENT ON COLUMN store_config.seo_title IS 'Título SEO para el sitio';
COMMENT ON COLUMN store_config.seo_description IS 'Meta descripción para SEO';
COMMENT ON COLUMN store_config.seo_keywords IS 'Palabras clave para SEO';
COMMENT ON COLUMN store_config.maintenance_mode IS 'Modo mantenimiento activado';
COMMENT ON COLUMN store_config.analytics_enabled IS 'Analytics habilitado';
COMMENT ON COLUMN store_config.google_analytics_id IS 'ID de Google Analytics';
COMMENT ON COLUMN store_config.custom_head_code IS 'Código personalizado para el head';
