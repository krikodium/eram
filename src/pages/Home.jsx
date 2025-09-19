// src/pages/Home.jsx - Restructured Professional Home Page
import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import CredibilitySection from '../components/CredibilitySection';
import BrandBenefits from '../components/BrandBenefits';
import CategoryIcons from '../components/CategoryIcons';
import AboutUsUnified from '../components/AboutUsUnified';
import CertificationsSection from '../components/CertificationsSection';
import ContactUnified from '../components/ContactUnified';
import './Home.css';

function Home() {
  return (
    <main className="home-container">
      {/* 1. Hero Carousel - First Impression */}
      <HeroCarousel />

      {/* 2. Credibility Section - Trust Building */}
      <CredibilitySection />

      {/* 3. Value Proposition - What We Offer */}
      <section className="brand-benefits">
        <BrandBenefits />
      </section>

      {/* 4. Category Carousel - Product Discovery */}
      <CategoryIcons />

      {/* 5. About Us - Company Story */}
      <AboutUsUnified />

      {/* 6. Certifications - Quality Assurance */}
      <CertificationsSection />

      {/* 7. Contact - Call to Action */}
      <ContactUnified />
    </main>
  );
}

export default Home;