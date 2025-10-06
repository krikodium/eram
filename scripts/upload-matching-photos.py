#!/usr/bin/env python3
"""
Script de Subida de Fotos Coincidentes
Sube solo fotos que coincidan exactamente con códigos de productos en BD
Reporta cuáles no coinciden
"""

import os
import io
import json
from collections import defaultdict
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

def normalize_code(code):
    """Normaliza un código de producto para comparación."""
    if not code:
        return ""
    # Eliminar espacios, convertir a mayúsculas, eliminar caracteres especiales
    normalized = str(code).strip().upper()
    # Eliminar espacios y caracteres especiales comunes
    normalized = normalized.replace(" ", "").replace("-", "").replace("_", "").replace("/", "")
    return normalized

def get_drive_photos(drive_service, folder_ids):
    """Obtiene todas las fotos de Google Drive."""
    print("Obteniendo fotos de Google Drive...")
    
    all_photos = []
    drive_codes = set()
    
    for i, folder_id in enumerate(folder_ids, 1):
        folder_name = f"Carpeta {i}" if i <= 5 else "Produccion 11/08"
        print(f"  Analizando {folder_name}...")
        
        try:
            query = f"'{folder_id}' in parents and trashed = false"
            results = drive_service.files().list(
                q=query,
                pageSize=1000,
                fields="nextPageToken, files(id, name, mimeType, size, createdTime)"
            ).execute()
            
            files = results.get('files', [])
            image_files = [f for f in files if is_image_file(f.get('name', ''))]
            
            for photo in image_files:
                name = photo.get('name', '')
                code = os.path.splitext(name)[0]
                normalized_code = normalize_code(code)
                
                drive_codes.add(normalized_code)
                all_photos.append({
                    'id': photo.get('id'),
                    'name': name,
                    'code': code,
                    'normalized_code': normalized_code,
                    'size': photo.get('size'),
                    'folder': folder_name
                })
            
            print(f"    Encontradas {len(image_files)} imagenes")
            
        except Exception as e:
            print(f"    Error en {folder_name}: {e}")
    
    return all_photos, drive_codes

def get_supabase_photos(supabase):
    """Obtiene fotos existentes en Supabase Storage."""
    print("Obteniendo fotos de Supabase Storage...")
    
    try:
        files = supabase.storage.from_(BUCKET_NAME).list()
        
        supabase_codes = set()
        for file in files:
            name = file.get('name', '')
            if is_image_file(name):
                code = os.path.splitext(name)[0]
                normalized_code = normalize_code(code)
                supabase_codes.add(normalized_code)
        
        print(f"  Encontradas {len(supabase_codes)} imagenes en Supabase")
        return supabase_codes
        
    except Exception as e:
        print(f"  Error al acceder a Supabase Storage: {e}")
        return set()

def get_database_products(supabase):
    """Obtiene productos de la base de datos."""
    print("Obteniendo productos de la base de datos...")
    
    try:
        result = supabase.table(DB_TABLE).select(f"{PRODUCT_CODE_COLUMN}, {IMAGE_URL_COLUMN}").execute()
        products = result.data
        
        # Crear diccionario de productos con códigos normalizados
        product_dict = {}
        products_without_image = []
        
        for product in products:
            code = product[PRODUCT_CODE_COLUMN]
            normalized_code = normalize_code(code)
            product_dict[normalized_code] = {
                'original_code': code,
                'has_image': bool(product.get(IMAGE_URL_COLUMN)),
                'image_url': product.get(IMAGE_URL_COLUMN)
            }
            
            if not product.get(IMAGE_URL_COLUMN):
                products_without_image.append(normalized_code)
        
        print(f"  Total productos: {len(products)}")
        print(f"  Productos sin imagen: {len(products_without_image)}")
        
        return product_dict, products_without_image
        
    except Exception as e:
        print(f"  Error al acceder a la base de datos: {e}")
        return {}, []

def find_matching_photos(drive_photos, supabase_codes, product_dict, products_without_image):
    """Encuentra fotos que coinciden con productos en BD."""
    print("Identificando fotos que coinciden con productos en BD...")
    
    matching_photos = []
    non_matching_photos = []
    already_uploaded = []
    
    for photo in drive_photos:
        normalized_code = photo['normalized_code']
        
        if normalized_code in product_dict:
            # Es un producto que existe en BD
            if normalized_code in supabase_codes:
                # Ya está subido
                already_uploaded.append(photo)
            else:
                # No está subido, agregar a la lista
                matching_photos.append(photo)
        else:
            # No es un producto de BD
            non_matching_photos.append(photo)
    
    print(f"  Fotos que coinciden con productos BD: {len(matching_photos)}")
    print(f"  Fotos que NO coinciden con productos BD: {len(non_matching_photos)}")
    print(f"  Fotos ya subidas: {len(already_uploaded)}")
    
    # Separar por prioridad
    priority_photos = []
    other_matching = []
    
    for photo in matching_photos:
        if photo['normalized_code'] in products_without_image:
            priority_photos.append(photo)
        else:
            other_matching.append(photo)
    
    print(f"  Prioridad alta (productos sin imagen): {len(priority_photos)}")
    print(f"  Prioridad baja (productos con imagen): {len(other_matching)}")
    
    return matching_photos, non_matching_photos, already_uploaded, priority_photos, other_matching

