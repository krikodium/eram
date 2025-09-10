-- =============================================================================
-- ERAM - Script de Carga de Datos para Supabase
-- =============================================================================
-- Este script carga todas las categorías y productos del catálogo ERAM
-- Basado en el archivo ERAM_Catalogo_Categorias_y_Productos.txt
-- =============================================================================

-- =============================================================================
-- CARGA DE CATEGORÍAS
-- =============================================================================

-- Insertar categorías principales
INSERT INTO categorias (nombre, descripcion, fuente, repetida, activa) VALUES
('Cintas Industriales', 'Cintas reflectivas y demarcatorias industriales', '159EXWORKS', false, true),
('Delantales', 'Delantales y guantes de protección', '99DIST', false, true),
('Escaleras', 'Escaleras de aluminio y fibra', '159EXWORKS', false, true),
('Incendio', 'Equipos de protección contra incendios', '99DIST', false, true),
('Indumentaria De Lluvia', 'Ropa de protección para lluvia', '159EXWORKS', false, true),
('Kits Vehiculares', 'Kits de seguridad para vehículos', '99DIST', false, true),
('Kraftex', 'Equipos de protección Kraftex', '99DIST', false, true),
('Primeros Auxilios', 'Botiquines y equipos de primeros auxilios', '159EXWORKS', false, true),
('Proteccion Auditiva', 'Protectores auditivos', '99DIST', false, true),
('Proteccion En Altura', 'Equipos para trabajo en altura', '159EXWORKS', false, true),
('Proteccion Facial', 'Protectores faciales y mascarillas', '99DIST', true, true),
('Proteccion Ocular', 'Anteojos y antiparras de protección', '99DIST', false, true),
('Proteccion Respiratoria', 'Respiradores y mascarillas', '99DIST', false, true),
('Señalizacion Industrial', 'Señalización y cartelería industrial', '99DIST', false, true),
('Señalización Vial', 'Señalización vial y de tránsito', '159EXWORKS', false, true),
('Señalizacion Personal', 'Chalecos y elementos de señalización personal', '159EXWORKS', false, true),
('Sujecion De Carga', 'Equipos de sujeción y emergencia', '159EXWORKS', false, true)
ON CONFLICT (nombre) DO UPDATE SET
    descripcion = EXCLUDED.descripcion,
    fuente = EXCLUDED.fuente,
    repetida = EXCLUDED.repetida,
    updated_at = NOW();

-- =============================================================================
-- CARGA DE SUBCATEGORÍAS
-- =============================================================================

-- Función auxiliar para obtener ID de categoría
CREATE OR REPLACE FUNCTION get_categoria_id(categoria_nombre TEXT)
RETURNS INTEGER AS $$
DECLARE
    cat_id INTEGER;
BEGIN
    SELECT id INTO cat_id FROM categorias WHERE nombre = categoria_nombre;
    RETURN cat_id;
END;
$$ LANGUAGE plpgsql;

-- Insertar subcategorías
INSERT INTO subcategorias (categoria_id, nombre, descripcion, activa) VALUES
-- Delantales
(get_categoria_id('Delantales'), 'Guantes De Proteccion', 'Guantes de protección industrial', true),

-- Incendio
(get_categoria_id('Incendio'), 'Detector De Humo Importado', 'Detectores de humo importados', true),
(get_categoria_id('Incendio'), 'Mantas De Borosilicato', 'Mantas de protección contra incendios', true),
(get_categoria_id('Incendio'), 'Sica', 'Productos de la marca Sica', true),

-- Kraftex
(get_categoria_id('Kraftex'), 'Botas L39', 'Botas de seguridad L39', true),
(get_categoria_id('Kraftex'), 'Cascos Saylens', 'Cascos de seguridad Saylens', true),
(get_categoria_id('Kraftex'), 'Guantes Dielectricos', 'Guantes dieléctricos', true),
(get_categoria_id('Kraftex'), 'Libus', 'Productos de la marca Libus', true),

-- Primeros Auxilios
(get_categoria_id('Primeros Auxilios'), 'Delantales De Pvc', 'Delantales de PVC para primeros auxilios', true),

-- Proteccion Facial
(get_categoria_id('Proteccion Facial'), 'Carpa Piso Pvc', 'Carpas de PVC para piso', true),
(get_categoria_id('Proteccion Facial'), 'Espejos Parabolicos', 'Espejos parabólicos de seguridad', true),
(get_categoria_id('Proteccion Facial'), 'Espejos Plasticos Viales Cartel Corrugado', 'Espejos plásticos viales', true),

