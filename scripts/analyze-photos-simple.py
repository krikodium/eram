#!/usr/bin/env python3
"""
Script de Análisis Simple de Fotos
Analiza Drive, Supabase y productos para dar un reporte detallado
SIN MODIFICAR NADA - Solo análisis
"""

import os
import io
from collections import defaultdict, Counter
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from supabase import create_client, Client

# =========================================================
# CONFIGURACIÓN
# =========================================================

# Credenciales de Supabase
SUPABASE_URL = "https://gjmkvfljyxlvdazsbbgm.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqbWt2ZmxqeXhsdmRhenNiYmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0MDI1NSwiZXhwIjoyMDcxODE2MjU1fQ.daQA7Xu8y1GqJluTkQ5CXkRllrP44kR_hICk9FpUwjY"
BUCKET_NAME = "PRODUCT-PHOTO"

# Carpetas de Google Drive
DRIVE_FOLDER_IDS = [
    "1OKSMHIWGeeO_TKkWFmHaYE019ZdH5i9v",
    "1H4Ul3p0wjFrStA1I-Oj-qZEMR0gAcyqT", 
    "1759cgufQ3botgdnnGWMeVYFguvaOyxva",
    "1EBug7re42Vtw-OSfJOcVdsShoBNioRMA",
    "1uNDpBk0F4uE2Yl_xobVHJweYObjiFmhi"
]

PRODUCTION_FOLDER_ID = "1WE_HGMrhsv5LRE7CrYFOgPljN6MKvRls"

DRIVE_CREDENTIALS_FILE = "credentials.json"
DRIVE_TOKEN_FILE = 'token.json'
SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
          'https://www.googleapis.com/auth/drive.readonly']

# Configuración de la base de datos
DB_TABLE = "productos"
PRODUCT_CODE_COLUMN = "codigo"
IMAGE_URL_COLUMN = "imagen_url"

# Extensiones de imagen válidas
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']

# =========================================================
# FUNCIONES DE AUTENTICACIÓN
# =========================================================

