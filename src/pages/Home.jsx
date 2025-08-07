// src/pages/Home.jsx - Enhanced Professional Home Page
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
      {/* Hero Carousel - Full Width Professional */}
      <HeroCarousel />

      {/* Enhanced Category Icons Section */}
      <CategoryIcons />

      {/* Enhanced Brand Benefits - Ultra Professional */}
      <section className="brand-benefits">
        <BrandBenefits />
      </section>

      {/* About Us Section */}
      <section className="about-us">
        <AboutUs />
      </section>

      {/* Location Section */}
      <section className="findus">
        <FindUs />
      </section>
    </main>
  );
}

export default Home;

export default Home;