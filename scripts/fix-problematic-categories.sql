-- Script para eliminar categorías problemáticas
-- Generado automáticamente el 10/9/2025, 1:01:20 PM

-- Mover productos a categoría por defecto (ID: 13)
UPDATE productos 
SET categoria_id = 13 
WHERE categoria_id = 1;


-- Eliminar categorías problemáticas
DELETE FROM categorias WHERE id = 1;

