import os
import io
import json
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from supabase import create_client, Client

# =========================================================
# CONFIGURACIÓN
# =========================================================
SUPABASE_URL = "https://gjmkvfljyxlvdazsbbgm.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqbWt2ZmxqeXhsdmRhenNiYmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0MDI1NSwiZXhwIjoyMDcxODE2MjU1fQ.daQA7Xu8y1GqJluTkQ5CXkRllrP44kR_hICk9FpUwjY"
BUCKET_NAME = "PRODUCT-PHOTO"

DRIVE_FOLDER_IDS = [
    "1OKSMHIWGeeO_TKkWFmHaYE019ZdH5i9v",
    "1H4Ul3p0wjFrStA1I-Oj-qZEMR0gAcyqT",
    "1759cgufQ3botgdnnGWMeVYFguvaOyxva",
    "1EBug7re42Vtw-OSfJOcVdsShoBNioRMA",
    "1uNDpBk0F4uE2Yl_xobVHJweYObjiFmhi"
]

SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

def authenticate_drive():
    """Autenticación con Google Drive"""
    creds = None
    
    # Verificar si existe token
    if os.path.exists('token.json'):
        try:
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        except:
            print("Token inválido, eliminando...")
            os.remove('token.json')
    
    # Si no hay credenciales válidas, autenticar
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except:
                print("Error refrescando token, reautenticando...")
                creds = None
        
        if not creds:
            print("Iniciando autenticación con Google Drive...")
            print("Se abrirá una ventana del navegador para autorizar la aplicación.")
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Guardar credenciales
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    
    return build('drive', 'v3', credentials=creds)

def main():
    print("INICIANDO SUBIDA DE FOTOS")
    print("=" * 40)
    
    # Conexión con Supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("OK - Supabase conectado")
    
    # Autenticación con Drive
    drive_service = authenticate_drive()
    print("OK - Google Drive autenticado")
    
    # Obtener productos
    print("\nObteniendo productos...")
    productos_response = supabase.table("productos").select("id, codigo, nombre, imagen_url").execute()
    productos = productos_response.data
    print(f"   {len(productos)} productos encontrados")
    
    # Obtener archivos de Drive
    print("\nObteniendo archivos de Drive...")
    all_files = []
    for folder_id in DRIVE_FOLDER_IDS:
        query = f"'{folder_id}' in parents and trashed = false"
        results = drive_service.files().list(
            q=query,
            pageSize=1000,
            fields="files(id, name, mimeType)"
        ).execute()
        files = results.get('files', [])
        all_files.extend(files)
        print(f"   Carpeta {folder_id}: {len(files)} archivos")
    
    print(f"   Total archivos en Drive: {len(all_files)}")
    
    # Crear diccionario por código
    drive_by_code = {}
    for file in all_files:
        name = file.get('name', '')
        if '.' in name:
            code = name.split('.')[0]
            drive_by_code[code] = file
    
    # Obtener archivos en Storage
    print("\nVerificando Storage...")
    try:
        storage_files = supabase.storage.from_(BUCKET_NAME).list()
        storage_names = {f['name'] for f in storage_files}
        print(f"   {len(storage_names)} archivos en Storage")
    except Exception as e:
        print(f"   ERROR: {e}")
        storage_names = set()
    
    # Identificar fotos para subir
    print("\nIdentificando fotos para subir...")
    to_upload = []
    
    for producto in productos:
        codigo = producto['codigo']
        if codigo in drive_by_code:
            file_info = drive_by_code[codigo]
            file_name = file_info['name']
            
            if file_name not in storage_names:
                to_upload.append({
                    'producto': producto,
                    'file_info': file_info,
                    'file_name': file_name
                })
    
    print(f"   {len(to_upload)} fotos listas para subir")
    
    if not to_upload:
        print("\nNO HAY FOTOS NUEVAS PARA SUBIR")
        return
    
    # Mostrar primeras fotos
    print(f"\nPrimeras 5 fotos a subir:")
    for i, foto in enumerate(to_upload[:5]):
        print(f"   {i+1}. {foto['file_name']} -> {foto['producto']['codigo']}")
    
    if len(to_upload) > 5:
        print(f"   ... y {len(to_upload) - 5} más")
    
    # Subir fotos
    print(f"\nIniciando subida de {len(to_upload)} fotos...")
    exitosos = 0
    errores = 0
    
    for i, foto in enumerate(to_upload):
        file_id = foto['file_info']['id']
        file_name = foto['file_name']
        mime_type = foto['file_info']['mimeType']
        producto = foto['producto']
        
        print(f"\n[{i+1}/{len(to_upload)}] {file_name}")
        
        try:
            # Descargar de Drive
            request = drive_service.files().get_media(fileId=file_id)
            file_content = io.BytesIO(request.execute())
            
            # Subir a Storage
            res = supabase.storage.from_(BUCKET_NAME).upload(
                path=file_name,
                file=file_content.read(),
                file_options={
                    "content-type": mime_type,
                    "upsert": "true"
                }
            )
            
            # Obtener URL
            public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_name)
            
            # Actualizar BD
            db_update = supabase.table("productos").update({
                "imagen_url": public_url
            }).eq("codigo", producto['codigo']).execute()
            
            if db_update.data:
                print(f"   OK - Subida exitosa")
                exitosos += 1
            else:
                print(f"   ADVERTENCIA - Archivo subido, BD no actualizada")
                exitosos += 1
                
        except Exception as e:
            print(f"   ERROR - {e}")
            errores += 1
    
    # Resumen
    print(f"\nRESUMEN:")
    print(f"Exitosos: {exitosos}")
    print(f"Errores: {errores}")
    print(f"Total: {len(to_upload)}")

if __name__ == '__main__':
    main()
