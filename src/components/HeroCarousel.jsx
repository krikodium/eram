// src/components/HeroCarousel.jsx - Clean Auto-Advancing Hero Carousel
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaIndustry, 
  FaHardHat, 
  FaArrowRight,
  FaAward,
  FaUsers,
  FaFlag,
  FaHeadset
} from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './HeroCarousel.css';

function HeroCarousel() {
  const heroSlides = [
    {
      id: 'liderazgo-industrial',
      badge: "Empresa Nacional desde 2003",
      mainTitle: "LÍDERES EN",
      highlight: "SEGURIDAD INDUSTRIAL",
      subtitle: "ARGENTINA",
      description: "Más de 20 años protegiendo trabajadores argentinos con equipos de máxima calidad y tecnología de vanguardia. Somos la elección de las principales industrias del país.",
      image: "/seguridadvialfoto1.png",
      primaryCTA: "EXPLORAR CATÁLOGO",
      secondaryCTA: "CONOCER MÁS",
      primaryLink: "/catalogo",
      secondaryLink: "/quienes-somos",
      icon: <FaFlag />,
      metrics: [
        { value: "20+", label: "AÑOS DE EXPERIENCIA", icon: <FaFlag /> },
        { value: "10K+", label: "CLIENTES", icon: <FaUsers /> },
        { value: "24", label: "PROVINCIAS", icon: <FaIndustry /> }
      ]
    },
    {
      id: 'proteccion-integral',
      badge: "Equipamiento Profesional",
      mainTitle: "PROTECCIÓN",
      highlight: "INTEGRAL",
      subtitle: "MÁXIMA SEGURIDAD",
      description: "Línea completa de equipos de protección personal. Soluciones integrales para todas las industrias y ambientes de trabajo.",
      image: "/containership.png",
      primaryCTA: "VER PRODUCTOS",
      secondaryCTA: "ASESORAMIENTO",
      primaryLink: "/catalogo",
      secondaryLink: "/contacto",
      icon: <FaShieldAlt />,
      metrics: [
        { value: "500+", label: "PRODUCTOS", icon: <FaIndustry /> },
        { value: "24H", label: "ENVÍOS", icon: <FaShieldAlt /> },
        { value: "24/7", label: "SOPORTE", icon: <FaHeadset /> }
      ]
    },
    {
      id: 'trabajo-altura',
      badge: "Especialistas en Altura",
      mainTitle: "TRABAJO EN",
      highlight: "ALTURA",
      subtitle: "PROTECCIÓN VERTICAL",
      description: "Sistemas integrales para trabajo en altura con tecnología de vanguardia. Arneses, líneas de vida y sistemas de anclaje que cumplen con las normativas más exigentes.",
      image: "/alturatrabajo1.png",
      primaryCTA: "SISTEMAS ALTURA",
      secondaryCTA: "CAPACITACIÓN", 
      primaryLink: "/catalogo",
      secondaryLink: "/capacitacion",
      icon: <FaHardHat />,
      metrics: [
        { value: "ARNESES", label: "PROTECCIÓN", icon: <FaHardHat /> },
        { value: "CASCOS", label: "SEGURIDAD", icon: <FaShieldAlt /> },
        { value: "LÍNEAS", label: "DE VIDA", icon: <FaIndustry /> }
      ]
    }
  ];

  return (
    <section className="hero-carousel-section">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ 
          delay: 8000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: false 
        }}
        loop={true}
        pagination={{ 
          clickable: true,
          dynamicBullets: false,
          bulletClass: 'hero-pagination-bullet',
          bulletActiveClass: 'hero-pagination-bullet-active'
        }}
        className="hero-swiper"
        slidesPerView={1}
        speed={1500}
        allowTouchMove={false}
      >
        {heroSlides.map((slide, slideIndex) => (
          <SwiperSlide key={slide.id} className="hero-slide">
            <div className="hero-slide-container">
              
              {/* Background System */}
              <div className="hero-background">
                <img 
                  src={slide.image} 
                  alt={slide.mainTitle}
                  className="hero-bg-image"
                  loading={slideIndex === 0 ? "eager" : "lazy"}
                />
                <div className="hero-overlay"></div>
                <div className="hero-gradient"></div>
              </div>

              {/* Main Content */}
              <div className="hero-content">
                <div className="hero-container">
                  
                  {/* Left Content */}
                  <div className="hero-left-content">
                    
                    {/* Badge */}
                    <div className="hero-badge">
                      <div className="badge-icon">
                        {slide.icon}
                      </div>
                      <span className="badge-text">{slide.badge}</span>
                    </div>

                    {/* Main Typography */}
                    <div className="hero-typography">
                      <h1 className="hero-main-title">
                        <span className="title-line-1">{slide.mainTitle}</span>
                        <span className="title-highlight">{slide.highlight}</span>
                      </h1>
                      <h2 className="hero-subtitle">{slide.subtitle}</h2>
                    </div>

                    {/* Description */}
                    <p className="hero-description">{slide.description}</p>

                    {/* Call to Actions */}
                    <div className="hero-actions">
                      <Link to={slide.primaryLink} className="hero-btn primary">
                        <span>{slide.primaryCTA}</span>
                        <FaArrowRight className="btn-icon" />
                      </Link>
                      <Link to={slide.secondaryLink} className="hero-btn secondary">
                        <span>{slide.secondaryCTA}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Metrics */}
                  <div className="hero-right-content">
                    <div className="hero-metrics">
                      {slide.metrics.map((metric, index) => (
                        <div key={index} className="metric-card" style={{ '--delay': `${index * 0.2}s` }}>
                          <div className="metric-icon">
                            {metric.icon}
                          </div>
                          <div className="metric-content">
                            <div className="metric-value">{metric.value}</div>
                            <div className="metric-label">{metric.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroCarousel;