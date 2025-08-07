// src/components/HeroCarousel.jsx - Ultra Professional Hero Carousel
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaIndustry, 
  FaHardHat, 
  FaCertificate,
  FaChevronLeft,
  FaChevronRight,
  FaPlay
} from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import './HeroCarousel.css';

function HeroCarousel() {
  const heroSlides = [
    {
      id: 'industria-nacional',
      title: "LÍDERES EN SEGURIDAD INDUSTRIAL",
      subtitle: "Desde 1974 Protegiendo la",
      highlight: "INDUSTRIA NACIONAL",
      description: "Más de 50 años de experiencia garantizando la seguridad de trabajadores argentinos con productos de máxima calidad y tecnología de vanguardia.",
      image: "/banner-industria.jpg",
      primaryCTA: "Explorar Catálogo",
      secondaryCTA: "Nuestra Historia",
      primaryLink: "/catalogo",
      secondaryLink: "/quienes-somos",
      icon: <FaIndustry />,
      stats: [
        { number: "50+", label: "Años de Experiencia" },
        { number: "10K+", label: "Clientes Activos" },
        { number: "100%", label: "Productos Certificados" }
      ]
    },
    {
      id: 'proteccion-integral',
      title: "PROTECCIÓN INTEGRAL",
      subtitle: "Equipamiento Profesional para",
      highlight: "MÁXIMA SEGURIDAD",
      description: "Ofrecemos la línea más completa de equipos de protección personal certificados por organismos internacionales para todas las industrias.",
      image: "/proteccion-respiratoria.jpg",
      primaryCTA: "Ver Productos",
      secondaryCTA: "Asesoramiento",
      primaryLink: "/catalogo?rubro_id=1",
      secondaryLink: "/contacto",
      icon: <FaShieldAlt />,
      stats: [
        { number: "500+", label: "Productos Disponibles" },
        { number: "24h", label: "Envíos Rápidos" },
        { number: "ISO", label: "Certificaciones" }
      ]
    },
    {
      id: 'trabajo-altura',
      title: "TRABAJO EN ALTURA",
      subtitle: "Especialistas en Sistemas de",
      highlight: "PROTECCIÓN VERTICAL",
      description: "Equipos y sistemas integrales para trabajo en altura con la última tecnología en arneses, líneas de vida y sistemas de anclaje.",
      image: "/banner-altura.jpg",
      primaryCTA: "Sistemas de Altura",
      secondaryCTA: "Capacitación",
      primaryLink: "/catalogo?rubro_id=2",
      secondaryLink: "/capacitacion",
      icon: <FaHardHat />,
      stats: [
        { number: "15m", label: "Altura Máxima" },
        { number: "CE", label: "Certificación Europea" },
        { number: "24/7", label: "Soporte Técnico" }
      ]
    }
  ];

  return (
    <section className="hero-carousel-section">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ 
          delay: 6000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        loop={true}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        navigation={{
          nextEl: '.hero-button-next',
          prevEl: '.hero-button-prev',
        }}
        className="hero-swiper"
        slidesPerView={1}
        speed={1000}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id} className="hero-slide">
            <div className="hero-slide-container">
              {/* Background Image with Overlay */}
              <div className="hero-background">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="hero-bg-image"
                />
                <div className="hero-overlay"></div>
                <div className="hero-pattern"></div>
              </div>

              {/* Content Container */}
              <div className="hero-content">
                <div className="hero-content-wrapper">
                  
                  {/* Hero Badge */}
                  <div className="hero-badge">
                    <div className="hero-badge-icon">
                      {slide.icon}
                    </div>
                    <span>Desde 1974</span>
                  </div>

                  {/* Main Content */}
                  <div className="hero-text-content">
                    <h2 className="hero-subtitle">{slide.subtitle}</h2>
                    <h1 className="hero-title">
                      {slide.title}
                      <span className="hero-highlight">{slide.highlight}</span>
                    </h1>
                    <p className="hero-description">{slide.description}</p>
                  </div>

                  {/* Call to Action Buttons */}
                  <div className="hero-actions">
                    <Link to={slide.primaryLink} className="hero-btn hero-btn-primary">
                      <FaPlay />
                      {slide.primaryCTA}
                    </Link>
                    <Link to={slide.secondaryLink} className="hero-btn hero-btn-secondary">
                      {slide.secondaryCTA}
                    </Link>
                  </div>

                  {/* Statistics */}
                  <div className="hero-stats">
                    {slide.stats.map((stat, index) => (
                      <div key={index} className="hero-stat-item">
                        <div className="hero-stat-number">{stat.number}</div>
                        <div className="hero-stat-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="hero-button-prev hero-nav-btn">
          <FaChevronLeft />
        </div>
        <div className="hero-button-next hero-nav-btn">
          <FaChevronRight />
        </div>
      </Swiper>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator">
        <div className="scroll-arrow"></div>
        <span>Explorar</span>
      </div>
    </section>
  );
}

export default HeroCarousel;

  return (
    <section className="hero-carousel-section">
      <Swiper
        // ✅ Se configuran los módulos y el nuevo efecto
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        className="hero-swiper"
        slidesPerView={1}
        spaceBetween={0}
      >
        {banners.map((item) => (
          <SwiperSlide key={item.id} className="hero-slide-container">
            <div className="hero-slide">
              <div
                className="hero-background"
                style={{ backgroundImage: `url(${item.img})` }}
              ></div>
              <div className="hero-overlay">
                <div className="hero-content">
                  <div className="hero-text-container">
                    <p className="hero-slogan">{item.subtitle}</p>
                    <h1 className="hero-title">{item.title}</h1>
                  </div>
                </div>

                <div className="hero-cta-container">
                  <a className="hero-btn" href={item.link}>{item.cta}</a>
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