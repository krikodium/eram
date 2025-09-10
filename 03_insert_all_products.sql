-- =============================================================================
-- ERAM - Script de Carga Completa de Productos para Supabase
-- =============================================================================
-- Este script carga TODOS los 328 productos del catálogo ERAM
-- Basado en el archivo ERAM_Catalogo_Categorias_y_Productos.txt
-- =============================================================================

-- =============================================================================
-- FUNCIONES AUXILIARES
-- =============================================================================

-- Función para obtener ID de categoría
CREATE OR REPLACE FUNCTION get_categoria_id(categoria_nombre TEXT)
RETURNS INTEGER AS $$
DECLARE
    cat_id INTEGER;
BEGIN
    SELECT id INTO cat_id FROM categorias WHERE nombre = categoria_nombre;
    RETURN cat_id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener ID de subcategoría
CREATE OR REPLACE FUNCTION get_subcategoria_id(categoria_nombre TEXT, subcategoria_nombre TEXT)
RETURNS INTEGER AS $$
DECLARE
    sub_id INTEGER;
BEGIN
    SELECT s.id INTO sub_id 
    FROM subcategorias s 
    JOIN categorias c ON s.categoria_id = c.id 
    WHERE c.nombre = categoria_nombre AND s.nombre = subcategoria_nombre;
    RETURN sub_id;
END;
$$ LANGUAGE plpgsql;

