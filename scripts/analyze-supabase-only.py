#!/usr/bin/env python3
"""
Script de Análisis Solo Supabase
Analiza Supabase Storage y Base de Datos
SIN MODIFICAR NADA - Solo análisis
"""

import os
from collections import defaultdict, Counter
from supabase import create_client, Client

# =========================================================
# CONFIGURACIÓN
# =========================================================

# Credenciales de Supabase
SUPABASE_URL = "https://gjmkvfljyxlvdazsbbgm.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqbWt2ZmxqeXhsdmRhenNiYmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0MDI1NSwiZXhwIjoyMDcxODE2MjU1fQ.daQA7Xu8y1GqJluTkQ5CXkRllrP44kR_hICk9FpUwjY"
BUCKET_NAME = "PRODUCT-PHOTO"

# Configuración de la base de datos
DB_TABLE = "productos"
PRODUCT_CODE_COLUMN = "codigo"
IMAGE_URL_COLUMN = "imagen_url"

# Extensiones de imagen válidas
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']

# =========================================================
# FUNCIONES DE ANÁLISIS
# =========================================================

def is_image_file(filename):
    """Verifica si un archivo es una imagen."""
    return any(filename.lower().endswith(ext) for ext in IMAGE_EXTENSIONS)

def analyze_supabase_photos(supabase):
    """Analiza fotos en Supabase Storage."""
    print("ANALIZANDO SUPABASE STORAGE...")
    print("=" * 50)
    
    try:
        # Listar archivos en el bucket
        files = supabase.storage.from_(BUCKET_NAME).list()
        
        print(f"Archivos en bucket '{BUCKET_NAME}': {len(files)}")
        
        # Analizar por tipo de archivo
        file_types = Counter()
        image_files = []
        
        for file in files:
            name = file.get('name', '')
            ext = os.path.splitext(name)[1].lower()
            file_types[ext] += 1
            
            if is_image_file(name):
                image_files.append(file)
        
        print(f"Imagenes validas: {len(image_files)}")
        print(f"Tipos de archivo:")
        for ext, count in file_types.most_common():
            print(f"   {ext}: {count} archivos")
        
        # Extraer códigos de productos de las imágenes
        product_codes = []
        for file in image_files:
            name = file.get('name', '')
            code = os.path.splitext(name)[0]
            product_codes.append(code)
        
        print(f"Codigos de productos en Storage: {len(set(product_codes))}")
        
        # Mostrar algunos ejemplos
        if image_files:
            print(f"\nEjemplos de imagenes en Storage:")
            for i, img in enumerate(image_files[:10]):
                name = img.get('name', 'Sin nombre')
                size = img.get('metadata', {}).get('size', 'Desconocido')
                print(f"   {i+1}. {name} ({size} bytes)")
            if len(image_files) > 10:
                print(f"   ... y {len(image_files) - 10} mas")
        
        return files, image_files, product_codes
        
    except Exception as e:
        print(f"Error al acceder a Supabase Storage: {e}")
        return [], [], []

def analyze_database_products(supabase):
    """Analiza productos en la base de datos."""
    print(f"\nANALIZANDO BASE DE DATOS...")
    print("=" * 50)
    
    try:
        # Obtener todos los productos
        result = supabase.table(DB_TABLE).select(f"{PRODUCT_CODE_COLUMN}, {IMAGE_URL_COLUMN}").execute()
        products = result.data
        
        print(f"Total productos en BD: {len(products)}")
        
        # Analizar productos con y sin imagen
        with_image = [p for p in products if p.get(IMAGE_URL_COLUMN)]
        without_image = [p for p in products if not p.get(IMAGE_URL_COLUMN)]
        
        print(f"Productos CON imagen: {len(with_image)}")
        print(f"Productos SIN imagen: {len(without_image)}")
        
        # Códigos de productos
        product_codes = [p[PRODUCT_CODE_COLUMN] for p in products]
        unique_codes = set(product_codes)
        
        print(f"Codigos unicos en BD: {len(unique_codes)}")
        
        if len(product_codes) != len(unique_codes):
            duplicates = len(product_codes) - len(unique_codes)
            print(f"Codigos duplicados en BD: {duplicates}")
        
        # Analizar URLs de imágenes
        valid_urls = 0
        invalid_urls = 0
        supabase_urls = 0
        
        for product in with_image:
            url = product.get(IMAGE_URL_COLUMN, '')
            if url:
                if url.startswith('http'):
                    valid_urls += 1
                    if 'supabase' in url.lower():
                        supabase_urls += 1
                else:
                    invalid_urls += 1
        
        print(f"\nAnalisis de URLs de imagenes:")
        print(f"   URLs validas (http): {valid_urls}")
        print(f"   URLs de Supabase: {supabase_urls}")
        print(f"   URLs invalidas: {invalid_urls}")
        
        # Mostrar algunos ejemplos de URLs
        if with_image:
            print(f"\nEjemplos de URLs de imagenes:")
            for i, product in enumerate(with_image[:5]):
                code = product.get(PRODUCT_CODE_COLUMN, 'Sin codigo')
                url = product.get(IMAGE_URL_COLUMN, 'Sin URL')
                print(f"   {i+1}. {code}: {url}")
            if len(with_image) > 5:
                print(f"   ... y {len(with_image) - 5} mas")
        
        return products, with_image, without_image, product_codes
        
    except Exception as e:
        print(f"Error al acceder a la base de datos: {e}")
        return [], [], [], []

