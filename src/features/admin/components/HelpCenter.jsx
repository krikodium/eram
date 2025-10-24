import React, { useState } from 'react';
import { 
  FaQuestionCircle, 
  FaChevronDown, 
  FaChevronUp, 
  FaHome, 
  FaBox, 
  FaTags, 
  FaDownload, 
  FaUsers, 
  FaCog, 
  FaHistory, 
  FaDatabase, 
  FaChartLine,
  FaSearch,
  FaFilter,
  FaUpload,
  FaFileExport,
  FaFileImport,
  FaBell,
  FaShieldAlt,
  FaInfoCircle
} from 'react-icons/fa';

const HelpCenter = ({ isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const helpSections = [
    {
      id: 'dashboard',
      title: 'Dashboard Principal',
      icon: FaHome,
      description: 'Panel de control con estadísticas y métricas generales',
      steps: [
        'Visualiza estadísticas generales: total de productos, categorías, valor del inventario',
        'Revisa productos recientes agregados al sistema',
        'Accede a acciones rápidas para tareas comunes',
        'Monitorea productos sin imágenes en las notificaciones'
      ],
      tips: [
        'Las métricas se actualizan automáticamente',
        'Haz clic en "Ver todos" para acceder a listas completas',
        'Usa las acciones rápidas para navegación directa'
      ]
    },
    {
      id: 'productos',
      title: 'Gestión de Productos',
      icon: FaBox,
      description: 'Administra el catálogo completo de productos',
      steps: [
        'Agregar producto: Clic en "Nuevo Producto" → Completa formulario → Guardar',
        'Editar producto: Clic en el ícono de edición → Modifica datos → Guardar',
        'Eliminar producto: Clic en el ícono de eliminar → Confirmar acción',
        'Subir imágenes: Arrastra archivos o haz clic en "Seleccionar archivos"',
        'Filtrar productos: Usa los filtros avanzados para encontrar productos específicos'
      ],
      tips: [
        'Puedes subir hasta 5 imágenes por producto',
        'Las imágenes se comprimen automáticamente',
        'Usa la búsqueda para encontrar productos rápidamente',
        'Los productos inactivos no aparecen en la tienda'
      ]
    },
    {
      id: 'categorias',
      title: 'Gestión de Categorías',
      icon: FaTags,
      description: 'Organiza productos en categorías temáticas',
      steps: [
        'Crear categoría: Clic en "Nueva Categoría" → Ingresa nombre y descripción → Guardar',
        'Editar categoría: Clic en el ícono de edición → Modifica datos → Guardar',
        'Activar/Desactivar: Usa el toggle para mostrar/ocultar en la tienda',
        'Eliminar categoría: Clic en eliminar → Confirmar (solo si no tiene productos)'
      ],
      tips: [
        'Las categorías nuevas no aparecen automáticamente en el home',
        'Una categoría debe tener al menos un producto para ser visible',
        'Puedes reordenar categorías arrastrando y soltando'
      ]
    },
    {
      id: 'exportar',
      title: 'Exportar Datos',
      icon: FaDownload,
      description: 'Exporta productos y categorías en diferentes formatos',
      steps: [
        'Seleccionar tipo: Elige entre "Productos" o "Categorías"',
        'Seleccionar elementos: Marca los checkboxes de los elementos deseados',
        'Configurar exportación: Elige formato (CSV, PDF) y opciones',
        'Descargar: Clic en "Exportar" para descargar el archivo'
      ],
      tips: [
        'Puedes seleccionar todos los elementos con "Seleccionar todo"',
        'El PDF incluye formato de lista de precios profesional',
        'Los archivos CSV son compatibles con Excel'
      ]
    },
    {
      id: 'importar',
      title: 'Importar Productos',
      icon: FaUpload,
      description: 'Importa productos masivamente desde archivos CSV/Excel',
      steps: [
        'Preparar archivo: Descarga la plantilla de ejemplo',
        'Completar datos: Llena la plantilla con la información de productos',
        'Subir archivo: Arrastra el archivo o haz clic en "Seleccionar"',
        'Revisar datos: Verifica la información en la vista previa',
        'Importar: Clic en "Importar" para procesar los productos'
      ],
      tips: [
        'Usa la plantilla para evitar errores de formato',
        'Las categorías se crean automáticamente si no existen',
        'Revisa los errores antes de confirmar la importación'
      ]
    },
    {
      id: 'usuarios',
      title: 'Gestión de Usuarios',
      icon: FaUsers,
      description: 'Administra usuarios y permisos del sistema',
      steps: [
        'Ver usuarios: Lista completa de usuarios registrados',
        'Crear usuario: Clic en "Nuevo Usuario" → Completa datos → Guardar',
        'Editar usuario: Modifica información personal y permisos',
        'Activar/Desactivar: Controla el acceso al sistema',
        'Resetear contraseña: Envía enlace de restablecimiento por email'
      ],
      tips: [
        'Los roles determinan qué funciones puede usar cada usuario',
        'Los usuarios inactivos no pueden iniciar sesión',
        'Guarda los cambios de permisos inmediatamente'
      ]
    },
    {
      id: 'configuracion',
      title: 'Configuración de la Tienda',
      icon: FaCog,
      description: 'Personaliza la apariencia y configuración general',
      steps: [
        'Información general: Nombre, descripción, moneda de la tienda',
        'Branding: Sube logo, favicon y define colores principales',
        'Contacto: Email, teléfono, WhatsApp y dirección',
        'Redes sociales: Enlaces a perfiles sociales',
        'SEO: Meta títulos, descripciones y palabras clave',
        'Configuración avanzada: Modo mantenimiento, analytics'
      ],
      tips: [
        'Los cambios se aplican inmediatamente en la tienda',
        'Haz backup antes de cambiar configuraciones importantes',
        'Las imágenes se optimizan automáticamente'
      ]
    },
    {
      id: 'logs',
      title: 'Logs de Actividad',
      icon: FaHistory,
      description: 'Registro detallado de todas las acciones administrativas',
      steps: [
        'Ver logs: Lista cronológica de todas las actividades',
        'Filtrar: Por acción, usuario, fecha o severidad',
        'Buscar: Usa la búsqueda para encontrar actividades específicas',
        'Exportar: Descarga logs en formato CSV para análisis',
        'Limpiar: Elimina logs antiguos para optimizar rendimiento'
      ],
      tips: [
        'Los logs se mantienen por 90 días por defecto',
        'Usa filtros para encontrar actividades específicas',
        'Exporta logs regularmente para auditorías'
      ]
    },
    {
      id: 'backups',
      title: 'Gestión de Backups',
      icon: FaDatabase,
      description: 'Respalda y restaura la base de datos',
      steps: [
        'Backup manual: Clic en "Crear Backup" para respaldo inmediato',
        'Backup automático: Se ejecuta diariamente automáticamente',
        'Ver historial: Lista de todos los backups realizados',
        'Restaurar: Selecciona un backup y confirma la restauración',
        'Descargar: Descarga backups para almacenamiento externo'
      ],
      tips: [
        'Los backups automáticos se ejecutan a las 2:00 AM',
        'Mantén backups recientes antes de cambios importantes',
        'Verifica la integridad de los backups regularmente'
      ]
    },
    {
      id: 'metricas',
      title: 'Métricas y Análisis',
      icon: FaChartLine,
      description: 'Visualiza estadísticas y tendencias del negocio',
      steps: [
        'Seleccionar período: Elige rango de fechas para análisis',
        'Ver gráficos: Productos por categoría, tendencias de precios',
        'Analizar actividad: Productos más vistos, categorías populares',
        'Exportar reportes: Descarga gráficos y datos en PDF',
        'Configurar alertas: Notificaciones para métricas importantes'
      ],
      tips: [
        'Los gráficos se actualizan en tiempo real',
        'Usa diferentes períodos para comparar tendencias',
        'Exporta reportes para presentaciones'
      ]
    },
    {
      id: 'busqueda',
      title: 'Búsqueda Global',
      icon: FaSearch,
      description: 'Busca información en toda la base de datos',
      steps: [
        'Abrir búsqueda: Presiona Ctrl+K o haz clic en el ícono de búsqueda',
        'Escribir consulta: Ingresa términos de búsqueda',
        'Filtrar resultados: Usa las pestañas para filtrar por tipo',
        'Navegar: Haz clic en resultados para ir a la página correspondiente',
        'Cerrar: Presiona Escape o haz clic fuera del modal'
      ],
      tips: [
        'La búsqueda incluye productos, categorías y logs',
        'Usa palabras clave específicas para mejores resultados',
        'Los resultados se actualizan mientras escribes'
      ]
    },
    {
      id: 'filtros',
      title: 'Filtros Avanzados',
      icon: FaFilter,
      description: 'Filtra datos con criterios específicos',
      steps: [
        'Abrir filtros: Clic en "Filtros Avanzados" en las páginas de listado',
        'Seleccionar criterios: Categoría, rango de precios, fechas, estado',
        'Aplicar filtros: Clic en "Aplicar" para filtrar resultados',
        'Limpiar filtros: Clic en "Limpiar" para resetear todos los filtros',
        'Guardar filtros: Los filtros se mantienen durante la sesión'
      ],
      tips: [
        'Combina múltiples filtros para búsquedas precisas',
        'Los filtros se aplican en tiempo real',
        'Guarda filtros frecuentes para uso rápido'
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (!isOpen) return null;

  return (
    <div className="help-overlay">
      <div className="help-modal">
        <div className="help-header">
          <h2 className="help-title">
            <FaQuestionCircle className="help-icon" />
            Centro de Ayuda
          </h2>
          <button className="help-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="help-content">
          <div className="help-intro">
            <p className="help-intro-text">
              Bienvenido al Centro de Ayuda del Panel Administrativo. Aquí encontrarás 
              guías paso a paso para cada sección del sistema.
            </p>
          </div>

          <div className="help-sections">
            {helpSections.map((section) => {
              const IconComponent = section.icon;
              const isExpanded = expandedSection === section.id;

              return (
                <div key={section.id} className="help-section">
                  <div 
                    className="help-section-header"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="help-section-title">
                      <IconComponent className="help-section-icon" />
                      <div>
                        <h3>{section.title}</h3>
                        <p>{section.description}</p>
                      </div>
                    </div>
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>

                  {isExpanded && (
                    <div className="help-section-content">
                      <div className="help-steps">
                        <h4>Pasos a seguir:</h4>
                        <ol>
                          {section.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="help-tips">
                        <h4>Consejos útiles:</h4>
                        <ul>
                          {section.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="help-footer">
            <div className="help-contact">
              <FaInfoCircle className="help-contact-icon" />
              <p>
                ¿Necesitas más ayuda? Contacta al administrador del sistema 
                o revisa la documentación técnica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

