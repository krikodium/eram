import os
from supabase import create_client, Client

# =========================================================
# CONFIGURACIÓN
# =========================================================
SUPABASE_URL = "https://gjmkvfljyxlvdazsbbgm.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqbWt2ZmxqeXhsdmRhenNiYmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0MDI1NSwiZXhwIjoyMDcxODE2MjU1fQ.daQA7Xu8y1GqJluTkQ5CXkRllrP44kR_hICk9FpUwjY"
BUCKET_NAME = "PRODUCT-PHOTO"

def main():
    print("RESUMEN DE FOTOS SUBIDAS")
    print("=" * 50)
    
    # Conexión con Supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("OK - Conectado a Supabase")
    
    # Obtener todos los productos con imagen
    print("\nObteniendo productos con imagen...")
    productos_response = supabase.table("productos").select("id, codigo, nombre, imagen_url").not_.is_("imagen_url", "null").execute()
    productos_con_imagen = productos_response.data
    
    print(f"Total productos con imagen: {len(productos_con_imagen)}")
    
    # Obtener archivos en Storage
    print("\nVerificando archivos en Storage...")
    try:
        storage_files = supabase.storage.from_(BUCKET_NAME).list()
        storage_names = {f['name'] for f in storage_files}
        print(f"Total archivos en Storage: {len(storage_names)}")
    except Exception as e:
        print(f"ERROR: {e}")
        return
    
    # Crear diccionario de productos por código
    productos_por_codigo = {p['codigo']: p for p in productos_con_imagen}
    
    # Identificar fotos recién subidas (las que están en Storage y tienen productos)
    fotos_recien_subidas = []
    for file_name in storage_names:
        if '.' in file_name:
            codigo = file_name.split('.')[0]
            if codigo in productos_por_codigo:
                producto = productos_por_codigo[codigo]
                fotos_recien_subidas.append({
                    'codigo': codigo,
                    'nombre': producto['nombre'],
                    'archivo': file_name,
                    'url': producto['imagen_url']
                })
    
    print(f"\nFotos que coinciden con productos: {len(fotos_recien_subidas)}")
    
    # Mostrar resumen por categorías de archivos
    print(f"\nRESUMEN POR TIPO DE ARCHIVO:")
    print("-" * 30)
    
    tipos_archivo = {}
    for foto in fotos_recien_subidas:
        extension = foto['archivo'].split('.')[-1].lower()
        if extension not in tipos_archivo:
            tipos_archivo[extension] = []
        tipos_archivo[extension].append(foto)
    
    for extension, fotos in tipos_archivo.items():
        print(f"{extension.upper()}: {len(fotos)} archivos")
    
    # Mostrar primeras 20 fotos subidas
    print(f"\nPRIMERAS 20 FOTOS SUBIDAS:")
    print("-" * 50)
    for i, foto in enumerate(fotos_recien_subidas[:20]):
        print(f"{i+1:2d}. {foto['codigo']} - {foto['archivo']}")
        print(f"     Producto: {foto['nombre'][:60]}...")
        print(f"     URL: {foto['url']}")
        print()
    
    if len(fotos_recien_subidas) > 20:
        print(f"... y {len(fotos_recien_subidas) - 20} fotos más")
    
    # Estadísticas finales
    print(f"\nESTADÍSTICAS FINALES:")
    print("=" * 30)
    print(f"Total productos en BD: 328")
    print(f"Productos con imagen: {len(productos_con_imagen)}")
    print(f"Productos sin imagen: {328 - len(productos_con_imagen)}")
    print(f"Archivos en Storage: {len(storage_names)}")
    print(f"Fotos vinculadas a productos: {len(fotos_recien_subidas)}")
    print(f"Cobertura de imágenes: {(len(productos_con_imagen)/328)*100:.1f}%")
    
    # Verificar URLs válidas
    print(f"\nVERIFICACIÓN DE URLs:")
    print("-" * 20)
    urls_validas = 0
    urls_invalidas = 0
    
    for foto in fotos_recien_subidas:
        if foto['url'] and 'supabase' in foto['url']:
            urls_validas += 1
        else:
            urls_invalidas += 1
    
    print(f"URLs válidas: {urls_validas}")
    print(f"URLs inválidas: {urls_invalidas}")
    
    if urls_invalidas == 0:
        print("✅ Todas las URLs son válidas")
    else:
        print("⚠️ Hay URLs que necesitan revisión")

if __name__ == '__main__':
    main()
