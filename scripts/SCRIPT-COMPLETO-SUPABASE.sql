-- =====================================================
-- SCRIPT COMPLETO PARA SUPABASE SQL EDITOR
-- Eliminar productos no deseados y reasignar fotos
-- Generado el 10/9/2025
-- =====================================================

-- =====================================================
-- PARTE 1: ELIMINAR PRODUCTOS NO DESEADOS
-- =====================================================

-- Eliminar producto: 97614 - PANCARTA Reflectiva Roja/Blanca
DELETE FROM productos WHERE id = 220;

-- Eliminar producto: 02929 - Cono NARANJA FLUO
DELETE FROM productos WHERE id = 221;

-- Eliminar producto: 02950 - Cono NEGRO
DELETE FROM productos WHERE id = 222;

-- Eliminar producto: 97656 - Balde Metálico manija movil
DELETE FROM productos WHERE id = 27;

-- Eliminar producto: 00890 - Tapa para balde Metálico
DELETE FROM productos WHERE id = 81;

-- Eliminar producto: 01257 - Filtro Vaso para Full Face monofiltro
DELETE FROM productos WHERE id = 137;

-- Eliminar producto: 97403 - Tope estacionamiento de Goma PESADO
DELETE FROM productos WHERE id = 240;

-- Eliminar producto: 97402 - Lomo de burro de Goma
DELETE FROM productos WHERE id = 241;

-- Eliminar producto: 02125 - Bandera AERONAUTICA de TELA seguridad
DELETE FROM productos WHERE id = 257;

-- Eliminar producto: 97682 - TELA Reflectiva x m2 Poliester GRIS
DELETE FROM productos WHERE id = 269;

-- Eliminar producto: 97632 - Cinta Reflectiva Base ALGODON. GRIS
DELETE FROM productos WHERE id = 265;

-- Eliminar producto: 97633 - Cinta Reflectiva CERTIFICADA BASE Algodón. GRIS
DELETE FROM productos WHERE id = 266;

-- Eliminar producto: 97680 - Cinta Reflectiva Poliester GRIS
DELETE FROM productos WHERE id = 267;

-- Eliminar producto: 97681 - Cinta Reflectiva Poliester GRIS
DELETE FROM productos WHERE id = 268;

-- Eliminar producto: 01168 - Máscara cara completa FULL FACE MONOFILTRO
DELETE FROM productos WHERE id = 139;

-- Eliminar producto: 01531 - Equipo autónomo
DELETE FROM productos WHERE id = 141;

-- =====================================================
-- PARTE 2: REASIGNAR FOTOS ENTRE PRODUCTOS
-- =====================================================

-- Reasignar foto de 97765 a 9942
UPDATE productos 
SET imagen_url = 'https://gjmkvfljyxlvdazsbbgm.supabase.co/storage/v1/object/public/PRODUCT-PHOTO/97765.jpg?'
WHERE id = 276;

-- Reasignar foto de 97763 a 9943
UPDATE productos 
SET imagen_url = 'https://gjmkvfljyxlvdazsbbgm.supabase.co/storage/v1/object/public/PRODUCT-PHOTO/97763.jpg?'
WHERE id = 277;

-- Reasignar foto de 97762 a 9944
UPDATE productos 
SET imagen_url = 'https://gjmkvfljyxlvdazsbbgm.supabase.co/storage/v1/object/public/PRODUCT-PHOTO/97762.jpg?'
WHERE id = 278;

-- =====================================================
-- PARTE 3: VERIFICACIÓN (OPCIONAL)
-- =====================================================

-- Verificar que los productos fueron eliminados (debería devolver 0 resultados)
SELECT 'Productos eliminados verificados' as resultado;
SELECT codigo, nombre FROM productos WHERE codigo IN ('97614', '02929', '02950', '97656', '00890', '01257', '97403', '97402', '02125', '97682', '97632', '97633', '97680', '97681', '01168', '01531');

-- Verificar que las fotos fueron reasignadas
SELECT 'Fotos reasignadas verificadas' as resultado;
SELECT codigo, nombre, imagen_url FROM productos WHERE codigo IN ('9942', '9943', '9944');

-- =====================================================
-- RESUMEN DE CAMBIOS:
-- =====================================================
-- ✅ 16 productos eliminados
-- ✅ 3 fotos reasignadas
-- ✅ Categoría "Sin Categoría" ya oculta en frontend
-- =====================================================



