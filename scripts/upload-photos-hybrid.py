#!/usr/bin/env python3
"""
Script híbrido para subir fotos a Supabase
Puede trabajar con Google Drive directamente o con archivos locales
"""

import os
import io
import glob
from pathlib import Path
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

# Configuración de Google Drive
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

# Configuración local
LOCAL_PHOTOS_DIR = "fotos_productos"

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
# FUNCIONES DE UTILIDAD
# =========================================================

def is_image_file(filename):
    """Verifica si un archivo es una imagen."""
    return any(filename.lower().endswith(ext) for ext in IMAGE_EXTENSIONS)

def get_mime_type(filename):
    """Determina el MIME type basándose en la extensión."""
    ext = os.path.splitext(filename)[1].lower()
    mime_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp',
        '.tiff': 'image/tiff'
    }
    return mime_types.get(ext, 'image/jpeg')

def upload_to_supabase(supabase, file_content, filename, mime_type):
    """Sube un archivo a Supabase Storage."""
    try:
        res = supabase.storage.from_(BUCKET_NAME).upload(
            path=filename,
            file=file_content,
            file_options={
                "content-type": mime_type,
                "upsert": "true"
            }
        )
        
        if res.get('error'):
            raise Exception(f"Error de Supabase: {res['error']}")
        
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(filename)
        return public_url, None
        
    except Exception as e:
        return None, str(e)

def update_database(supabase, product_code, image_url):
    """Actualiza la base de datos con la URL de la imagen."""
    try:
        result = supabase.table(DB_TABLE).update({
            IMAGE_URL_COLUMN: image_url
        }).eq(PRODUCT_CODE_COLUMN, product_code).execute()
        
        return len(result.data) > 0, None
        
    except Exception as e:
        return False, str(e)

# =========================================================
# FUNCIONES DE PROCESAMIENTO
# =========================================================

def process_drive_files(supabase, drive_service, folder_ids):
    """Procesa archivos desde Google Drive."""
    print("🌐 Procesando archivos desde Google Drive...")
    
    all_files = []
    
    for folder_id in folder_ids:
        print(f"📁 Buscando archivos en carpeta: {folder_id}")
        
        try:
            query = f"'{folder_id}' in parents and trashed = false"
            results = drive_service.files().list(
                q=query,
                pageSize=1000,
                fields="nextPageToken, files(id, name, mimeType)"
            ).execute()
            
            files = results.get('files', [])
            image_files = [f for f in files if is_image_file(f.get('name', ''))]
            all_files.extend(image_files)
            
            print(f"   ✅ Encontrados {len(image_files)} archivos de imagen")
            
        except Exception as e:
            print(f"   ❌ Error al acceder a la carpeta {folder_id}: {e}")
    
    return all_files

def process_local_files(local_dir):
    """Procesa archivos locales."""
    print(f"📁 Procesando archivos locales desde: {local_dir}")
    
    if not os.path.exists(local_dir):
        print(f"❌ El directorio {local_dir} no existe")
        return []
    
    image_files = []
    for ext in IMAGE_EXTENSIONS:
        pattern = os.path.join(local_dir, f"*{ext}")
        files = glob.glob(pattern, recursive=True)
        image_files.extend(files)
        
        pattern = os.path.join(local_dir, f"*{ext.upper()}")
        files = glob.glob(pattern, recursive=True)
        image_files.extend(files)
    
    print(f"✅ Encontrados {len(image_files)} archivos de imagen")
    return image_files

