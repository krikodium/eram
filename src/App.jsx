// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import ProductDetail from './pages/ProductDetail';
import Navbar from './components/Navbar';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import QuienesSomos from './pages/QuienesSomos';
import Ferias from './pages/Ferias';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* 👇🏼 ESTE ES EL CONTENEDOR QUE FALTABA 👇🏼 */}
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/ferias" element={<Ferias />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;