def analyze_matches_and_gaps(storage_codes, db_codes, products_without_image):
    """Analiza coincidencias y gaps entre Storage y BD."""
    print(f"\nANALIZANDO COINCIDENCIAS Y GAPS...")
    print("=" * 50)
    
    storage_codes_set = set(storage_codes)
    db_codes_set = set(db_codes)
    
    # Coincidencias
    matches = storage_codes_set.intersection(db_codes_set)
    storage_only = storage_codes_set - db_codes_set
    db_only = db_codes_set - storage_codes_set
    
    print(f"Codigos que coinciden (Storage <-> BD): {len(matches)}")
    print(f"Solo en Storage: {len(storage_only)}")
    print(f"Solo en BD: {len(db_only)}")
    
    # Productos sin imagen que tienen foto en Storage
    products_needing_photos = []
    for product_code in [p[PRODUCT_CODE_COLUMN] for p in products_without_image]:
        if product_code in storage_codes_set:
            products_needing_photos.append(product_code)
    
    print(f"\nProductos SIN imagen que TIENEN foto en Storage: {len(products_needing_photos)}")
    
    if products_needing_photos:
        print(f"Ejemplos de productos que necesitan foto:")
        for code in products_needing_photos[:10]:
            print(f"   - {code}")
        if len(products_needing_photos) > 10:
            print(f"   ... y {len(products_needing_photos) - 10} mas")
    
    # Códigos solo en Storage
    if storage_only:
        print(f"\nCodigos solo en Storage (sin producto en BD):")
        for code in list(storage_only)[:10]:
            print(f"   - {code}")
        if len(storage_only) > 10:
            print(f"   ... y {len(storage_only) - 10} mas")
    
    # Códigos solo en BD
    if db_only:
        print(f"\nCodigos solo en BD (sin foto en Storage):")
        for code in list(db_only)[:10]:
            print(f"   - {code}")
        if len(db_only) > 10:
            print(f"   ... y {len(db_only) - 10} mas")
    
    return {
        'matches': matches,
        'storage_only': storage_only,
        'db_only': db_only,
        'products_needing_photos': products_needing_photos
    }

def generate_recommendations(analysis_results, total_products, products_with_image):
    """Genera recomendaciones basadas en el análisis."""
    print(f"\nRECOMENDACIONES:")
    print("=" * 50)
    
    matches = analysis_results['matches']
    storage_only = analysis_results['storage_only']
    db_only = analysis_results['db_only']
    products_needing_photos = analysis_results['products_needing_photos']
    
    print(f"1. PRODUCTOS QUE NECESITAN FOTO:")
    print(f"   Cantidad: {len(products_needing_photos)}")
    print(f"   Accion: Subir fotos faltantes desde Storage a BD")
    print(f"   Prioridad: ALTA (productos sin imagen)")
    
    print(f"\n2. FOTOS HUERFANAS EN STORAGE:")
    print(f"   Cantidad: {len(storage_only)}")
    print(f"   Accion: Verificar si son productos validos o archivos basura")
    print(f"   Prioridad: MEDIA (revisar manualmente)")
    
    print(f"\n3. PRODUCTOS SIN FOTO:")
    print(f"   Cantidad: {len(db_only)}")
    print(f"   Accion: Buscar fotos faltantes o marcar como sin imagen")
    print(f"   Prioridad: BAJA (productos sin foto disponible)")
    
    print(f"\n4. COBERTURA ACTUAL:")
    coverage = (len(products_with_image) / total_products * 100) if total_products > 0 else 0
    print(f"   Productos con imagen: {len(products_with_image)}/{total_products} ({coverage:.1f}%)")
    print(f"   Fotos disponibles en Storage: {len(matches)}")
    print(f"   Potencial de mejora: {len(products_needing_photos)} productos")
    
    return {
        'coverage_percentage': coverage,
        'improvement_potential': len(products_needing_photos)
    }

def main():
    """Función principal de análisis."""
    print("ANALISIS SUPABASE STORAGE Y BASE DE DATOS - ERAM")
    print("=" * 60)
    print("Analizando Storage y Base de Datos...")
    print("MODO SOLO LECTURA - No se modificara nada")
    print("=" * 60)
    
    try:
        # 1. Conectar a Supabase
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("OK - Conexion con Supabase establecida")
        
        # 2. Analizar Supabase Storage
        storage_files, image_files, storage_codes = analyze_supabase_photos(supabase)
        
        # 3. Analizar Base de Datos
        products, with_image, without_image, db_codes = analyze_database_products(supabase)
        
        # 4. Analizar coincidencias y gaps
        analysis_results = analyze_matches_and_gaps(storage_codes, db_codes, without_image)
        
        # 5. Generar recomendaciones
        recommendations = generate_recommendations(analysis_results, len(products), len(with_image))
        
        # 6. Resumen final
        print(f"\nRESUMEN FINAL:")
        print("=" * 50)
        print(f"Fotos en Storage: {len(image_files)}")
        print(f"Productos en BD: {len(products)}")
        print(f"Productos con imagen: {len(with_image)}")
        print(f"Productos sin imagen: {len(without_image)}")
        print(f"Coincidencias Storage<->BD: {len(analysis_results['matches'])}")
        print(f"Productos que necesitan foto: {len(analysis_results['products_needing_photos'])}")
        print(f"Cobertura actual: {recommendations['coverage_percentage']:.1f}%")
        print(f"Potencial de mejora: {recommendations['improvement_potential']} productos")
        
        print(f"\nAnálisis completado exitosamente!")
        print(f"Revisa las recomendaciones arriba para decidir próximos pasos")
        
    except Exception as e:
        print(f"Error durante el análisis: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()