def upload_files(supabase, files, is_drive=True):
    """Sube archivos a Supabase y actualiza la base de datos."""
    stats = {
        'total': len(files),
        'uploaded': 0,
        'updated_db': 0,
        'errors': 0,
        'not_found_in_db': 0
    }
    
    for i, file_info in enumerate(files, 1):
        if is_drive:
            # Procesar archivo de Google Drive
            file_id = file_info.get('id')
            filename = file_info.get('name')
            mime_type = file_info.get('mimeType')
            
            print(f"\n[{i}/{len(files)}] Procesando desde Drive: {filename}")
            
            try:
                # Descargar desde Drive
                request = drive_service.files().get_media(fileId=file_id)
                file_content = io.BytesIO(request.execute()).read()
                
            except Exception as e:
                print(f"   ❌ Error al descargar: {e}")
                stats['errors'] += 1
                continue
        else:
            # Procesar archivo local
            file_path = file_info
            filename = os.path.basename(file_path)
            mime_type = get_mime_type(filename)
            
            print(f"\n[{i}/{len(files)}] Procesando local: {filename}")
            
            try:
                with open(file_path, 'rb') as f:
                    file_content = f.read()
                    
            except Exception as e:
                print(f"   ❌ Error al leer archivo: {e}")
                stats['errors'] += 1
                continue
        
        # Obtener código de producto
        product_code = os.path.splitext(filename)[0]
        
        # Subir a Supabase
        image_url, upload_error = upload_to_supabase(supabase, file_content, filename, mime_type)
        
        if upload_error:
            print(f"   ❌ Error al subir: {upload_error}")
            stats['errors'] += 1
            continue
        
        print(f"   ✅ Subido: {image_url}")
        stats['uploaded'] += 1
        
        # Actualizar base de datos
        db_updated, db_error = update_database(supabase, product_code, image_url)
        
        if db_error:
            print(f"   ❌ Error al actualizar DB: {db_error}")
            stats['errors'] += 1
        elif db_updated:
            print(f"   ✅ Base de datos actualizada")
            stats['updated_db'] += 1
        else:
            print(f"   ⚠️  Producto {product_code} no encontrado en la base de datos")
            stats['not_found_in_db'] += 1
    
    return stats

# =========================================================
# FUNCIÓN PRINCIPAL
# =========================================================

def main():
    """Función principal."""
    print("📸 SUBIDOR HÍBRIDO DE FOTOS A SUPABASE")
    print("=" * 50)
    
    # Conectar a Supabase
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Conexión con Supabase establecida")
    except Exception as e:
        print(f"❌ Error al conectar con Supabase: {e}")
        return
    
    # Preguntar modo de operación
    print("\n🔧 Selecciona el modo de operación:")
    print("1. Google Drive (requiere credentials.json)")
    print("2. Archivos locales (requiere carpeta local)")
    print("3. Ambos (Drive + Local)")
    
    choice = input("\nIngresa tu opción (1/2/3): ").strip()
    
    all_files = []
    drive_service = None
    
    if choice in ['1', '3']:
        # Procesar Google Drive
        try:
            drive_service = authenticate_drive()
            print("✅ Autenticación con Google Drive exitosa")
            
            # Incluir carpeta de producción
            folder_ids = DRIVE_FOLDER_IDS + [PRODUCTION_FOLDER_ID]
            drive_files = process_drive_files(supabase, drive_service, folder_ids)
            all_files.extend(drive_files)
            
        except Exception as e:
            print(f"❌ Error con Google Drive: {e}")
            if choice == '1':
                return
    
    if choice in ['2', '3']:
        # Procesar archivos locales
        local_files = process_local_files(LOCAL_PHOTOS_DIR)
        all_files.extend(local_files)
    
    if not all_files:
        print("❌ No se encontraron archivos para procesar")
        return
    
    print(f"\n📊 Total de archivos a procesar: {len(all_files)}")
    
    # Subir archivos
    if choice in ['1', '3'] and drive_service:
        drive_files = [f for f in all_files if isinstance(f, dict)]
        if drive_files:
            print(f"\n🌐 Subiendo {len(drive_files)} archivos desde Google Drive...")
            drive_stats = upload_files(supabase, drive_files, is_drive=True)
            
            print(f"\n📊 ESTADÍSTICAS DE GOOGLE DRIVE:")
            print(f"   📁 Total procesados: {drive_stats['total']}")
            print(f"   ✅ Subidos: {drive_stats['uploaded']}")
            print(f"   🗄️  DB actualizada: {drive_stats['updated_db']}")
            print(f"   ⚠️  No encontrados en DB: {drive_stats['not_found_in_db']}")
            print(f"   ❌ Errores: {drive_stats['errors']}")
    
    if choice in ['2', '3']:
        local_files = [f for f in all_files if isinstance(f, str)]
        if local_files:
            print(f"\n📁 Subiendo {len(local_files)} archivos locales...")
            local_stats = upload_files(supabase, local_files, is_drive=False)
            
            print(f"\n📊 ESTADÍSTICAS DE ARCHIVOS LOCALES:")
            print(f"   📁 Total procesados: {local_stats['total']}")
            print(f"   ✅ Subidos: {local_stats['uploaded']}")
            print(f"   🗄️  DB actualizada: {local_stats['updated_db']}")
            print(f"   ⚠️  No encontrados en DB: {local_stats['not_found_in_db']}")
            print(f"   ❌ Errores: {local_stats['errors']}")
    
    print(f"\n🎉 ¡Proceso completado!")

if __name__ == '__main__':
    main()


