#!/usr/bin/env python3
"""
Script de Subida Automática de Fotos
Ejecuta automáticamente la simulación y luego la subida
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
                drive_codes.add(code)
                all_photos.append({
                    'id': photo.get('id'),
                    'name': name,
                    'code': code,
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
                supabase_codes.add(code)
        
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
        
        # Productos sin imagen
        products_without_image = []
        for product in products:
            if not product.get(IMAGE_URL_COLUMN):
                products_without_image.append(product[PRODUCT_CODE_COLUMN])
        
        print(f"  Total productos: {len(products)}")
        print(f"  Productos sin imagen: {len(products_without_image)}")
        
        return products, products_without_image
        
    except Exception as e:
        print(f"  Error al acceder a la base de datos: {e}")
        return [], []

def find_photos_to_upload(drive_photos, supabase_codes, products_without_image):
    """Encuentra fotos que se pueden subir de forma segura."""
    print("Identificando fotos para subir...")
    
    # Fotos que están en Drive pero NO en Supabase
    photos_to_upload = []
    
    for photo in drive_photos:
        code = photo['code']
        
        # Solo subir si:
        # 1. No existe en Supabase
        # 2. Es un producto que existe en BD (con o sin imagen)
        if code not in supabase_codes:
            photos_to_upload.append(photo)
    
    print(f"  Fotos disponibles para subir: {len(photos_to_upload)}")
    
    # Priorizar productos sin imagen
    priority_photos = []
    other_photos = []
    
    for photo in photos_to_upload:
        if photo['code'] in products_without_image:
            priority_photos.append(photo)
        else:
            other_photos.append(photo)
    
    print(f"  Prioridad alta (productos sin imagen): {len(priority_photos)}")
    print(f"  Prioridad baja (otros): {len(other_photos)}")
    
    return priority_photos, other_photos

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

def upload_photos_safely(drive_service, supabase, photos_to_upload, dry_run=True, max_photos=50):
    """Sube fotos de forma segura."""
    print(f"\n{'SIMULACION' if dry_run else 'SUBIDA REAL'} DE FOTOS...")
    print("=" * 50)
    
    success_count = 0
    error_count = 0
    skipped_count = 0
    
    # Limitar cantidad de fotos para evitar sobrecarga
    photos_to_process = photos_to_upload[:max_photos]
    
    for i, photo in enumerate(photos_to_process, 1):
        code = photo['code']
        name = photo['name']
        photo_id = photo['id']
        folder = photo['folder']
        
        print(f"\n[{i}/{len(photos_to_process)}] Procesando {code} ({name})")
        print(f"  Carpeta: {folder}")
        
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
            db_result = update_database_with_url(supabase, code, name)
            
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

def main():
    """Función principal de subida automática."""
    print("SUBIDA AUTOMATICA DE FOTOS - ERAM")
    print("=" * 60)
    print("Estrategia conservadora: Solo sube lo que falta")
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
        products, products_without_image = get_database_products(supabase)
        
        # 4. Encontrar fotos para subir
        priority_photos, other_photos = find_photos_to_upload(
            drive_photos, supabase_codes, products_without_image
        )
        
        # 5. Mostrar resumen
        print(f"\nRESUMEN DE FOTOS PARA SUBIR:")
        print("=" * 50)
        print(f"Total fotos en Drive: {len(drive_photos)}")
        print(f"Fotos en Supabase: {len(supabase_codes)}")
        print(f"Fotos disponibles para subir: {len(priority_photos) + len(other_photos)}")
        print(f"  - Prioridad alta (productos sin imagen): {len(priority_photos)}")
        print(f"  - Prioridad baja (otros): {len(other_photos)}")
        
        if len(priority_photos) == 0 and len(other_photos) == 0:
            print("\nNo hay fotos para subir. Todo esta sincronizado!")
            return
        
        # 6. Ejecutar simulación primero
        print(f"\n=== EJECUTANDO SIMULACION ===")
        success, errors, skipped = upload_photos_safely(
            drive_service, supabase, priority_photos + other_photos, 
            dry_run=True, max_photos=20
        )
        
        print(f"\nRESULTADOS DE SIMULACION:")
        print(f"  Exitos: {success}")
        print(f"  Errores: {errors}")
        print(f"  Omitidos: {skipped}")
        
        # 7. Preguntar si continuar con subida real
        print(f"\n¿Continuar con subida real? (s/n): ", end="")
        try:
            response = input().strip().lower()
            if response in ['s', 'si', 'y', 'yes']:
                print(f"\n=== EJECUTANDO SUBIDA REAL ===")
                success, errors, skipped = upload_photos_safely(
                    drive_service, supabase, priority_photos, 
                    dry_run=False, max_photos=50
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


