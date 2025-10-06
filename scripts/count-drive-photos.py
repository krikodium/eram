#!/usr/bin/env python3
"""
Script para contar fotos en Google Drive
Verifica cuántas imágenes hay en las carpetas de Drive antes de subirlas
"""

import os
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# =========================================================
# CONFIGURACIÓN
# =========================================================

# IDs de las 5 carpetas de Drive
DRIVE_FOLDER_IDS = [
    "1OKSMHIWGeeO_TKkWFmHaYE019ZdH5i9v",
    "1H4Ul3p0wjFrStA1I-Oj-qZEMR0gAcyqT", 
    "1759cgufQ3botgdnnGWMeVYFguvaOyxva",
    "1EBug7re42Vtw-OSfJOcVdsShoBNioRMA",
    "1uNDpBk0F4uE2Yl_xobVHJweYObjiFmhi"
]

# Carpeta de producción (nueva)
PRODUCTION_FOLDER_ID = "1WE_HGMrhsv5LRE7CrYFOgPljN6MKvRls"

DRIVE_CREDENTIALS_FILE = "credentials.json"
DRIVE_TOKEN_FILE = 'token.json'
SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
          'https://www.googleapis.com/auth/drive.readonly']

# Extensiones de imagen válidas
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']

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

def is_image_file(filename):
    """Verifica si un archivo es una imagen basándose en su extensión."""
    return any(filename.lower().endswith(ext) for ext in IMAGE_EXTENSIONS)

def count_files_in_folder(drive_service, folder_id, folder_name=""):
    """Cuenta archivos en una carpeta específica."""
    print(f"\n📁 Analizando carpeta: {folder_name or folder_id}")
    
    try:
        query = f"'{folder_id}' in parents and trashed = false"
        results = drive_service.files().list(
            q=query,
            pageSize=1000,
            fields="nextPageToken, files(id, name, mimeType, size)"
        ).execute()
        
        files = results.get('files', [])
        
        # Filtrar solo imágenes
        image_files = [f for f in files if is_image_file(f.get('name', ''))]
        
        print(f"   📊 Total de archivos: {len(files)}")
        print(f"   🖼️  Imágenes encontradas: {len(image_files)}")
        
        # Mostrar algunos ejemplos
        if image_files:
            print(f"   📋 Ejemplos de imágenes:")
            for i, img in enumerate(image_files[:5]):  # Mostrar solo los primeros 5
                name = img.get('name', 'Sin nombre')
                size = img.get('size', 'Desconocido')
                print(f"      {i+1}. {name} ({size} bytes)")
            
            if len(image_files) > 5:
                print(f"      ... y {len(image_files) - 5} más")
        
        return len(image_files), image_files
        
    except Exception as e:
        print(f"   ❌ Error al acceder a la carpeta {folder_id}: {e}")
        return 0, []

def main():
    """Función principal para contar fotos en todas las carpetas."""
    print("🔍 CONTADOR DE FOTOS EN GOOGLE DRIVE")
    print("=" * 50)
    
    try:
        # Autenticación
        drive_service = authenticate_drive()
        print("✅ Autenticación con Google Drive exitosa")
        
        total_images = 0
        all_image_files = []
        
        # Contar en las carpetas originales
        print(f"\n📂 CARPETAS ORIGINALES ({len(DRIVE_FOLDER_IDS)} carpetas):")
        for i, folder_id in enumerate(DRIVE_FOLDER_IDS, 1):
            count, files = count_files_in_folder(drive_service, folder_id, f"Carpeta {i}")
            total_images += count
            all_image_files.extend(files)
        
        # Contar en la carpeta de producción
        print(f"\n📂 CARPETA DE PRODUCCIÓN:")
        prod_count, prod_files = count_files_in_folder(drive_service, PRODUCTION_FOLDER_ID, "Producción 11/08")
        total_images += prod_count
        all_image_files.extend(prod_files)
        
        # Resumen final
        print(f"\n📊 RESUMEN FINAL:")
        print(f"   🖼️  Total de imágenes encontradas: {total_images}")
        print(f"   📁 Carpetas analizadas: {len(DRIVE_FOLDER_IDS) + 1}")
        
        # Análisis por tipo de archivo
        file_types = {}
        for file in all_image_files:
            name = file.get('name', '')
            ext = os.path.splitext(name)[1].lower()
            file_types[ext] = file_types.get(ext, 0) + 1
        
        if file_types:
            print(f"\n📈 ANÁLISIS POR TIPO DE ARCHIVO:")
            for ext, count in sorted(file_types.items()):
                print(f"   {ext}: {count} archivos")
        
        # Verificar códigos de productos
        print(f"\n🔍 ANÁLISIS DE CÓDIGOS DE PRODUCTO:")
        codes = [os.path.splitext(f.get('name', ''))[0] for f in all_image_files]
        unique_codes = set(codes)
        print(f"   📋 Códigos únicos encontrados: {len(unique_codes)}")
        print(f"   🔢 Total de archivos: {len(codes)}")
        
        if len(codes) != len(unique_codes):
            duplicates = len(codes) - len(unique_codes)
            print(f"   ⚠️  Archivos duplicados: {duplicates}")
        
        print(f"\n✅ Análisis completado exitosamente!")
        
    except Exception as e:
        print(f"❌ Error durante el análisis: {e}")

if __name__ == '__main__':
    main()


