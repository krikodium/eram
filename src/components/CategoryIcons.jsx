// src/components/CategoryIcons.jsx - Clean Professional Category Carousel
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CategoryIcons.css';
import { Link } from 'react-router-dom';
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
  faChevronLeft,
  faChevronRight,
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
  faCircle
} from '@fortawesome/free-solid-svg-icons';

// Enhanced Icon Configuration - Specific and Representative Icons using FontAwesome
const CATEGORY_ICONS = {
  // Categorías principales del catálogo ERAM
  "Cintas Industriales": { 
    icon: <FontAwesomeIcon icon={faTape} size="lg" />, 
    color: "#FF6B35", 
    bgColor: "rgba(255, 107, 53, 0.15)" 
  },
  "Delantales": { 
    icon: <FontAwesomeIcon icon={faTshirt} size="lg" />, 
    color: "#795548", 
    bgColor: "rgba(121, 85, 72, 0.15)" 
  },
  "Escaleras": { 
    icon: <FontAwesomeIcon icon={faArrowUp} size="lg" />, 
    color: "#607D8B", 
    bgColor: "rgba(96, 125, 139, 0.15)" 
  },
  "Incendio": { 
    icon: <FontAwesomeIcon icon={faFire} size="lg" />, 
    color: "#FF5722", 
    bgColor: "rgba(255, 87, 34, 0.15)" 
  },
  "Indumentaria De Lluvia": { 
    icon: <FontAwesomeIcon icon={faUmbrella} size="lg" />, 
    color: "#D32F2F", 
    bgColor: "rgba(211, 47, 47, 0.15)" 
  },
  "Kits Vehiculares": { 
    icon: <FontAwesomeIcon icon={faCar} size="lg" />, 
    color: "#D32F2F", 
    bgColor: "rgba(211, 47, 47, 0.15)" 
  },
  "Kraftex": { 
    icon: <FontAwesomeIcon icon={faBox} size="lg" />, 
    color: "#FF9800", 
    bgColor: "rgba(255, 152, 0, 0.15)" 
  },
  "Primeros Auxilios": { 
    icon: <FontAwesomeIcon icon={faFirstAid} size="lg" />, 
    color: "#F44336", 
    bgColor: "rgba(244, 67, 54, 0.15)" 
  },
  "Proteccion Auditiva": { 
    icon: <FontAwesomeIcon icon={faHeadphones} size="lg" />, 
    color: "#D32F2F", 
    bgColor: "rgba(211, 47, 47, 0.15)" 
  },
  "Proteccion En Altura": { 
    icon: <FontAwesomeIcon icon={faMountain} size="lg" />, 
    color: "#795548", 
    bgColor: "rgba(121, 85, 72, 0.15)" 
  },
  "Proteccion Facial": { 
    icon: <FontAwesomeIcon icon={faUser} size="lg" />, 
    color: "#D32F2F", 
    bgColor: "rgba(211, 47, 47, 0.15)" 
  },
  "Proteccion Ocular": { 
    icon: <FontAwesomeIcon icon={faGlasses} size="lg" />, 
    color: "#D32F2F", 
    bgColor: "rgba(211, 47, 47, 0.15)" 
  },
  "Proteccion Respiratoria": { 
    icon: <FontAwesomeIcon icon={faUser} size="lg" />, 
    color: "#D32F2F", 
    bgColor: "rgba(211, 47, 47, 0.15)" 
  },
  "Señalizacion Industrial": { 
    icon: <FontAwesomeIcon icon={faExclamationCircle} size="lg" />, 
    color: "#D32F2F", 
    bgColor: "rgba(211, 47, 47, 0.15)" 
  },
  "Señalización Vial": { 
    icon: <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />, 
    color: "#FFC107", 
    bgColor: "rgba(255, 193, 7, 0.15)" 
  },
  
  // Categorías adicionales (mantener compatibilidad)
  "Baldes de Incendio": { 
    icon: <FontAwesomeIcon icon={faFire} size="lg" />, 
    color: "#FF4444", 
    bgColor: "rgba(255, 68, 68, 0.15)" 
  },
  "Botas Industriales": { 
    icon: <FontAwesomeIcon icon={faIndustry} size="lg" />, 
    color: "#2E7D32", 
    bgColor: "rgba(46, 125, 50, 0.15)" 
  },
  "Botiquines Primeros Auxilios": { 
    icon: <FontAwesomeIcon icon={faFirstAid} size="lg" />, 
    color: "#D32F2F", 
    bgColor: "rgba(211, 47, 47, 0.15)" 
  },
  "Camillas - Inmovilizador - Férulas": { 
    icon: <FontAwesomeIcon icon={faHeart} size="lg" />, 
    color: "#1976D2", 
    bgColor: "rgba(25, 118, 210, 0.15)" 
  },
  "Carpa Para piso": { 
    icon: <FontAwesomeIcon icon={faTent} size="lg" />, 
    color: "#7B1FA2", 
    bgColor: "rgba(123, 31, 162, 0.15)" 
  },
  "Carteleria": { 
    icon: <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />, 
    color: "#FF9800", 
    bgColor: "rgba(255, 152, 0, 0.15)" 
  },
  "Cascos": { 
    icon: <FontAwesomeIcon icon={faHardHat} size="lg" />, 
    color: "#F57C00", 
    bgColor: "rgba(245, 124, 0, 0.15)" 
  },
  "Equipos": { 
    icon: <FontAwesomeIcon icon={faWrench} size="lg" />, 
    color: "#00796B", 
    bgColor: "rgba(0, 121, 107, 0.15)" 
  },
  "Protección Visual": { 
    icon: <FontAwesomeIcon icon={faGlasses} size="lg" />, 
    color: "#3F51B5", 
    bgColor: "rgba(63, 81, 181, 0.15)" 
  },
  "Higiene": { 
    icon: <FontAwesomeIcon icon={faRunning} size="lg" />, 
    color: "#8BC34A", 
    bgColor: "rgba(139, 195, 74, 0.15)" 
  },
  "Temperatura": { 
    icon: <FontAwesomeIcon icon={faThermometer} size="lg" />, 
    color: "#FF5722", 
    bgColor: "rgba(255, 87, 34, 0.15)" 
  },
  "Radiación": { 
    icon: <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />, 
    color: "#FFEB3B", 
    bgColor: "rgba(255, 235, 59, 0.15)" 
  },
  "Toxicidad": { 
    icon: <FontAwesomeIcon icon={faSkull} size="lg" />, 
    color: "#9E9E9E", 
    bgColor: "rgba(158, 158, 158, 0.15)" 
  }
};