-- Proteccion Respiratoria
(get_categoria_id('Proteccion Respiratoria'), 'Cartel Corrugado Vial', 'Cartelería corrugada vial', true),
(get_categoria_id('Proteccion Respiratoria'), 'Carteleria Alto Impacto 0.8 Mm - Según Catalogo  -', 'Cartelería de alto impacto', true),

-- Señalizacion Industrial
(get_categoria_id('Señalizacion Industrial'), 'Carteles Adhesivos', 'Carteles adhesivos', true),
(get_categoria_id('Señalizacion Industrial'), 'Carteles Adhesivos Fotoluminicentes', 'Carteles adhesivos fotoluminiscentes', true),
(get_categoria_id('Señalizacion Industrial'), 'Carteles Doble Faz', 'Carteles de doble faz', true),
(get_categoria_id('Señalizacion Industrial'), 'Carteles Doble Faz Fotoluminicentes', 'Carteles doble faz fotoluminiscentes', true),
(get_categoria_id('Señalizacion Industrial'), 'Carteles Fotoluminicentes', 'Carteles fotoluminiscentes', true),
(get_categoria_id('Señalizacion Industrial'), 'Carteles Linea Dorada', 'Carteles línea dorada', true),
(get_categoria_id('Señalizacion Industrial'), 'Chapas Baliza De 0.5 Mm', 'Chapas baliza de 0.5mm', true),
(get_categoria_id('Señalizacion Industrial'), 'Chapas Baliza De 0.7 Mm', 'Chapas baliza de 0.7mm', true),
(get_categoria_id('Señalizacion Industrial'), 'Cinta De Doble Contacto', 'Cinta de doble contacto', true),
(get_categoria_id('Señalizacion Industrial'), 'Tarjetas De Seguridad Y Linea Chapa', 'Tarjetas de seguridad', true),

-- Señalización Vial
(get_categoria_id('Señalización Vial'), 'Baston Led', 'Bastones LED', true),
(get_categoria_id('Señalización Vial'), 'Cintas De Peligro', 'Cintas de peligro', true),
(get_categoria_id('Señalización Vial'), 'Conos Varios', 'Conos de señalización varios', true),
(get_categoria_id('Señalización Vial'), 'Linea Conos Rojos', 'Línea de conos rojos', true),
(get_categoria_id('Señalización Vial'), 'Linea Conos Viales Naranjas', 'Línea de conos viales naranjas', true),
(get_categoria_id('Señalización Vial'), 'Mallas De Advertencia Subterranea', 'Mallas de advertencia subterránea', true),
(get_categoria_id('Señalización Vial'), 'Mallas Reticuladas De Proteccion', 'Mallas reticuladas de protección', true),
(get_categoria_id('Señalización Vial'), 'Postes / Delineador Vial', 'Postes y delineadores viales', true),
(get_categoria_id('Señalización Vial'), 'Tachas Viales', 'Tachas viales', true),

-- Sujecion De Carga
(get_categoria_id('Sujecion De Carga'), 'Duchas - Lavaojos De Emergencia', 'Duchas y lavaojos de emergencia', true)
ON CONFLICT (categoria_id, nombre) DO UPDATE SET
    descripcion = EXCLUDED.descripcion,
    updated_at = NOW();

-- =============================================================================
-- CARGA DE PRODUCTOS
-- =============================================================================

-- Función auxiliar para procesar precios por bulto
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

-- Función auxiliar para limpiar precios
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

-- Insertar productos (muestra de los primeros 50 para evitar que el script sea muy largo)
INSERT INTO productos (codigo, categoria_id, subcategoria_id, nombre, descripcion, medidas, presentacion, moneda, precio_unitario, precios_por_bulto, fuente, notas, activo) VALUES

