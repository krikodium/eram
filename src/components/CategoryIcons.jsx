// src/components/CategoryIcons.jsx - Clean Professional Category Carousel
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CategoryIcons.css';
import { Link } from 'react-router-dom';
import { mockCategorias } from '../mocks/productos';
import {
  FaShieldAlt,
  FaHardHat,
  FaBriefcaseMedical,
  FaTools,
  FaExclamationTriangle,
  FaEye,
  FaHeartbeat,
  FaFire,
  FaIndustry,
  FaCertificate,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

// Enhanced Icon Configuration - More organized structure
const CATEGORY_ICONS = {
  "Baldes de Incendio": { 
    icon: <FaFire />, 
    color: "#FF6B35", 
    bgColor: "rgba(255, 107, 53, 0.1)" 
  },
  "Botas Industriales": { 
    icon: <FaIndustry />, 
    color: "#2E7D32", 
    bgColor: "rgba(46, 125, 50, 0.1)" 
  },
  "Botiquines Primeros Auxilios": { 
    icon: <FaBriefcaseMedical />, 
    color: "#D32F2F", 
    bgColor: "rgba(211, 47, 47, 0.1)" 
  },
  "Camillas - Inmovilizador - Férulas": { 
    icon: <FaHeartbeat />, 
    color: "#1976D2", 
    bgColor: "rgba(25, 118, 210, 0.1)" 
  },
  "Carpa Para piso": { 
    icon: <FaShieldAlt />, 
    color: "#7B1FA2", 
    bgColor: "rgba(123, 31, 162, 0.1)" 
  },
  "Carteleria": { 
    icon: <FaExclamationTriangle />, 
    color: "#FF9800", 
    bgColor: "rgba(255, 152, 0, 0.1)" 
  },
  "Cascos": { 
    icon: <FaHardHat />, 
    color: "#F57C00", 
    bgColor: "rgba(245, 124, 0, 0.1)" 
  },
  "Equipos": { 
    icon: <FaTools />, 
    color: "#00796B", 
    bgColor: "rgba(0, 121, 107, 0.1)" 
  },
  "Protección Visual": { 
    icon: <FaEye />, 
    color: "#3F51B5", 
    bgColor: "rgba(63, 81, 181, 0.1)" 
  },
  "Certificaciones": { 
    icon: <FaCertificate />, 
    color: "#E91E63", 
    bgColor: "rgba(233, 30, 99, 0.1)" 
  }
};

const DEFAULT_ICON = { 
  icon: <FaShieldAlt />, 
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
    {direction === 'prev' ? <FaChevronLeft /> : <FaChevronRight />}
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
            <div className="category-count">
              <span>{categoria.cantidad_productos || 0}</span>
              <span>productos</span>
            </div>
          </div>
          
          <div className="category-hover-overlay">
            <div className="category-cta">
              <span>Ver Productos</span>
              <FaChevronRight />
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
          Nuestras
          <span className="title-highlight">Categorías</span>
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
        // Use mock data instead of API call
        setTimeout(() => {
          setCategorias(mockCategorias);
          setLoading(false);
        }, 500); // Simulate loading delay
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
              Nuestras
              <span className="title-highlight">Categorías</span>
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
            Nuestras
            <span className="title-highlight">Categorías</span>
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