def download_photo_from_drive(drive_service, photo_id, photo_name):
    """Descarga una foto de Google Drive."""
    try:
        request = drive_service.files().get_media(fileId=photo_id)
        file_content = request.execute()
        return file_content
    except Exception as e:
        print(f"    Error descargando {photo_name}: {e}")
        return None

def upload_photo_to_supabase(supabase, photo_content, photo_name):
    """Sube una foto a Supabase Storage."""
    try:
        result = supabase.storage.from_(BUCKET_NAME).upload(
            path=photo_name,
            file=photo_content,
            file_options={"content-type": "image/jpeg"}
        )
        return result
    except Exception as e:
        print(f"    Error subiendo {photo_name}: {e}")
        return None

def update_database_with_url(supabase, product_code, photo_name):
    """Actualiza la base de datos con la URL de la foto."""
    try:
        # Construir URL de Supabase Storage
        url = f"https://gjmkvfljyxlvdazsbbgm.supabase.co/storage/v1/object/public/{BUCKET_NAME}/{photo_name}"
        
        # Actualizar producto
        result = supabase.table(DB_TABLE).update({
            IMAGE_URL_COLUMN: url
        }).eq(PRODUCT_CODE_COLUMN, product_code).execute()
        
        return result
    except Exception as e:
        print(f"    Error actualizando BD para {product_code}: {e}")
        return None

def upload_matching_photos(drive_service, supabase, matching_photos, product_dict, dry_run=True, max_photos=100):
    """Sube fotos que coinciden con productos en BD."""
    print(f"\n{'SIMULACION' if dry_run else 'SUBIDA REAL'} DE FOTOS COINCIDENTES...")
    print("=" * 60)
    
    success_count = 0
    error_count = 0
    skipped_count = 0
    
    # Limitar cantidad de fotos
    photos_to_process = matching_photos[:max_photos]
    
    for i, photo in enumerate(photos_to_process, 1):
        code = photo['code']
        normalized_code = photo['normalized_code']
        name = photo['name']
        photo_id = photo['id']
        folder = photo['folder']
        
        # Obtener información del producto
        product_info = product_dict[normalized_code]
        original_code = product_info['original_code']
        has_image = product_info['has_image']
        
        print(f"\n[{i}/{len(photos_to_process)}] Procesando {code} -> {original_code}")
        print(f"  Archivo: {name}")
        print(f"  Carpeta: {folder}")
        print(f"  Producto tiene imagen: {'SI' if has_image else 'NO'}")
        
        if dry_run:
            print(f"  [SIMULACION] Se subiria: {name}")
            success_count += 1
            continue
        
        try:
            # 1. Descargar de Drive
            print(f"  Descargando de Drive...")
            photo_content = download_photo_from_drive(drive_service, photo_id, name)
            
            if not photo_content:
                print(f"  ERROR: No se pudo descargar")
                error_count += 1
                continue
            
            # 2. Subir a Supabase
            print(f"  Subiendo a Supabase...")
            upload_result = upload_photo_to_supabase(supabase, photo_content, name)
            
            if not upload_result:
                print(f"  ERROR: No se pudo subir")
                error_count += 1
                continue
            
            # 3. Actualizar base de datos
            print(f"  Actualizando base de datos...")
            db_result = update_database_with_url(supabase, original_code, name)
            
            if not db_result:
                print(f"  ERROR: No se pudo actualizar BD")
                error_count += 1
                continue
            
            print(f"  EXITO: {name} subida correctamente")
            success_count += 1
            
        except Exception as e:
            print(f"  ERROR: {e}")
            error_count += 1
    
    return success_count, error_count, skipped_count