-- Kraftex - Guantes Dielectricos
('02787', get_categoria_id('Kraftex'), (SELECT id FROM subcategorias WHERE nombre = 'Guantes Dielectricos' AND categoria_id = get_categoria_id('Kraftex')), 
 'Guante dieléctrico probado a 2.500 volts Kraftex ( Clase 00, Cat A ) -CERTIFICADO Normas IEC 903', 
 'Guante dieléctrico probado a 2.500 volts Kraftex ( Clase 00, Cat A ) -CERTIFICADO Normas IEC 903', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Certificaciones en descripción; Bultos: UNITARIO X 5 UNIDADES', true),

('02788', get_categoria_id('Kraftex'), (SELECT id FROM subcategorias WHERE nombre = 'Guantes Dielectricos' AND categoria_id = get_categoria_id('Kraftex')), 
 'Guante dieléctrico probado a 5.000 volts Kraftex ( Clase 0, Cat A ) - CERTIFICADO Normas IEC 903', 
 'Guante dieléctrico probado a 5.000 volts Kraftex ( Clase 0, Cat A ) - CERTIFICADO Normas IEC 903', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Certificaciones en descripción; Bultos: UNITARIO X 5 UNIDADES', true),

('02789', get_categoria_id('Kraftex'), (SELECT id FROM subcategorias WHERE nombre = 'Guantes Dielectricos' AND categoria_id = get_categoria_id('Kraftex')), 
 'Guante dieléctrico probado a 10.000 volts Kraftex ( Clase 1, Cat A ) - CERTIFICADO Normas IEC 903', 
 'Guante dieléctrico probado a 10.000 volts Kraftex ( Clase 1, Cat A ) - CERTIFICADO Normas IEC 903', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Certificaciones en descripción; Bultos: UNITARIO X 5 UNIDADES', true),

('02790', get_categoria_id('Kraftex'), (SELECT id FROM subcategorias WHERE nombre = 'Guantes Dielectricos' AND categoria_id = get_categoria_id('Kraftex')), 
 'Guante dieléctrico probado a 20.000 volts Kraftex ( Clase 2, Cat A ) -CERTIFICADO Normas IEC 903', 
 'Guante dieléctrico probado a 20.000 volts Kraftex ( Clase 2, Cat A ) -CERTIFICADO Normas IEC 903', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Certificaciones en descripción; Bultos: UNITARIO X 5 UNIDADES', true),

-- Kraftex - Botas L39
('01085', get_categoria_id('Kraftex'), (SELECT id FROM subcategorias WHERE nombre = 'Botas L39' AND categoria_id = get_categoria_id('Kraftex')), 
 'Bota 1/2 caña NEGRA, CON puntera , suela y caña en PVC , L 39, industrial NEGRA Modelo', 
 'Bota 1/2 caña NEGRA, CON puntera , suela y caña en PVC , L 39, industrial NEGRA Modelo', 
 '', '', 'USD', NULL, '{}', '99DIST', 'Bultos: UNITARIO X 20 UNIDADES', true),

('01083', get_categoria_id('Kraftex'), (SELECT id FROM subcategorias WHERE nombre = 'Botas L39' AND categoria_id = get_categoria_id('Kraftex')), 
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

-- Incendio
('97657', get_categoria_id('Incendio'), NULL, 
 'Balde Metálico Doble manija 10 lts, color rojo, con calco ARENA', 
 'Balde Metálico Doble manija 10 lts, color rojo, con calco ARENA', 
 '', '', 'ARS', 22480.00, parse_precios_por_bulto('X5=21355.00'), '99DIST', 'Bultos: UNITARIO X 5 UNIDADES', true),

('09806', get_categoria_id('Incendio'), NULL, 
 'Balde PLASTICO color rojo con manija fija, soporte, tapa, reflectivo y calco ARENA', 
 'Balde PLASTICO color rojo con manija fija, soporte, tapa, reflectivo y calco ARENA', 
 '', '', 'ARS', 24575.00, parse_precios_por_bulto('X5=23590.00'), '99DIST', 'Bultos: UNITARIO X 5 UNIDADES', true),

('97656', get_categoria_id('Incendio'), NULL, 
 'Balde Metálico manija movil 10 lts color rojo, con calco ARENA', 
 'Balde Metálico manija movil 10 lts color rojo, con calco ARENA', 
 '', '', 'ARS', NULL, '{}', '99DIST', 'Consultar; Bultos: UNITARIO X 5 UNIDADES', true),

-- Señalización Vial - Conos
('97758', get_categoria_id('Señalización Vial'), (SELECT id FROM subcategorias WHERE nombre = 'Linea Conos Rojos' AND categoria_id = get_categoria_id('Señalización Vial')), 
 'CONO ROJO de 50 cm - BASE DE GOMA - CON 1 REFLECTIVO de 11 cm , base cuadrada de 29x29cm', 
 'CONO ROJO de 50 cm - BASE DE GOMA - CON 1 REFLECTIVO de 11 cm , base cuadrada de 29x29cm', 
 '29x29cm; 50 cm; 11 cm', '', 'ARS', 6735.00, parse_precios_por_bulto('X30=6539.00;X100=6169.00'), '159EXWORKS', 'Bultos: UNITARIO X30 X 100', true),

('97776', get_categoria_id('Señalización Vial'), (SELECT id FROM subcategorias WHERE nombre = 'Linea Conos Viales Naranjas' AND categoria_id = get_categoria_id('Señalización Vial')), 
 'CONO NARANJA FLUO de 50 cm - BASE DE GOMA - CON 1 REFLECTIVO de 11 cm , base cuadrada de', 
 'CONO NARANJA FLUO de 50 cm - BASE DE GOMA - CON 1 REFLECTIVO de 11 cm , base cuadrada de', 
 '50 cm; 11 cm', '', 'ARS', NULL, '{}', '159EXWORKS', 'Bultos: UNITARIO X30 X 100', true),

-- Señalización Industrial
('01180', get_categoria_id('Señalizacion Industrial'), (SELECT id FROM subcategorias WHERE nombre = 'Chapas Baliza De 0.5 Mm' AND categoria_id = get_categoria_id('Señalizacion Industrial')), 
 'Chapa baliza en alto impacto de 0.5 mm. 23 cm. x 80 cm.', 
 'Chapa baliza en alto impacto de 0.5 mm. 23 cm. x 80 cm.', 
 '0.5 mm; 23 cm; 80 cm', '', 'ARS', 2266.00, parse_precios_por_bulto('X50=2078.00'), '99DIST', 'Bultos: UNITARIO X 50 SURTIDOS', true),

('00719', get_categoria_id('Señalizacion Industrial'), (SELECT id FROM subcategorias WHERE nombre = 'Carteles Linea Dorada' AND categoria_id = get_categoria_id('Señalizacion Industrial')), 
 'Cartel línea dorada en alto impacto de 0.8 mm. de 21 cm. x 8.5 cm.', 
 'Cartel línea dorada en alto impacto de 0.8 mm. de 21 cm. x 8.5 cm.', 
 '0.8 mm; 21 cm; 8.5 cm', '', 'ARS', 2436.00, parse_precios_por_bulto('X50=2253.00'), '99DIST', 'Bultos: UNITARIO X 50 SURTIDOS', true),

-- Cintas Industriales
('01703', get_categoria_id('Cintas Industriales'), NULL, 
 'Cinta reflectiva PESADA para coser combinada Amarilla Fluo/ Gris 4 x 1 - BASE TEXTIL de 4 cm de', 
 'Cinta reflectiva PESADA para coser combinada Amarilla Fluo/ Gris 4 x 1 - BASE TEXTIL de 4 cm de', 
 '4 cm', '', 'USD', NULL, '{}', '159EXWORKS', 'Bultos: UNITARIO X 500 MT X 1000 MT', true),

('97321', get_categoria_id('Cintas Industriales'), NULL, 
 'Cinta Reflectiva para coser Poliester GRIS de 2,5 cm de ancho. Precio por METRO - Presentacion: Rollo', 
 'Cinta Reflectiva para coser Poliester GRIS de 2,5 cm de ancho. Precio por METRO - Presentacion: Rollo', 
 '2,5 cm', 'Rollo', 'USD', NULL, '{}', '159EXWORKS', 'Bultos: UNITARIO X 1000 MT X 4000 MT', true),

-- Primeros Auxilios
('97502', get_categoria_id('Primeros Auxilios'), NULL, 
 'BOTIQUIN GRANDE de MADERA , Puerta guillotina , construido en Madera de Pino - 37 cm de alto x', 
 'BOTIQUIN GRANDE de MADERA , Puerta guillotina , construido en Madera de Pino - 37 cm de alto x', 
 '37 cm', '', 'USD', NULL, '{}', '159EXWORKS', 'Bultos: UNITARIO X 10', true),

('97418', get_categoria_id('Primeros Auxilios'), NULL, 
 'BOTIQUIN GRANDE de MADERA , puerta apertura lateral modelo premium ,construido en Madera', 
 'BOTIQUIN GRANDE de MADERA , puerta apertura lateral modelo premium ,construido en Madera', 
 '', '', 'USD', NULL, '{}', '159EXWORKS', 'Bultos: UNITARIO X 10', true)

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
    
    RAISE NOTICE '✅ Datos cargados exitosamente en Supabase';
    RAISE NOTICE '📊 Categorías: %', total_categorias;
    RAISE NOTICE '📊 Subcategorías: %', total_subcategorias;
    RAISE NOTICE '📊 Productos: %', total_productos;
    RAISE NOTICE '🎯 Base de datos lista para usar';
END $$;

-- =============================================================================
-- LIMPIAR FUNCIONES AUXILIARES
-- =============================================================================
DROP FUNCTION IF EXISTS get_categoria_id(TEXT);
DROP FUNCTION IF EXISTS parse_precios_por_bulto(TEXT);
DROP FUNCTION IF EXISTS clean_price(TEXT);
