#!/usr/bin/env python3
"""
Script para subir fotos locales a Supabase Storage
Funciona con fotos descargadas localmente de Google Drive
"""

import os
import glob
from pathlib import Path
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

# Directorio local donde están las fotos descargadas
LOCAL_PHOTOS_DIR = "fotos_productos"  # Cambia esto por la ruta donde tienes las fotos

# Extensiones de imagen válidas
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']

def get_image_files(directory):
    """Obtiene todos los archivos de imagen de un directorio."""
    image_files = []
    
    if not os.path.exists(directory):
        print(f"❌ El directorio {directory} no existe")
        return image_files
    
    # Buscar archivos con extensiones de imagen
    for ext in IMAGE_EXTENSIONS:
        pattern = os.path.join(directory, f"*{ext}")
        files = glob.glob(pattern, recursive=True)
        image_files.extend(files)
        
        # También buscar con extensión en mayúsculas
        pattern = os.path.join(directory, f"*{ext.upper()}")
        files = glob.glob(pattern, recursive=True)
        image_files.extend(files)
    
    return image_files

def get_mime_type(filename):
    """Determina el MIME type basándose en la extensión del archivo."""
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

def upload_photo_to_supabase(supabase, file_path, filename):
    """Sube una foto a Supabase Storage."""
    try:
        with open(file_path, 'rb') as f:
            file_content = f.read()
        
        mime_type = get_mime_type(filename)
        
        # Subir a Supabase Storage
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
        
        # Obtener URL pública
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

def main():
    """Función principal para subir fotos locales a Supabase."""
    print("📸 SUBIDOR DE FOTOS LOCALES A SUPABASE")
    print("=" * 50)
    
    # Verificar directorio
    if not os.path.exists(LOCAL_PHOTOS_DIR):
        print(f"❌ El directorio {LOCAL_PHOTOS_DIR} no existe")
        print(f"   Crea el directorio y coloca ahí las fotos descargadas de Google Drive")
        return
    
    # Conectar a Supabase
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Conexión con Supabase establecida")
    except Exception as e:
        print(f"❌ Error al conectar con Supabase: {e}")
        return
    
    # Obtener archivos de imagen
    image_files = get_image_files(LOCAL_PHOTOS_DIR)
    
    if not image_files:
        print(f"❌ No se encontraron archivos de imagen en {LOCAL_PHOTOS_DIR}")
        print(f"   Asegúrate de que el directorio contenga archivos con extensiones: {', '.join(IMAGE_EXTENSIONS)}")
        return
    
    print(f"📁 Se encontraron {len(image_files)} archivos de imagen")
    
    # Estadísticas
    stats = {
        'total': len(image_files),
        'uploaded': 0,
        'updated_db': 0,
        'errors': 0,
        'not_found_in_db': 0
    }
    
    # Procesar cada archivo
    for i, file_path in enumerate(image_files, 1):
        filename = os.path.basename(file_path)
        product_code = os.path.splitext(filename)[0]
        
        print(f"\n[{i}/{len(image_files)}] Procesando: {filename}")
        print(f"   Código de producto: {product_code}")
        
        # Subir a Supabase Storage
        image_url, upload_error = upload_photo_to_supabase(supabase, file_path, filename)
        
        if upload_error:
            print(f"   ❌ Error al subir: {upload_error}")
            stats['errors'] += 1
            continue
        
        print(f"   ✅ Subido exitosamente: {image_url}")
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
    
    # Resumen final
    print(f"\n📊 RESUMEN FINAL:")
    print(f"   📁 Total de archivos procesados: {stats['total']}")
    print(f"   ✅ Archivos subidos a Supabase: {stats['uploaded']}")
    print(f"   🗄️  Registros actualizados en DB: {stats['updated_db']}")
    print(f"   ⚠️  Productos no encontrados en DB: {stats['not_found_in_db']}")
    print(f"   ❌ Errores: {stats['errors']}")
    
    if stats['errors'] == 0:
        print(f"\n🎉 ¡Proceso completado exitosamente!")
    else:
        print(f"\n⚠️  Proceso completado con algunos errores")

if __name__ == '__main__':
    main()


