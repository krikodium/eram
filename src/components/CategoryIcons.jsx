// src/components/CategoryIcons.jsx - Enhanced Professional Category Carousel
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CategoryIcons.css';
import { Link } from 'react-router-dom';
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
  FaTruck,
  FaHandshake,
  FaCertificate,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const enhancedIconMap = {
  "Baldes de Incendio": { icon: <FaFire />, color: "#FF6B35", bgColor: "rgba(255, 107, 53, 0.1)" },
  "Botas Industriales": { icon: <FaIndustry />, color: "#2E7D32", bgColor: "rgba(46, 125, 50, 0.1)" },
  "Botiquines Primeros Auxilios": { icon: <FaBriefcaseMedical />, color: "#D32F2F", bgColor: "rgba(211, 47, 47, 0.1)" },
  "Camillas - Inmovilizador - Férulas": { icon: <FaHeartbeat />, color: "#1976D2", bgColor: "rgba(25, 118, 210, 0.1)" },
  "Carpa Para piso": { icon: <FaShieldAlt />, color: "#7B1FA2", bgColor: "rgba(123, 31, 162, 0.1)" },
  "Carteleria": { icon: <FaExclamationTriangle />, color: "#FF9800", bgColor: "rgba(255, 152, 0, 0.1)" },
  "Cascos": { icon: <FaHardHat />, color: "#F57C00", bgColor: "rgba(245, 124, 0, 0.1)" },
  "Equipos": { icon: <FaTools />, color: "#00796B", bgColor: "rgba(0, 121, 107, 0.1)" },
  "Protección Visual": { icon: <FaEye />, color: "#3F51B5", bgColor: "rgba(63, 81, 181, 0.1)" },
  "Certificaciones": { icon: <FaCertificate />, color: "#E91E63", bgColor: "rgba(233, 30, 99, 0.1)" }
};

const DefaultIcon = { 
  icon: <FaShieldAlt />, 
  color: "#D32F2F", 
  bgColor: "rgba(211, 47, 47, 0.1)" 
};

function NextArrow({ onClick }) {
  return (
    <div className="category-arrow category-arrow-next" onClick={onClick}>
      <FaChevronRight />
    </div>
  );
}

function PrevArrow({ onClick }) {
  return (
    <div className="category-arrow category-arrow-prev" onClick={onClick}>
      <FaChevronLeft />
    </div>
  );
}

const CategoryIcons = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api}/api/categorias`);
        const data = Array.isArray(response.data) ? response.data : [];
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, [api]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 968,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          centerMode: true,
          centerPadding: '20%',
        }
      }
    ]
  };

  if (loading) {
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
            <div className="loading-spinner"></div>
            <p>Cargando categorías...</p>
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
          <Slider {...sliderSettings} className="category-slider">
            {categorias.map((categoria) => {
              const iconConfig = enhancedIconMap[categoria.nombre] || DefaultIcon;
              
              return (
                <div key={categoria.id} className="category-slide">
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
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default CategoryIcons;

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 6,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { 
        breakpoint: 1400, 
        settings: { 
          slidesToShow: 5,
          slidesToScroll: 2
        } 
      },
      { 
        breakpoint: 1200, 
        settings: { 
          slidesToShow: 4,
          slidesToScroll: 2
        } 
      },
      { 
        breakpoint: 992, 
        settings: { 
          slidesToShow: 3,
          slidesToScroll: 1
        } 
      },
      { 
        breakpoint: 768, 
        settings: { 
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false
        } 
      },
      { 
        breakpoint: 576, 
        settings: { 
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        } 
      }
    ]
  };

  if (loading) {
    return (
      <section className="category-slider-section">
        <div className="section-header">
          <h2 className="section-title">Nuestras Categorías</h2>
          <div className="loading-categories">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="category-skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="category-slider-section">
      <div className="section-header">
        <h2 className="section-title">Nuestras Categorías</h2>
        <p className="section-subtitle">Explorá nuestras líneas de protección industrial profesional</p>
      </div>
      
      <div className="slider-wrapper">
        <Slider {...settings}>
          {categorias.map((cat) => {
            const iconData = enhancedIconMap[cat.nombre] || DefaultIcon;
            return (
              <div key={cat.id} className="category-slide">
                <Link 
                  to={`/catalogo?categoria_id=${cat.id}`} 
                  className="category-card"
                  style={{
                    '--card-color': iconData.color,
                    '--card-bg-color': iconData.bgColor
                  }}
                >
                  <div className="category-icon-wrapper">
                    <div className="icon-background">
                      {iconData.icon}
                    </div>
                    <div className="icon-glow"></div>
                  </div>
                  <span className="category-name">{cat.nombre}</span>
                  <div className="category-hover-effect"></div>
                </Link>
              </div>
            );
          })}
        </Slider>
      </div>
      
      <div className="section-footer">
        <Link to="/catalogo" className="view-all-categories">
          Ver Todas las Categorías
          <FaChevronRight />
        </Link>
      </div>
    </section>
  );
};

export default CategoryIcons;