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
    """Sube fotos que están disponibles en Drive y coinciden con productos"""
    print("INICIANDO SUBIDA DE FOTOS DISPONIBLES")
    print("=" * 50)
    
    # 1. Conexión con Supabase
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("OK - Conexión con Supabase establecida")
    
    # 2. Autenticación con Google Drive
    drive_service = authenticate_drive()
    print("OK - Autenticación con Google Drive exitosa")
    
    # 3. Obtener todos los productos de la BD
    print("\nObteniendo productos de la base de datos...")
    productos_response = supabase.table("productos").select("id, codigo, nombre, imagen_url").execute()
    productos = productos_response.data
    print(f"   Total de productos: {len(productos)}")
    
    # 4. Obtener archivos de Google Drive
    print("\nObteniendo archivos de Google Drive...")
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
    
    # 5. Crear diccionario de archivos de Drive por código
    drive_files_by_code = {}
    for file in all_drive_files:
        file_name = file.get('name', '')
        if '.' in file_name:
            code = file_name.split('.')[0]
            drive_files_by_code[code] = file
    
    # 6. Obtener archivos ya subidos en Supabase Storage
    print("\nVerificando archivos ya subidos en Storage...")
    try:
        storage_files = supabase.storage.from_(BUCKET_NAME).list()
        storage_filenames = {f['name'] for f in storage_files}
        print(f"   Archivos ya en Storage: {len(storage_filenames)}")
    except Exception as e:
        print(f"   ERROR accediendo a Storage: {e}")
        storage_filenames = set()
    
    # 7. Identificar fotos para subir
    print("\nIdentificando fotos para subir...")
    fotos_para_subir = []
    
    for producto in productos:
        codigo = producto['codigo']
        if codigo in drive_files_by_code:
            file_info = drive_files_by_code[codigo]
            file_name = file_info['name']
            
            # Verificar si ya está subido
            if file_name not in storage_filenames:
                fotos_para_subir.append({
                    'producto': producto,
                    'file_info': file_info,
                    'file_name': file_name
                })
    
    print(f"   Fotos identificadas para subir: {len(fotos_para_subir)}")
    
    if not fotos_para_subir:
        print("\nNO HAY FOTOS NUEVAS PARA SUBIR")
        print("   Todas las fotos disponibles ya están en Storage")
        return
    
    # 8. Mostrar algunas fotos que se van a subir
    print(f"\nPRIMERAS 10 FOTOS A SUBIR:")
    for i, foto in enumerate(fotos_para_subir[:10]):
        print(f"   {i+1}. {foto['file_name']} -> {foto['producto']['codigo']} - {foto['producto']['nombre'][:50]}...")
    
    if len(fotos_para_subir) > 10:
        print(f"   ... y {len(fotos_para_subir) - 10} más")
    
    # 9. Confirmar subida
    print(f"\n¿Continuar con la subida de {len(fotos_para_subir)} fotos? (s/n): ", end="")
    respuesta = input().lower().strip()
    
    if respuesta != 's':
        print("Subida cancelada por el usuario")
        return
    
    # 10. Subir fotos
    print(f"\nIniciando subida de {len(fotos_para_subir)} fotos...")
    exitosos = 0
    errores = 0
    
    for i, foto in enumerate(fotos_para_subir):
        file_id = foto['file_info']['id']
        file_name = foto['file_name']
        mime_type = foto['file_info']['mimeType']
        producto = foto['producto']
        
        print(f"\n[{i+1}/{len(fotos_para_subir)}] Subiendo: {file_name}")
        
        try:
            # Descargar archivo de Drive
            request = drive_service.files().get_media(fileId=file_id)
            file_content = io.BytesIO(request.execute())
            
            # Subir a Supabase Storage
            res = supabase.storage.from_(BUCKET_NAME).upload(
                path=file_name,
                file=file_content.read(),
                file_options={
                    "content-type": mime_type,
                    "upsert": "true"
                }
            )
            
            # Obtener URL pública
            public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_name)
            
            # Actualizar producto en BD
            db_update = supabase.table("productos").update({
                "imagen_url": public_url
            }).eq("codigo", producto['codigo']).execute()
            
            if db_update.data:
                print(f"   OK - Subida exitosa: {public_url}")
                exitosos += 1
            else:
                print(f"   ADVERTENCIA - Archivo subido pero BD no actualizada")
                exitosos += 1
                
        except Exception as e:
            print(f"   ERROR - {e}")
            errores += 1
    
    # 11. Resumen final
    print(f"\nRESUMEN DE SUBIDA:")
    print("=" * 20)
    print(f"Exitosos: {exitosos}")
    print(f"Errores: {errores}")
    print(f"Total procesados: {len(fotos_para_subir)}")
    
    if exitosos > 0:
        print(f"\nOK - {exitosos} fotos subidas correctamente")
    
    if errores > 0:
        print(f"\nERROR - {errores} fotos fallaron en la subida")

if __name__ == '__main__':
    main()