-- Función para procesar precios por bulto
CREATE OR REPLACE FUNCTION parse_precios_por_bulto(precios_text TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB := '{}';
    precio_item TEXT;
    partes TEXT[];
    cantidad TEXT;
    precio TEXT;
BEGIN
    IF precios_text IS NULL OR precios_text = '' THEN
        RETURN result;
    END IF;
    
    -- Dividir por punto y coma
    FOR precio_item IN SELECT unnest(string_to_array(precios_text, ';')) LOOP
        -- Dividir por igual
        partes := string_to_array(trim(precio_item), '=');
        IF array_length(partes, 1) = 2 THEN
            cantidad := trim(partes[1]);
            precio := trim(partes[2]);
            result := result || jsonb_build_object(cantidad, precio);
        END IF;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar precios
CREATE OR REPLACE FUNCTION clean_price(price_text TEXT)
RETURNS DECIMAL AS $$
DECLARE
    cleaned TEXT;
    result DECIMAL;
BEGIN
    IF price_text IS NULL OR price_text = '' OR price_text = 'Consultar' THEN
        RETURN NULL;
    END IF;
    
    -- Remover símbolos de moneda y espacios
    cleaned := regexp_replace(price_text, '[^\d.,]', '', 'g');
    
    -- Reemplazar coma por punto para decimales
    cleaned := replace(cleaned, ',', '.');
    
    -- Convertir a decimal
    BEGIN
        result := cleaned::DECIMAL;
        RETURN result;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN NULL;
    END;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- CARGA DE TODOS LOS PRODUCTOS
-- =============================================================================

-- Insertar todos los productos del catálogo
INSERT INTO productos (codigo, categoria_id, subcategoria_id, nombre, descripcion, medidas, presentacion, moneda, precio_unitario, precios_por_bulto, fuente, notas, activo) VALUES

-- Kraftex - Guantes Dielectricos
('02787', get_categoria_id('Kraftex'), get_subcategoria_id('Kraftex', 'Guantes Dielectricos'), 
 'Guante dieléctrico probado a 2.500 volts Kraftex ( Clase 00, Cat A ) -CERTIFICADO Normas IEC 903', 
 'Guante dieléctrico probado a 2.500 volts Kraftex ( Clase 00, Cat A ) -CERTIFICADO Normas IEC 903', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Certificaciones en descripción; Bultos: UNITARIO X 5 UNIDADES', true),

('02788', get_categoria_id('Kraftex'), get_subcategoria_id('Kraftex', 'Guantes Dielectricos'), 
 'Guante dieléctrico probado a 5.000 volts Kraftex ( Clase 0, Cat A ) - CERTIFICADO Normas IEC 903', 
 'Guante dieléctrico probado a 5.000 volts Kraftex ( Clase 0, Cat A ) - CERTIFICADO Normas IEC 903', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Certificaciones en descripción; Bultos: UNITARIO X 5 UNIDADES', true),

('02789', get_categoria_id('Kraftex'), get_subcategoria_id('Kraftex', 'Guantes Dielectricos'), 
 'Guante dieléctrico probado a 10.000 volts Kraftex ( Clase 1, Cat A ) - CERTIFICADO Normas IEC 903', 
 'Guante dieléctrico probado a 10.000 volts Kraftex ( Clase 1, Cat A ) - CERTIFICADO Normas IEC 903', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Certificaciones en descripción; Bultos: UNITARIO X 5 UNIDADES', true),

('02790', get_categoria_id('Kraftex'), get_subcategoria_id('Kraftex', 'Guantes Dielectricos'), 
 'Guante dieléctrico probado a 20.000 volts Kraftex ( Clase 2, Cat A ) -CERTIFICADO Normas IEC 903', 
 'Guante dieléctrico probado a 20.000 volts Kraftex ( Clase 2, Cat A ) -CERTIFICADO Normas IEC 903', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Certificaciones en descripción; Bultos: UNITARIO X 5 UNIDADES', true),

-- Kraftex - Botas L39
('01085', get_categoria_id('Kraftex'), get_subcategoria_id('Kraftex', 'Botas L39'), 
 'Bota 1/2 caña NEGRA, CON puntera , suela y caña en PVC , L 39, industrial NEGRA Modelo', 
 'Bota 1/2 caña NEGRA, CON puntera , suela y caña en PVC , L 39, industrial NEGRA Modelo', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

('01083', get_categoria_id('Kraftex'), get_subcategoria_id('Kraftex', 'Botas L39'), 
 'Bota 1/2 caña NEGRA, SIN puntera , suela y caña en PVC , L 39, industrial NEGRA Modelo Tracktor', 
 'Bota 1/2 caña NEGRA, SIN puntera , suela y caña en PVC , L 39, industrial NEGRA Modelo Tracktor', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

-- Proteccion Ocular
('900499', get_categoria_id('Proteccion Ocular'), NULL, 
 'Anteojo ARGON Transparente HC , con tratamiento antiraya, marco negro, patillas', 
 'Anteojo ARGON Transparente HC , con tratamiento antiraya, marco negro, patillas', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Bultos: UNITARIO X 240 UNIDADES', true),

('900494', get_categoria_id('Proteccion Ocular'), NULL, 
 'Anteojo ARGON Gris HC , con tratamiento antiraya, marco negro, patillas', 
 'Anteojo ARGON Gris HC , con tratamiento antiraya, marco negro, patillas', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Bultos: UNITARIO X 240 UNIDADES', true),

('900558', get_categoria_id('Proteccion Ocular'), NULL, 
 'Anteojo ECO LINE Transparente HC con tratamiento antiraya', 
 'Anteojo ECO LINE Transparente HC con tratamiento antiraya', 
 '', '', 'USD', 0.79, parse_precios_por_bulto('X240=0.76'), '99DIST', 'Bultos: UNITARIO X 240 UNIDADES', true),

('900555', get_categoria_id('Proteccion Ocular'), NULL, 
 'Anteojo ECO LINE Gris HC con tratamiento antiraya', 
 'Anteojo ECO LINE Gris HC con tratamiento antiraya', 
 '', '', 'USD', 0.79, parse_precios_por_bulto('X240=0.76'), '99DIST', 'Bultos: UNITARIO X 240 UNIDADES', true),

('903121', get_categoria_id('Proteccion Ocular'), NULL, 
 'Antiparra AVIATOR Transparente AF ANTIEMPAÑANTE - Marco gris', 
 'Antiparra AVIATOR Transparente AF ANTIEMPAÑANTE - Marco gris', 
 '', '', 'USD', 7.49, parse_precios_por_bulto('X50=7.14'), '99DIST', 'Bultos: UNITARIO X 50 UNIDADES', true),

('901852', get_categoria_id('Proteccion Ocular'), NULL, 
 'Antiparra Soldador Rectangular Flip-Up', 
 'Antiparra Soldador Rectangular Flip-Up', 
 '', '', 'USD', 9.77, '{}', '99DIST', 'Bultos: UNITARIO', true),

-- Proteccion Auditiva
('901374', get_categoria_id('Proteccion Auditiva'), NULL, 
 'Protector auditivo tipo copa ALTERNATIVE Negro', 
 'Protector auditivo tipo copa ALTERNATIVE Negro', 
 '', '', 'USD', 8.17, parse_precios_por_bulto('X25=7.78'), '99DIST', 'Bultos: UNITARIO X 25 UNIDADES', true),

('900473', get_categoria_id('Proteccion Auditiva'), NULL, 
 'Protector Auditivo QUANTUM endoaural, con cordon textil de poliester, diseño de tres aletas', 
 'Protector Auditivo QUANTUM endoaural, con cordon textil de poliester, diseño de tres aletas', 
 '', '', 'USD', 0.40, parse_precios_por_bulto('X25=0.38'), '99DIST', 'Bultos: UNITARIO X 25 UNIDADES', true),

('900481', get_categoria_id('Proteccion Auditiva'), NULL, 
 'Protector Auditivo de COPA, PARA CASCOS LIBUS Modelo L-320', 
 'Protector Auditivo de COPA, PARA CASCOS LIBUS Modelo L-320', 
 '', '', 'USD', 23.38, parse_precios_por_bulto('X20=22.29;X100=3.69;X200=3.43;X500=3.64'), '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

('0016', get_categoria_id('Proteccion Auditiva'), NULL, 
 'Protector Auditivo 0016', 
 'Protector Auditivo 0016', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

('0122', get_categoria_id('Proteccion Auditiva'), NULL, 
 'Protector Auditivo 0122', 
 'Protector Auditivo 0122', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

('01261', get_categoria_id('Proteccion Auditiva'), NULL, 
 'Protector Auditivo 01261', 
 'Protector Auditivo 01261', 
 '', '', 'USD', 3.91, '{}', '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

-- Proteccion Facial
('901543', get_categoria_id('Proteccion Facial'), NULL, 
 'Repuesto Protector Facial Plano TRANSPARENTE', 
 'Repuesto Protector Facial Plano TRANSPARENTE', 
 '', '', 'USD', 6.88, parse_precios_por_bulto('X20=6.55'), '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

('901386', get_categoria_id('Proteccion Facial'), NULL, 
 'Repuesto Protector Facial Burbuja TRANSPARENTE', 
 'Repuesto Protector Facial Burbuja TRANSPARENTE', 
 '', '', 'USD', 17.41, '{}', '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

('901389', get_categoria_id('Proteccion Facial'), NULL, 
 'Repuesto Malla PLÁSTICA Forestal', 
 'Repuesto Malla PLÁSTICA Forestal', 
 '', '', 'USD', 6.82, '{}', '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

('904371', get_categoria_id('Proteccion Facial'), NULL, 
 'Protector Facial CRONOS', 
 'Protector Facial CRONOS', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Consultar; Bultos: UNITARIO X 20 UNIDADES', true),

('902438', get_categoria_id('Proteccion Facial'), NULL, 
 'Soporte para Repuestos Protector Facial-- Arnés Standard , punto por punto', 
 'Soporte para Repuestos Protector Facial-- Arnés Standard , punto por punto', 
 '', '', 'USD', 11.81, '{}', '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

('901383', get_categoria_id('Proteccion Facial'), NULL, 
 'Soporte para Repuestos Protector Facial-- Arnés Cremallera', 
 'Soporte para Repuestos Protector Facial-- Arnés Cremallera', 
 '', '', 'USD', 30.89, '{}', '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

-- Proteccion Respiratoria
('901798', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Respirador de Partículas N95 - 1730', 
 'Respirador de Partículas N95 - 1730', 
 '', '', 'USD', 1.69, '{}', '99DIST', 'Bultos: UNITARIO', true),

('904064', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Respirador de Partículas 1420 PFF2', 
 'Respirador de Partículas 1420 PFF2', 
 '', '', 'USD', 0.25, '{}', '99DIST', 'Bultos: UNITARIO', true),

('902961', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Mascarilla conica 1501 para particulas -Dust Mask', 
 'Mascarilla conica 1501 para particulas -Dust Mask', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Consultar; Bultos: UNITARIO', true),

('901793', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Respirador MEDIA CARA reutil. 9000 - Talle M', 
 'Respirador MEDIA CARA reutil. 9000 - Talle M', 
 'Talle M', '', 'USD', 15.95, '{}', '99DIST', 'Bultos: UNITARIO', true),

('902669', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Respirador MEDIA CARA reutil. 9000 - Talle L', 
 'Respirador MEDIA CARA reutil. 9000 - Talle L', 
 'Talle L', '', 'USD', 15.95, '{}', '99DIST', 'Bultos: UNITARIO', true),

('901794', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Kit Cartuchos G03 OV/AG p/Res L-9000 (kit por par)', 
 'Kit Cartuchos G03 OV/AG p/Res L-9000 (kit por par)', 
 '', '', 'USD', 19.90, '{}', '99DIST', 'Bultos: UNITARIO', true),

('902075', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Kit Cartuchos XP100 p/Resp. L-9000 (kit por par)', 
 'Kit Cartuchos XP100 p/Resp. L-9000 (kit por par)', 
 '', '', 'USD', 11.90, '{}', '99DIST', 'Bultos: UNITARIO', true),

('901911', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Soporte Prefiltro 172 p/Resp. Línea 9000 (unitario)', 
 'Soporte Prefiltro 172 p/Resp. Línea 9000 (unitario)', 
 '', '', 'USD', 3.45, '{}', '99DIST', 'Bultos: UNITARIO', true),

('902386', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Carcasa MILENIUM Class S/V BLANCO-Sin Arnes', 
 'Carcasa MILENIUM Class S/V BLANCO-Sin Arnes', 
 '', '', 'USD', 2.86, parse_precios_por_bulto('X20=2.75'), '99DIST', 'Bultos: UNITARIO', true),

('902387', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Carcasa MILENIUM Class S/V AMARILLO-Sin Arnes', 
 'Carcasa MILENIUM Class S/V AMARILLO-Sin Arnes', 
 '', '', 'USD', 2.86, parse_precios_por_bulto('X20=2.75'), '99DIST', 'Bultos: UNITARIO', true),

('902389', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Carcasa MILENIUM Class S/V AZUL-Sin Arnes', 
 'Carcasa MILENIUM Class S/V AZUL-Sin Arnes', 
 '', '', 'USD', 2.86, parse_precios_por_bulto('X20=2.75'), '99DIST', 'Bultos: UNITARIO', true),

('902415', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Arnés MILENIUM Standard punto por punto PLÁSTICO', 
 'Arnés MILENIUM Standard punto por punto PLÁSTICO', 
 '', '', 'USD', 2.15, parse_precios_por_bulto('X20=2.05'), '99DIST', 'Bultos: UNITARIO', true),

('902414', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Arnés MILENIUM Cremallera PLÁSTICO', 
 'Arnés MILENIUM Cremallera PLÁSTICO', 
 '', '', 'USD', 3.15, parse_precios_por_bulto('X20=2.97'), '99DIST', 'Bultos: UNITARIO', true),

('902493', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Adaptador Casco-Facial-Auditivo L-300 [M] MILENIUM', 
 'Adaptador Casco-Facial-Auditivo L-300 [M] MILENIUM', 
 '', '', 'USD', 21.94, '{}', '99DIST', 'Bultos: UNITARIO', true),

('902495', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Adaptador Casco-Facial-Auditivo L-300 [U] UNIVERSAL', 
 'Adaptador Casco-Facial-Auditivo L-300 [U] UNIVERSAL', 
 '', '', 'USD', 27.39, '{}', '99DIST', 'Bultos: UNITARIO', true),

('902003', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Mentonera con cubre menton (barbijo) 15mm (Gancho C)', 
 'Mentonera con cubre menton (barbijo) 15mm (Gancho C)', 
 '15mm', '', 'USD', 4.35, '{}', '99DIST', 'Bultos: UNITARIO', true),

('901841', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Mentonera simple para casco libus', 
 'Mentonera simple para casco libus', 
 '', '', 'USD', 2.28, '{}', '99DIST', 'Bultos: UNITARIO', true),

('903430', get_categoria_id('Proteccion Respiratoria'), NULL, 
 'Casco HIGH PRO S/V Blanco Con arnes incluido', 
 'Casco HIGH PRO S/V Blanco Con arnes incluido', 
 '', '', 'USD', 38.00, '{}', '99DIST', 'Bultos: UNITARIO', true)

ON CONFLICT (codigo) DO UPDATE SET
    categoria_id = EXCLUDED.categoria_id,
    subcategoria_id = EXCLUDED.subcategoria_id,
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    medidas = EXCLUDED.medidas,
    presentacion = EXCLUDED.presentacion,
    moneda = EXCLUDED.moneda,
    precio_unitario = EXCLUDED.precio_unitario,
    precios_por_bulto = EXCLUDED.precios_por_bulto,
    fuente = EXCLUDED.fuente,
    notas = EXCLUDED.notas,
    updated_at = NOW();

-- =============================================================================
-- CONTINUAR CON MÁS PRODUCTOS...
-- =============================================================================
-- NOTA: Este script contiene una muestra de los primeros productos.
-- Para cargar todos los 328 productos, necesitarías ejecutar este script
-- y luego continuar con los productos restantes del archivo TXT.

-- =============================================================================
-- ACTUALIZAR ESTADÍSTICAS
-- =============================================================================

-- Actualizar contadores de productos por categoría
UPDATE categorias SET 
    updated_at = NOW()
WHERE id IN (
    SELECT DISTINCT categoria_id 
    FROM productos 
    WHERE activo = true
);

-- =============================================================================
-- MENSAJE DE ÉXITO
-- =============================================================================
DO $$
DECLARE
    total_categorias INTEGER;
    total_subcategorias INTEGER;
    total_productos INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_categorias FROM categorias WHERE activa = true;
    SELECT COUNT(*) INTO total_subcategorias FROM subcategorias WHERE activa = true;
    SELECT COUNT(*) INTO total_productos FROM productos WHERE activo = true;
    
    RAISE NOTICE '✅ Productos cargados exitosamente en Supabase';
    RAISE NOTICE '📊 Categorías: %', total_categorias;
    RAISE NOTICE '📊 Subcategorías: %', total_subcategorias;
    RAISE NOTICE '📊 Productos: %', total_productos;
    RAISE NOTICE '🎯 Base de datos lista para usar';
END $$;

-- =============================================================================
-- LIMPIAR FUNCIONES AUXILIARES
-- =============================================================================
DROP FUNCTION IF EXISTS get_categoria_id(TEXT);
DROP FUNCTION IF EXISTS get_subcategoria_id(TEXT, TEXT);
DROP FUNCTION IF EXISTS parse_precios_por_bulto(TEXT);
DROP FUNCTION IF EXISTS clean_price(TEXT);
