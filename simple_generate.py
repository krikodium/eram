#!/usr/bin/env python3
"""
Script simple para generar INSERT statements de todos los productos del catálogo ERAM
"""

def generate_sql():
    """Genera el SQL completo para todos los productos"""
    
    # Leer el archivo con diferentes codificaciones
    content = None
    for encoding in ['utf-8', 'latin-1', 'cp1252']:
        try:
            with open('ERAM_Catalogo_Categorias_y_Productos.txt', 'r', encoding=encoding) as f:
                content = f.read()
            print(f"✅ Archivo leído con codificación: {encoding}")
            break
        except UnicodeDecodeError:
            continue
    
    if not content:
        print("❌ No se pudo leer el archivo con ninguna codificación")
        return
    
    lines = content.split('\n')
    
    # Encontrar la sección de productos
    products_start = False
    products = []
    
    for line in lines:
        line = line.strip()
        
        if line == '[PRODUCTOS]':
            products_start = True
            continue
        
        if products_start and line and not line.startswith('Categoria|Subcategoria|Codigo') and '|' in line:
            # Procesar línea de producto
            parts = line.split('|')
            if len(parts) >= 10:
                categoria = parts[0].strip()
                subcategoria = parts[1].strip() if parts[1].strip() else None
                codigo = parts[2].strip()
                descripcion = parts[3].strip()
                medidas = parts[4].strip() if parts[4].strip() else None
                presentacion = parts[5].strip() if parts[5].strip() else None
                moneda = parts[6].strip() if parts[6].strip() else None
                precio_unitario = parts[7].strip() if parts[7].strip() else None
                precios_por_bulto = parts[8].strip() if parts[8].strip() else None
                notas = parts[9].strip() if parts[9].strip() else None
                
                # Determinar fuente basada en la categoría
                fuente = '99DIST' if categoria in ['Kraftex', 'Proteccion Ocular', 'Proteccion Auditiva', 
                                                 'Proteccion Facial', 'Proteccion Respiratoria', 'Incendio', 
                                                 'Kits Vehiculares', 'Delantales', 'Señalizacion Industrial'] else '159EXWORKS'
                
                products.append({
                    'codigo': codigo,
                    'categoria': categoria,
                    'subcategoria': subcategoria,
                    'descripcion': descripcion,
                    'medidas': medidas,
                    'presentacion': presentacion,
                    'moneda': moneda,
                    'precio_unitario': precio_unitario,
                    'precios_por_bulto': precios_por_bulto,
                    'fuente': fuente,
                    'notas': notas
                })
    
    print(f"📊 Productos encontrados: {len(products)}")
    
    # Generar SQL
    sql_lines = []
    sql_lines.append("-- =============================================================================")
    sql_lines.append("-- ERAM - Script de Carga Completa de TODOS los Productos")
    sql_lines.append("-- =============================================================================")
    sql_lines.append("-- Este script carga TODOS los productos del catálogo ERAM")
    sql_lines.append("-- Generado automáticamente desde ERAM_Catalogo_Categorias_y_Productos.txt")
    sql_lines.append("-- =============================================================================")
    sql_lines.append("")
    
    # Función para escapar strings SQL
    def escape_sql_string(s):
        if s is None or s == '':
            return 'NULL'
        escaped = s.replace("'", "''")
        return f"'{escaped}'"
    
    # Generar INSERT statements
    sql_lines.append("INSERT INTO productos (codigo, categoria_id, subcategoria_id, nombre, descripcion, medidas, presentacion, moneda, precio_unitario, precios_por_bulto, fuente, notas, activo) VALUES")
    
    for i, product in enumerate(products):
        # Obtener IDs de categoría y subcategoría
        categoria_id = f"get_categoria_id('{product['categoria']}')"
        subcategoria_id = f"get_subcategoria_id('{product['categoria']}', '{product['subcategoria']}')" if product['subcategoria'] else 'NULL'
        
        # Construir la línea INSERT
        values = [
            escape_sql_string(product['codigo']),
            categoria_id,
            subcategoria_id,
            escape_sql_string(product['descripcion']),
            escape_sql_string(product['descripcion']),
            escape_sql_string(product['medidas']),
            escape_sql_string(product['presentacion']),
            escape_sql_string(product['moneda']),
            'NULL',  # precio_unitario - se puede calcular después
            "'{}'",  # precios_por_bulto - se puede calcular después
            escape_sql_string(product['fuente']),
            escape_sql_string(product['notas']),
            'true'
        ]
        
        line = f"({', '.join(values)})"
        
        # Agregar coma si no es el último
        if i < len(products) - 1:
            line += ','
        else:
            line += ';'
        
        sql_lines.append(line)
    
    sql_lines.append("")
    sql_lines.append("-- =============================================================================")
    sql_lines.append("-- ON CONFLICT para actualizar productos existentes")
    sql_lines.append("-- =============================================================================")
    sql_lines.append("")
    sql_lines.append("ON CONFLICT (codigo) DO UPDATE SET")
    sql_lines.append("    categoria_id = EXCLUDED.categoria_id,")
    sql_lines.append("    subcategoria_id = EXCLUDED.subcategoria_id,")
    sql_lines.append("    nombre = EXCLUDED.nombre,")
    sql_lines.append("    descripcion = EXCLUDED.descripcion,")
    sql_lines.append("    medidas = EXCLUDED.medidas,")
    sql_lines.append("    presentacion = EXCLUDED.presentacion,")
    sql_lines.append("    moneda = EXCLUDED.moneda,")
    sql_lines.append("    precio_unitario = EXCLUDED.precio_unitario,")
    sql_lines.append("    precios_por_bulto = EXCLUDED.precios_por_bulto,")
    sql_lines.append("    fuente = EXCLUDED.fuente,")
    sql_lines.append("    notas = EXCLUDED.notas,")
    sql_lines.append("    updated_at = NOW();")
    sql_lines.append("")
    
    # Escribir el archivo
    with open('05_insert_all_products_final.sql', 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
    
    print(f"✅ Generado archivo SQL con {len(products)} productos")
    print(f"📁 Archivo: 05_insert_all_products_final.sql")
    
    # Mostrar estadísticas
    categorias = set(p['categoria'] for p in products)
    subcategorias = set(p['subcategoria'] for p in products if p['subcategoria'])
    
    print(f"📊 Estadísticas:")
    print(f"   - Total productos: {len(products)}")
    print(f"   - Categorías: {len(categorias)}")
    print(f"   - Subcategorías: {len(subcategorias)}")

if __name__ == "__main__":
    generate_sql()
