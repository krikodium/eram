// src/components/CategoryGrid.jsx - Professional Category Grid Component
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriaService } from '../services/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShield,
  faHardHat,
  faWrench,
  faExclamationTriangle,
  faHeart,
  faFire,
  faIndustry,
  faHeadphones,
  faShirt,
  faCar,
  faArrowUp,
  faUmbrella,
  faBox,
  faGlasses,
  faThermometer,
  faMountain,
  faUser,
  faRunning,
  faTape,
  faFirstAid,
  faTent,
  faSkull,
  faExclamationCircle,
  faEye,
  faMask,
  faFireExtinguisher,
  faExclamation,
  faTools,
  faRadiation,
  faTshirt,
  faClipboardCheck,
  faStethoscope,
  faBolt,
  faLayerGroup,
  faPlus,
  faCross,
  faSquare,
  faCircle,
  faChevronDown,
  faChevronUp,
  // Iconos industriales específicos
} from '@fortawesome/free-solid-svg-icons';
import './CategoryGrid.css';

// Enhanced Icon Configuration - Using Only Verified FontAwesome Icons
const CATEGORY_ICONS = {
  // Categorías principales del catálogo ERAM - Iconos industriales específicos
  "Cintas Industriales": { 
    icon: <FontAwesomeIcon icon={faTape} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Delantales": { 
    icon: <FontAwesomeIcon icon={faTshirt} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Escaleras": { 
    icon: <FontAwesomeIcon icon={faArrowUp} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Incendio": { 
    icon: <FontAwesomeIcon icon={faFireExtinguisher} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Indumentaria De Lluvia": { 
    icon: <FontAwesomeIcon icon={faUmbrella} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Kits Vehiculares": { 
    icon: <FontAwesomeIcon icon={faCar} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Kraftex": { 
    icon: <FontAwesomeIcon icon={faBox} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Primeros Auxilios": { 
    icon: <FontAwesomeIcon icon={faFirstAid} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Proteccion Auditiva": { 
    icon: <FontAwesomeIcon icon={faHeadphones} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Proteccion En Altura": { 
    icon: <FontAwesomeIcon icon={faMountain} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Proteccion Facial": { 
    icon: <FontAwesomeIcon icon={faMask} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Proteccion Ocular": { 
    icon: <FontAwesomeIcon icon={faGlasses} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Proteccion Respiratoria": { 
    icon: <FontAwesomeIcon icon={faMask} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Señalizacion Industrial": { 
    icon: <FontAwesomeIcon icon={faExclamationCircle} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Señalización Vial": { 
    icon: <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  
  // Categorías adicionales - Iconos industriales específicos
  "Baldes de Incendio": { 
    icon: <FontAwesomeIcon icon={faFireExtinguisher} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Botas Industriales": { 
    icon: <FontAwesomeIcon icon={faIndustry} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Botiquines Primeros Auxilios": { 
    icon: <FontAwesomeIcon icon={faFirstAid} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Camillas - Inmovilizador - Férulas": { 
    icon: <FontAwesomeIcon icon={faStethoscope} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Carpa Para piso": { 
    icon: <FontAwesomeIcon icon={faTent} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Carteleria": { 
    icon: <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Cascos": { 
    icon: <FontAwesomeIcon icon={faHardHat} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Equipos": { 
    icon: <FontAwesomeIcon icon={faWrench} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Protección Visual": { 
    icon: <FontAwesomeIcon icon={faGlasses} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Higiene": { 
    icon: <FontAwesomeIcon icon={faRunning} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Temperatura": { 
    icon: <FontAwesomeIcon icon={faThermometer} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Radiación": { 
    icon: <FontAwesomeIcon icon={faRadiation} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  },
  "Toxicidad": { 
    icon: <FontAwesomeIcon icon={faSkull} size="lg" />, 
    color: "var(--interactive-primary)", 
    bgColor: "rgba(var(--interactive-primary-rgb), 0.15)" 
  }
};

const DEFAULT_ICON = { 
  icon: <FontAwesomeIcon icon={faShield} size="lg" />, 
  color: "var(--interactive-primary)", 
  bgColor: "rgba(var(--interactive-primary-rgb), 0.1)" 
};

// Category Card Component
const CategoryCard = ({ categoria }) => {
  const iconConfig = CATEGORY_ICONS[categoria.nombre] || DEFAULT_ICON;
  
  return (
    <Link
      to={`/catalogo?categoria_id=${categoria.id}`}
      className="category-card"
    >
      <div className="category-card-inner">
        <div className="category-icon-wrapper">
          <div className="category-icon">
            {iconConfig.icon}
          </div>
        </div>
        
        <div className="category-content">
          <h3 className="category-name">{categoria.nombre}</h3>
        </div>
      </div>
    </Link>
  );
};

// Loading Component
const LoadingState = () => (
  <section className="category-grid-section">
    <div className="category-container">
      <div className="category-header">
        <h2 className="category-title">
          Nuestros
          <span className="title-highlight">Productos</span>
        </h2>
      </div>
      <div className="category-loading">
        <div className="loading-spinner"></div>
        <p>Cargando categorías...</p>
      </div>
    </div>
  </section>
);

// Main Component
const CategoryGrid = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const data = await categoriaService.getCategorias();
        setCategorias(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategorias([]);
        setLoading(false);
      }
    };

    // Detectar si es móvil
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    fetchCategorias();
    checkIsMobile();
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (categorias.length === 0) {
    return (
      <section className="category-grid-section">
        <div className="category-container">
          <div className="category-header">
            <h2 className="category-title">
              Nuestros
              <span className="title-highlight">Productos</span>
            </h2>
          </div>
          <div className="category-loading">
            <p>No hay categorías disponibles en este momento.</p>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar exactamente 8 categorías (2 filas de 4) inicialmente
  const initialCount = 8;
  const displayedCategorias = showAll ? categorias : categorias.slice(0, initialCount);
  const remainingCount = categorias.length - initialCount;
  
  // Determinar si la última fila necesita centrado
  const isLastRowOdd = displayedCategorias.length > 4 && displayedCategorias.length % 4 !== 0;
  const gridClass = isLastRowOdd ? 'category-grid centered-last-row' : 'category-grid';

  return (
    <section className="category-grid-section">
      <div className="category-container">
        <div className="category-header">
          <h2 className="category-title">
            Nuestros
            <span className="title-highlight">Productos</span>
          </h2>
          <p className="category-description">
            Explora nuestra amplia gama de productos de seguridad industrial
          </p>
        </div>

        <div className={gridClass}>
          {displayedCategorias.map((categoria) => (
            <CategoryCard 
              key={categoria.id} 
              categoria={categoria} 
            />
          ))}
        </div>

        {!showAll && remainingCount > 0 && (
          <div className="category-actions">
            <button 
              className="show-more-btn"
              onClick={() => {
                if (isMobile) {
                  // En móvil, ir directamente al catálogo
                  navigate('/catalogo');
                } else {
                  // En desktop, mostrar más categorías
                  setShowAll(true);
                }
              }}
            >
              <span>
                {isMobile 
                  ? 'Ver más productos' 
                  : `Ver ${remainingCount} categorías más`
                }
              </span>
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>
        )}

        {showAll && (
          <div className="category-actions">
            <button 
              className="show-less-btn"
              onClick={() => setShowAll(false)}
            >
              <span>Ver menos categorías</span>
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
