import os
import io
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from supabase import create_client, Client

# =========================================================
# CONFIGURACIÓN DEL SCRIPT
# =========================================================
SUPABASE_URL = "https://gjmkvfljyxlvdazsbbgm.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqbWt2ZmxqeXhsdmRhenNiYmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0MDI1NSwiZXhwIjoyMDcxODE2MjU1fQ.daQA7Xu8y1GqJluTkQ5CXkRllrP44kR_hICk9FpUwjY"
BUCKET_NAME = "PRODUCT-PHOTO"

# IDs de las carpetas de Google Drive
DRIVE_FOLDER_IDS = [
    "1OKSMHIWGeeO_TKkWFmHaYE019ZdH5i9v",
    "1H4Ul3p0wjFrStA1I-Oj-qZEMR0gAcyqT",
    "1759cgufQ3botgdnnGWMeVYFguvaOyxva",
    "1EBug7re42Vtw-OSfJOcVdsShoBNioRMA",
    "1uNDpBk0F4uE2Yl_xobVHJweYObjiFmhi"
]

DRIVE_CREDENTIALS_FILE = "credentials.json"
DRIVE_TOKEN_FILE = 'token.json'
SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.readonly']

# =========================================================
# FUNCIONES DE AUTENTICACIÓN
# =========================================================
def authenticate_drive():
    """Maneja la autenticación con Google Drive"""
    creds = None
    if os.path.exists(DRIVE_TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(DRIVE_TOKEN_FILE, SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(DRIVE_CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        
        with open(DRIVE_TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
    
    return build('drive', 'v3', credentials=creds)

def main():
    """Análisis completo del estado de fotos"""
    print("🔍 INICIANDO ANÁLISIS COMPLETO DE FOTOS")
    print("=" * 50)
    
    # 1. Conexión con Supabase
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Conexión con Supabase establecida")
    
    # 2. Autenticación con Google Drive
    drive_service = authenticate_drive()
    print("✅ Autenticación con Google Drive exitosa")
    
    # 3. Obtener todos los productos de la BD
    print("\n📊 Analizando productos en la base de datos...")
    productos_response = supabase.table("productos").select("id, codigo, nombre, imagen_url").execute()
    productos = productos_response.data
    
    print(f"   Total de productos en BD: {len(productos)}")
    
    # 4. Obtener archivos de Google Drive
    print("\n📁 Analizando archivos en Google Drive...")
    all_drive_files = []
    for folder_id in DRIVE_FOLDER_IDS:
        print(f"   Carpeta {folder_id}...")
        query = f"'{folder_id}' in parents and trashed = false"
        results = drive_service.files().list(
            q=query,
            pageSize=1000,
            fields="nextPageToken, files(id, name, mimeType)"
        ).execute()
        files_in_folder = results.get('files', [])
        all_drive_files.extend(files_in_folder)
    
    print(f"   Total de archivos en Drive: {len(all_drive_files)}")
    
    # 5. Obtener archivos de Supabase Storage
    print("\n☁️ Analizando archivos en Supabase Storage...")
    try:
        storage_files = supabase.storage.from_(BUCKET_NAME).list()
        print(f"   Total de archivos en Storage: {len(storage_files)}")
    except Exception as e:
        print(f"   ❌ Error accediendo a Storage: {e}")
        storage_files = []
    
    # 6. Análisis de coincidencias
    print("\n🔍 ANÁLISIS DE COINCIDENCIAS")
    print("=" * 30)
    
    # Productos con imagen vs sin imagen
    productos_con_imagen = [p for p in productos if p.get('imagen_url')]
    productos_sin_imagen = [p for p in productos if not p.get('imagen_url')]
    
    print(f"📊 Productos con imagen: {len(productos_con_imagen)}")
    print(f"📊 Productos sin imagen: {len(productos_sin_imagen)}")
    
    # Archivos de Drive que coinciden con productos
    drive_codes = set()
    for file in all_drive_files:
        file_name = file.get('name', '')
        if '.' in file_name:
            code = file_name.split('.')[0]
            drive_codes.add(code)
    
    productos_codes = set(p['codigo'] for p in productos)
    coincidencias = drive_codes.intersection(productos_codes)
    
    print(f"📊 Códigos en Drive que coinciden con productos: {len(coincidencias)}")
    print(f"📊 Códigos en Drive que NO coinciden: {len(drive_codes - coincidencias)}")
    
    # 7. Productos sin imagen que SÍ tienen foto en Drive
    productos_sin_imagen_codes = set(p['codigo'] for p in productos_sin_imagen)
    fotos_disponibles = coincidencias.intersection(productos_sin_imagen_codes)
    
    print(f"\n🎯 PRODUCTOS QUE NECESITAN FOTOS:")
    print(f"   Productos sin imagen: {len(productos_sin_imagen)}")
    print(f"   De estos, tienen foto en Drive: {len(fotos_disponibles)}")
    print(f"   De estos, NO tienen foto en Drive: {len(productos_sin_imagen_codes - fotos_disponibles)}")
    
    # 8. Mostrar algunos ejemplos
    print(f"\n📋 EJEMPLOS DE PRODUCTOS SIN IMAGEN:")
    for i, producto in enumerate(productos_sin_imagen[:10]):
        tiene_foto = producto['codigo'] in fotos_disponibles
        status = "✅ Tiene foto en Drive" if tiene_foto else "❌ No tiene foto en Drive"
        print(f"   {i+1}. {producto['codigo']} - {producto['nombre'][:50]}... {status}")
    
    if len(productos_sin_imagen) > 10:
        print(f"   ... y {len(productos_sin_imagen) - 10} más")
    
    # 9. Resumen final
    print(f"\n📈 RESUMEN FINAL:")
    print("=" * 20)
    print(f"✅ Productos con imagen: {len(productos_con_imagen)}")
    print(f"❌ Productos sin imagen: {len(productos_sin_imagen)}")
    print(f"📁 Fotos disponibles en Drive: {len(fotos_disponibles)}")
    print(f"🎯 Fotos listas para subir: {len(fotos_disponibles)}")
    
    if fotos_disponibles:
        print(f"\n🚀 PRÓXIMO PASO:")
        print(f"   Ejecutar script de subida para {len(fotos_disponibles)} fotos")
    else:
        print(f"\n⚠️  NO HAY FOTOS PARA SUBIR")
        print(f"   Todos los productos sin imagen no tienen fotos en Drive")

if __name__ == '__main__':
    main()