def generate_reports(matching_photos, non_matching_photos, already_uploaded, priority_photos, other_matching):
    """Genera reportes detallados."""
    print(f"\nREPORTES DETALLADOS:")
    print("=" * 60)
    
    # Reporte de fotos que coinciden
    print(f"\n1. FOTOS QUE COINCIDEN CON PRODUCTOS EN BD:")
    print(f"   Total: {len(matching_photos)}")
    print(f"   Prioridad alta (sin imagen): {len(priority_photos)}")
    print(f"   Prioridad baja (con imagen): {len(other_matching)}")
    
    if priority_photos:
        print(f"\n   Ejemplos de prioridad alta:")
        for photo in priority_photos[:10]:
            print(f"     - {photo['code']} ({photo['name']}) - {photo['folder']}")
        if len(priority_photos) > 10:
            print(f"     ... y {len(priority_photos) - 10} mas")
    
    # Reporte de fotos que NO coinciden
    print(f"\n2. FOTOS QUE NO COINCIDEN CON PRODUCTOS EN BD:")
    print(f"   Total: {len(non_matching_photos)}")
    
    if non_matching_photos:
        print(f"\n   Ejemplos de fotos no coincidentes:")
        for photo in non_matching_photos[:20]:
            print(f"     - {photo['code']} ({photo['name']}) - {photo['folder']}")
        if len(non_matching_photos) > 20:
            print(f"     ... y {len(non_matching_photos) - 20} mas")
    
    # Reporte de fotos ya subidas
    print(f"\n3. FOTOS YA SUBIDAS:")
    print(f"   Total: {len(already_uploaded)}")
    
    if already_uploaded:
        print(f"\n   Ejemplos de fotos ya subidas:")
        for photo in already_uploaded[:10]:
            print(f"     - {photo['code']} ({photo['name']}) - {photo['folder']}")
        if len(already_uploaded) > 10:
            print(f"     ... y {len(already_uploaded) - 10} mas")

def main():
    """Función principal de subida de fotos coincidentes."""
    print("SUBIDA DE FOTOS COINCIDENTES - ERAM")
    print("=" * 60)
    print("Solo sube fotos que coincidan exactamente con productos en BD")
    print("=" * 60)
    
    try:
        # 1. Conectar a Supabase
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("OK - Conexion con Supabase establecida")
        
        # 2. Autenticar con Google Drive
        drive_service = authenticate_drive()
        print("OK - Autenticacion con Google Drive exitosa")
        
        # 3. Obtener datos
        all_folder_ids = DRIVE_FOLDER_IDS + [PRODUCTION_FOLDER_ID]
        drive_photos, drive_codes = get_drive_photos(drive_service, all_folder_ids)
        supabase_codes = get_supabase_photos(supabase)
        product_dict, products_without_image = get_database_products(supabase)
        
        # 4. Encontrar fotos coincidentes
        matching_photos, non_matching_photos, already_uploaded, priority_photos, other_matching = find_matching_photos(
            drive_photos, supabase_codes, product_dict, products_without_image
        )
        
        # 5. Generar reportes
        generate_reports(matching_photos, non_matching_photos, already_uploaded, priority_photos, other_matching)
        
        # 6. Mostrar resumen
        print(f"\nRESUMEN FINAL:")
        print("=" * 60)
        print(f"Total fotos en Drive: {len(drive_photos)}")
        print(f"Fotos que coinciden con productos BD: {len(matching_photos)}")
        print(f"Fotos que NO coinciden con productos BD: {len(non_matching_photos)}")
        print(f"Fotos ya subidas: {len(already_uploaded)}")
        print(f"Prioridad alta (productos sin imagen): {len(priority_photos)}")
        print(f"Prioridad baja (productos con imagen): {len(other_matching)}")
        
        if len(matching_photos) == 0:
            print("\nNo hay fotos para subir que coincidan con productos en BD!")
            return
        
        # 7. Ejecutar simulación
        print(f"\n=== EJECUTANDO SIMULACION ===")
        success, errors, skipped = upload_matching_photos(
            drive_service, supabase, matching_photos, product_dict, 
            dry_run=True, max_photos=50
        )
        
        print(f"\nRESULTADOS DE SIMULACION:")
        print(f"  Exitos: {success}")
        print(f"  Errores: {errors}")
        print(f"  Omitidos: {skipped}")
        
        # 8. Preguntar si continuar con subida real
        print(f"\n¿Continuar con subida real? (s/n): ", end="")
        try:
            response = input().strip().lower()
            if response in ['s', 'si', 'y', 'yes']:
                print(f"\n=== EJECUTANDO SUBIDA REAL ===")
                success, errors, skipped = upload_matching_photos(
                    drive_service, supabase, matching_photos, product_dict, 
                    dry_run=False, max_photos=200
                )
                
                print(f"\nRESULTADOS FINALES:")
                print(f"  Exitos: {success}")
                print(f"  Errores: {errors}")
                print(f"  Omitidos: {skipped}")
            else:
                print("Subida cancelada por el usuario")
        except EOFError:
            print("Entrada no disponible, ejecutando solo simulacion")
        
        print(f"\nProceso completado!")
        
    except Exception as e:
        print(f"Error durante el proceso: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()


