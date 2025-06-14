// src/pages/Home.jsx
import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import CategoryIcons from '../components/CategoryIcons';
import BrandBenefits from '../components/BrandBenefits';
import AboutUs from '../components/AboutUs';
import FindUs from '../components/FindUs';
import './Home.css';

function Home() {
  return (
    <main className="home-container">

      {/* Carrusel principal full width */}
      <HeroCarousel />

      {/* Categorías destacadas */}
      <section className="category-icons-section">
        <h2 className="section-title">Nuestras Categorías</h2>
        <p className="section-subtitle">Explorá nuestras líneas de protección profesional</p>
        <CategoryIcons />
      </section>

      {/* Sección Quiénes Somos */}
      <section className="about-us">
        <AboutUs />
      </section>

      {/* Beneficios de Marca */}
      <section className="brand-benefits">
        <BrandBenefits />
      </section>

      {/* Ubicación en Google Maps */}
      <section className="findus">
        <FindUs />
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <p>© 2025 ERAM Seguridad Industrial. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}

export default Home;