def authenticate_drive():
    """Maneja la autenticación con Google Drive."""
    creds = None
    if os.path.exists(DRIVE_TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(DRIVE_TOKEN_FILE, SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                DRIVE_CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        
        with open(DRIVE_TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
            
    return build('drive', 'v3', credentials=creds)

# =========================================================
# FUNCIONES DE ANÁLISIS
# =========================================================

def is_image_file(filename):
    """Verifica si un archivo es una imagen."""
    return any(filename.lower().endswith(ext) for ext in IMAGE_EXTENSIONS)

def analyze_drive_photos(drive_service, folder_ids):
    """Analiza fotos en Google Drive."""
    print("ANALIZANDO GOOGLE DRIVE...")
    print("=" * 50)
    
    all_photos = []
    folder_stats = {}
    
    for i, folder_id in enumerate(folder_ids, 1):
        folder_name = f"Carpeta {i}" if i <= 5 else "Produccion 11/08"
        print(f"\nAnalizando {folder_name} (ID: {folder_id})")
        
        try:
            query = f"'{folder_id}' in parents and trashed = false"
            results = drive_service.files().list(
                q=query,
                pageSize=1000,
                fields="nextPageToken, files(id, name, mimeType, size, createdTime)"
            ).execute()
            
            files = results.get('files', [])
            image_files = [f for f in files if is_image_file(f.get('name', ''))]
            
            folder_stats[folder_name] = {
                'total_files': len(files),
                'image_files': len(image_files),
                'photos': image_files
            }
            
            all_photos.extend(image_files)
            
            print(f"   Total archivos: {len(files)}")
            print(f"   Imagenes: {len(image_files)}")
            
            # Mostrar algunos ejemplos
            if image_files:
                print(f"   Ejemplos:")
                for j, img in enumerate(image_files[:3]):
                    name = img.get('name', 'Sin nombre')
                    size = img.get('size', 'Desconocido')
                    print(f"      {j+1}. {name} ({size} bytes)")
                if len(image_files) > 3:
                    print(f"      ... y {len(image_files) - 3} mas")
            
        except Exception as e:
            print(f"   Error: {e}")
            folder_stats[folder_name] = {
                'total_files': 0,
                'image_files': 0,
                'photos': [],
                'error': str(e)
            }
    
    return all_photos, folder_stats

def analyze_supabase_photos(supabase):
    """Analiza fotos en Supabase Storage."""
    print(f"\nANALIZANDO SUPABASE STORAGE...")
    print("=" * 50)
    
    try:
        # Listar archivos en el bucket
        files = supabase.storage.from_(BUCKET_NAME).list()
        
        print(f"Archivos en bucket '{BUCKET_NAME}': {len(files)}")
        
        # Analizar por tipo de archivo
        file_types = Counter()
        for file in files:
            name = file.get('name', '')
            ext = os.path.splitext(name)[1].lower()
            file_types[ext] += 1
        
        print(f"Tipos de archivo:")
        for ext, count in file_types.most_common():
            print(f"   {ext}: {count} archivos")
        
        return files
        
    except Exception as e:
        print(f"Error al acceder a Supabase Storage: {e}")
        return []

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
        
        print(f"Codigos unicos: {len(unique_codes)}")
        
        if len(product_codes) != len(unique_codes):
            duplicates = len(product_codes) - len(unique_codes)
            print(f"Codigos duplicados en BD: {duplicates}")
        
        return products, with_image, without_image, product_codes
        
    except Exception as e:
        print(f"Error al acceder a la base de datos: {e}")
        return [], [], [], []

def analyze_duplicates_and_matches(drive_photos, supabase_files, product_codes):
    """Analiza duplicados y coincidencias."""
    print(f"\nANALIZANDO DUPLICADOS Y COINCIDENCIAS...")
    print("=" * 50)
    
    # Extraer códigos de Drive
    drive_codes = []
    drive_duplicates = defaultdict(list)
    
    for photo in drive_photos:
        name = photo.get('name', '')
        code = os.path.splitext(name)[0]
        drive_codes.append(code)
        drive_duplicates[code].append(photo)
    
    # Encontrar duplicados en Drive
    drive_duplicate_codes = {code: photos for code, photos in drive_duplicates.items() if len(photos) > 1}
    
    print(f"Codigos unicos en Drive: {len(set(drive_codes))}")
    print(f"Total archivos en Drive: {len(drive_codes)}")
    print(f"Codigos duplicados en Drive: {len(drive_duplicate_codes)}")
    
    # Mostrar duplicados
    if drive_duplicate_codes:
        print(f"\nDUPLICADOS EN DRIVE:")
        for code, photos in list(drive_duplicate_codes.items())[:10]:  # Mostrar solo los primeros 10
            print(f"   {code}: {len(photos)} archivos")
            for photo in photos:
                name = photo.get('name', 'Sin nombre')
                size = photo.get('size', 'Desconocido')
                print(f"      - {name} ({size} bytes)")
        if len(drive_duplicate_codes) > 10:
            print(f"      ... y {len(drive_duplicate_codes) - 10} codigos mas con duplicados")
    
    # Encontrar coincidencias con productos en BD
    product_codes_set = set(product_codes)
    drive_codes_set = set(drive_codes)
    
    matches = drive_codes_set.intersection(product_codes_set)
    drive_only = drive_codes_set - product_codes_set
    bd_only = product_codes_set - drive_codes_set
    
    print(f"\nCOINCIDENCIAS:")
    print(f"   Codigos que coinciden (Drive <-> BD): {len(matches)}")
    print(f"   Solo en Drive: {len(drive_only)}")
    print(f"   Solo en BD: {len(bd_only)}")
    
    # Mostrar algunos ejemplos de coincidencias
    if matches:
        print(f"\nEJEMPLOS DE COINCIDENCIAS:")
        for code in list(matches)[:10]:
            print(f"   {code}")
        if len(matches) > 10:
            print(f"   ... y {len(matches) - 10} mas")
    
    # Mostrar códigos solo en Drive
    if drive_only:
        print(f"\nCODIGOS SOLO EN DRIVE (sin producto en BD):")
        for code in list(drive_only)[:10]:
            print(f"   {code}")
        if len(drive_only) > 10:
            print(f"   ... y {len(drive_only) - 10} mas")
    
    # Mostrar códigos solo en BD
    if bd_only:
        print(f"\nCODIGOS SOLO EN BD (sin foto en Drive):")
        for code in list(bd_only)[:10]:
            print(f"   {code}")
        if len(bd_only) > 10:
            print(f"   ... y {len(bd_only) - 10} mas")
    
    return {
        'drive_codes': drive_codes,
        'drive_duplicates': drive_duplicate_codes,
        'matches': matches,
        'drive_only': drive_only,
        'bd_only': bd_only
    }

def generate_recommendations(analysis_results, without_image, drive_duplicates):
    """Genera recomendaciones basadas en el análisis."""
    print(f"\nRECOMENDACIONES:")
    print("=" * 50)
    
    matches = analysis_results['matches']
    drive_only = analysis_results['drive_only']
    bd_only = analysis_results['bd_only']
    
    # Productos sin imagen que tienen foto en Drive
    products_needing_photos = []
    for product_code in without_image:
        if product_code in matches:
            products_needing_photos.append(product_code)
    
    print(f"PRODUCTOS SIN IMAGEN QUE TIENEN FOTO EN DRIVE:")
    print(f"   Cantidad: {len(products_needing_photos)}")
    print(f"   Accion: Subir fotos faltantes")
    
    if products_needing_photos:
        print(f"   Ejemplos:")
        for code in products_needing_photos[:10]:
            print(f"      - {code}")
        if len(products_needing_photos) > 10:
            print(f"      ... y {len(products_needing_photos) - 10} mas")
    
    # Duplicados en Drive
    print(f"\nDUPLICADOS EN DRIVE:")
    print(f"   Cantidad de codigos con duplicados: {len(drive_duplicates)}")
    print(f"   Accion: Revisar manualmente o elegir la mejor foto")
    
    # Códigos solo en Drive
    print(f"\nCODIGOS SOLO EN DRIVE:")
    print(f"   Cantidad: {len(drive_only)}")
    print(f"   Accion: Verificar si son productos validos o archivos basura")
    
    # Códigos solo en BD
    print(f"\nCODIGOS SOLO EN BD:")
    print(f"   Cantidad: {len(bd_only)}")
    print(f"   Accion: Buscar fotos faltantes o marcar como sin imagen")
    
    return {
        'products_needing_photos': products_needing_photos,
        'duplicate_codes': list(drive_duplicates.keys()),
        'drive_only_codes': list(drive_only),
        'bd_only_codes': list(bd_only)
    }

def main():
    """Función principal de análisis."""
    print("ANALISIS COMPLETO DE FOTOS - ERAM")
    print("=" * 60)
    print("Analizando Drive, Supabase y Base de Datos...")
    print("MODO SOLO LECTURA - No se modificara nada")
    print("=" * 60)
    
    try:
        # 1. Conectar a Supabase
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("OK - Conexion con Supabase establecida")
        
        # 2. Autenticar con Google Drive
        drive_service = authenticate_drive()
        print("OK - Autenticacion con Google Drive exitosa")
        
        # 3. Analizar Drive
        all_folder_ids = DRIVE_FOLDER_IDS + [PRODUCTION_FOLDER_ID]
        drive_photos, folder_stats = analyze_drive_photos(drive_service, all_folder_ids)
        
        # 4. Analizar Supabase Storage
        supabase_files = analyze_supabase_photos(supabase)
        
        # 5. Analizar Base de Datos
        products, with_image, without_image, product_codes = analyze_database_products(supabase)
        
        # 6. Analizar duplicados y coincidencias
        analysis_results = analyze_duplicates_and_matches(drive_photos, supabase_files, product_codes)
        
        # 7. Generar recomendaciones
        recommendations = generate_recommendations(
            analysis_results, 
            [p[PRODUCT_CODE_COLUMN] for p in without_image],
            analysis_results['drive_duplicates']
        )
        
        # 8. Resumen final
        print(f"\nRESUMEN FINAL:")
        print("=" * 50)
        print(f"Fotos en Drive: {len(drive_photos)}")
        print(f"Fotos en Supabase: {len(supabase_files)}")
        print(f"Productos en BD: {len(products)}")
        print(f"Productos con imagen: {len(with_image)}")
        print(f"Productos sin imagen: {len(without_image)}")
        print(f"Coincidencias Drive<->BD: {len(analysis_results['matches'])}")
        print(f"Codigos duplicados en Drive: {len(analysis_results['drive_duplicates'])}")
        print(f"Productos que necesitan foto: {len(recommendations['products_needing_photos'])}")
        
        print(f"\nAnálisis completado exitosamente!")
        print(f"Revisa las recomendaciones arriba para decidir próximos pasos")
        
    except Exception as e:
        print(f"Error durante el análisis: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()


