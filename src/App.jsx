// src/App.jsx - Updated with Professional Footer
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { QuoteProvider } from './contexts/QuoteContext';
import { CatalogProvider, useCatalog } from './contexts/CatalogContext';
import { AdminAuthProvider } from './features/admin/contexts/AdminAuthContext';
import useScrollToTop from './hooks/useScrollToTop';
import AdminLayout from './features/admin/components/AdminLayout';
import AdminRoute from './features/admin/components/AdminRoute';

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
const AdminLogin = React.lazy(() => import('./features/admin/pages/AdminLogin'));
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
              <AdminAuthProvider>
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </AdminAuthProvider>
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
          <Route path="/dasheram/login" element={<AdminLogin />} />
          <Route path="/dasheram" element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/dasheram/productos" element={
            <AdminRoute>
              <AdminLayout>
                <AdminProductos />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/dasheram/categorias" element={
            <AdminRoute>
              <AdminLayout>
                <AdminCategorias />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/dasheram/exportar" element={
            <AdminRoute>
              <AdminLayout>
                <AdminExportar />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/dasheram/logs" element={
            <AdminRoute>
              <AdminLayout>
                <AdminLogs />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/dasheram/backups" element={
            <AdminRoute>
              <AdminLayout>
                <AdminBackups />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/dasheram/metricas" element={
            <AdminRoute>
              <AdminLayout>
                <AdminMetricas />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/dasheram/usuarios" element={
            <AdminRoute>
              <AdminLayout>
                <AdminUsuarios />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/dasheram/configuracion" element={
            <AdminRoute>
              <AdminLayout>
                <AdminConfiguracion />
              </AdminLayout>
            </AdminRoute>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;