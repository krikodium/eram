// src/pages/Home.jsx - Restructured Professional Home Page
import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import CredibilitySection from '../components/CredibilitySection';
import BrandBenefits from '../components/BrandBenefits';
import CategoryGrid from '../components/CategoryGrid';
import AboutUsUnified from '../components/AboutUsUnified';
import IramCertificates from '../components/IramCertificates';
import ContactUnified from '../components/ContactUnified';
import './Home.css';

function Home() {
  return (
    <main className="home-container">
      {/* Enlace temporal solo para desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          background: '#1e293b',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          border: '1px solid #334155'
        }}>
          <a 
            href="/dasheram" 
            style={{ color: '#60a5fa', textDecoration: 'none' }}
          >
            🔧 Admin Panel
          </a>
        </div>
      )}

      {/* 1. Hero Carousel - First Impression */}
      <HeroCarousel />

      {/* 2. Credibility Section - Trust Building */}
      <CredibilitySection />

      {/* 3. Value Proposition - What We Offer */}
      <section className="brand-benefits">
        <BrandBenefits />
      </section>

      {/* 4. Category Grid - Product Discovery */}
      <CategoryGrid />

      {/* 5. About Us - Company Story */}
      <AboutUsUnified />

      {/* 6. IRAM Certificates - Professional Certifications */}
      <IramCertificates />

      {/* 7. Contact - Call to Action */}
      <ContactUnified />
    </main>
  );
}

export default Home;