const DEFAULT_ICON = { 
  icon: <FontAwesomeIcon icon={faShield} size="lg" />, 
  color: "#D32F2F", 
  bgColor: "rgba(211, 47, 47, 0.1)" 
};

// Custom Arrow Components - Simplified
const CustomArrow = ({ direction, onClick }) => (
  <div 
    className={`category-arrow category-arrow-${direction}`} 
    onClick={onClick}
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} categories`}
  >
    {direction === 'prev' ? <FontAwesomeIcon icon={faChevronLeft} size="sm" /> : <FontAwesomeIcon icon={faChevronRight} size="sm" />}
  </div>
);

// Slider Configuration - Cleaner structure
const getSliderSettings = () => ({
  dots: false,
  infinite: true,
  speed: 600,
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  nextArrow: <CustomArrow direction="next" />,
  prevArrow: <CustomArrow direction="prev" />,
  responsive: [
    {
      breakpoint: 1400,
      settings: { slidesToShow: 5 }
    },
    {
      breakpoint: 1200,
      settings: { slidesToShow: 4 }
    },
    {
      breakpoint: 968,
      settings: { slidesToShow: 3 }
    },
    {
      breakpoint: 768,
      settings: { 
        slidesToShow: 2,
        arrows: false 
      }
    },
    {
      breakpoint: 480,
      settings: { 
        slidesToShow: 1,
        arrows: false,
        centerMode: true,
        centerPadding: '20%'
      }
    }
  ]
});

// Category Card Component - More modular
const CategoryCard = ({ categoria }) => {
  const iconConfig = CATEGORY_ICONS[categoria.nombre] || DEFAULT_ICON;
  
  return (
    <div className="category-slide">
      <Link
        to={`/catalogo?categoria_id=${categoria.id}`}
        className="category-card"
        style={{
          '--category-color': iconConfig.color,
          '--category-bg': iconConfig.bgColor
        }}
      >
        <div className="category-card-inner">
          <div className="category-icon-wrapper">
            <div className="category-icon">
              {iconConfig.icon}
            </div>
            <div className="category-icon-glow"></div>
          </div>
          
          <div className="category-content">
            <h3 className="category-name">{categoria.nombre}</h3>
          </div>
          
          <div className="category-hover-overlay">
            <div className="category-cta">
              <span>Ver Productos</span>
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Loading Component
const LoadingState = () => (
  <section className="category-icons-section">
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

// Main Component - Cleaner structure
const CategoryIcons = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const data = await categoriaService.getCategorias();
        setCategorias(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategorias([]); // Set empty array on error
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (categorias.length === 0) {
    return (
      <section className="category-icons-section">
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

  return (
    <section className="category-icons-section">
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

        <div className="category-slider-wrapper">
          <Slider {...getSliderSettings()} className="category-slider">
            {categorias.map((categoria) => (
              <CategoryCard 
                key={categoria.id} 
                categoria={categoria} 
              />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default CategoryIcons;