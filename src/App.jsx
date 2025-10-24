// src/App.jsx - Updated with Professional Footer
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { QuoteProvider } from './contexts/QuoteContext';
import { CatalogProvider, useCatalog } from './contexts/CatalogContext';
import useScrollToTop from './hooks/useScrollToTop';
import AdminLayout from './features/admin/components/AdminLayout';

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

// Admin pages
const AdminDashboard = React.lazy(() => import('./features/admin/pages/Dashboard'));
const AdminProductos = React.lazy(() => import('./features/admin/pages/Productos'));
const AdminCategorias = React.lazy(() => import('./features/admin/pages/Categorias'));
const AdminExportar = React.lazy(() => import('./features/admin/pages/Exportar'));
const AdminUsuarios = React.lazy(() => import('./features/admin/pages/Usuarios'));
const AdminConfiguracion = React.lazy(() => import('./features/admin/pages/Configuracion'));
const AdminLogs = React.lazy(() => import('./features/admin/pages/Logs'));
const AdminBackups = React.lazy(() => import('./features/admin/pages/Backups'));
const AdminMetricas = React.lazy(() => import('./features/admin/pages/Metricas'));


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
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={
            <>
              <Navbar />
              <main className="page-container">
                <Home />
              </main>
              <Footer />
            </>
          } />
          <Route path="/catalogo" element={
            <>
              <Navbar />
              <main className="page-container">
                <Catalogo />
              </main>
              <Footer />
            </>
          } />
          <Route path="/producto/:id" element={
            <>
              <Navbar />
              <main className="page-container">
                <ProductDetail />
              </main>
              <Footer />
            </>
          } />
          <Route path="/quienes-somos" element={
            <>
              <Navbar />
              <main className="page-container">
                <QuienesSomos />
              </main>
              <Footer />
            </>
          } />
          <Route path="/ferias" element={
            <>
              <Navbar />
              <main className="page-container">
                <Ferias />
              </main>
              <Footer />
            </>
          } />
          <Route path="/login" element={
            <>
              <Navbar />
              <main className="page-container">
                <Login />
              </main>
              <Footer />
            </>
          } />
          <Route path="/cotizacion" element={
            <>
              <Navbar />
              <main className="page-container">
                <QuoteCart />
              </main>
              <Footer />
            </>
          } />
          
          {/* Rutas del panel administrativo - SIN Navbar ni Footer */}
          <Route path="/dasheram" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          <Route path="/dasheram/productos" element={
            <AdminLayout>
              <AdminProductos />
            </AdminLayout>
          } />
          <Route path="/dasheram/categorias" element={
            <AdminLayout>
              <AdminCategorias />
            </AdminLayout>
          } />
          <Route path="/dasheram/exportar" element={
            <AdminLayout>
              <AdminExportar />
            </AdminLayout>
          } />
          <Route path="/dasheram/logs" element={
            <AdminLayout>
              <AdminLogs />
            </AdminLayout>
          } />
          <Route path="/dasheram/backups" element={
            <AdminLayout>
              <AdminBackups />
            </AdminLayout>
          } />
          <Route path="/dasheram/metricas" element={
            <AdminLayout>
              <AdminMetricas />
            </AdminLayout>
          } />
          <Route path="/dasheram/usuarios" element={
            <AdminLayout>
              <AdminUsuarios />
            </AdminLayout>
          } />
          <Route path="/dasheram/configuracion" element={
            <AdminLayout>
              <AdminConfiguracion />
            </AdminLayout>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;