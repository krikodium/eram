// src/components/HeroCarousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './HeroCarousel.css';

function HeroCarousel() {
  const banners = [
    {
      title: "GUANTES DE PROTECCIÓN",
      subtitle: "Ampliamos nuestra línea de",
      img: "/proteccion-respiratoria.jpg",
      cta: "VER MÁS +",
      link: "/catalogo?categoria_id=1"
    },
    {
      title: "CAPACITACIÓN EN ALTURA",
      subtitle: "Formación por bomberos especialistas",
      img: "/banner-altura.jpg",
      cta: "VER MÁS +",
      link: "/formacion"
    },
    {
      title: "INDUSTRIA NACIONAL",
      subtitle: "Desde 1974 apostando a la",
      img: "/banner-industria.jpg",
      cta: "NACIONALES",
      link: "/catalogo"
    }
  ];

  return (
    <section className="hero-carousel-section">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        className="hero-swiper"
      >
        {banners.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="hero-slide"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="hero-overlay">
                <p className="hero-sub">{item.subtitle}</p>
                <h1 className="hero-title">{item.title}</h1>
                <a className="hero-btn" href={item.link}>{item.cta}</a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroCarousel;
