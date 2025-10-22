// src/App.jsx - Updated with Professional Footer
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { QuoteProvider } from './contexts/QuoteContext';
import { CatalogProvider, useCatalog } from './contexts/CatalogContext';
import useScrollToTop from './hooks/useScrollToTop';

// Eager load critical components
import Navbar from './components/Navbar';
import Footer from './shared/components/Footer';
import LoadingSpinner from './shared/components/LoadingSpinner';
import ErrorBoundary from './shared/components/ErrorBoundary';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Catalogo = React.lazy(() => import('./pages/Catalogo'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const QuienesSomos = React.lazy(() => import('./pages/QuienesSomos'));
const Ferias = React.lazy(() => import('./pages/Ferias'));
const Login = React.lazy(() => import('./features/auth/pages/LoginPage'));
const QuoteCart = React.lazy(() => import('./features/quote/components/QuoteCart'));

// Import carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <QuoteProvider>
            <CatalogProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </CatalogProvider>
          </QuoteProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  useScrollToTop();
  
  return (
    <div className="theme-transition-wrapper">
      <Navbar />
      <main className="page-container">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/ferias" element={<Ferias />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cotizacion" element={<QuoteCart />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;