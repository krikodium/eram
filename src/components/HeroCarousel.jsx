// src/components/HeroCarousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './HeroCarousel.css';

function HeroCarousel() {
  const banners = [
    {
      id: 'industria',
      title: "INDUSTRIA NACIONAL",
      subtitle: "Desde 1974 apostando a la",
      img: "/banner-industria.jpg",
      cta: "NACIONALES",
      link: "/catalogo"
    },
    {
      id: 'guantes',
      title: "GUANTES DE PROTECCIÓN",
      subtitle: "Ampliamos nuestra línea de",
      img: "/proteccion-respiratoria.jpg",
      cta: "VER MÁS +",
      link: "/catalogo?categoria_id=1"
    },
    {
      id: 'capacitacion',
      title: "CAPACITACIÓN EN ALTURA",
      subtitle: "Formación por bomberos especialistas",
      img: "/banner-altura.jpg",
      cta: "VER MÁS +",
      link: "/formacion"
    }
  ];

  return (
    <section className="hero-carousel-section">
      <Swiper
        modules={[Autoplay, Pagination]}
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

                {/* ✅ Botón unificado para todos los slides */}
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