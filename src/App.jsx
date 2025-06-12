// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import ProductDetail from './pages/ProductDetail'; // <-- 1. IMPORTAR la nueva página
import Navbar from './components/Navbar';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        
        {/* --- 2. AÑADIR NUEVA RUTA DINÁMICA --- */}
        {/* La ruta '/producto/:id' es dinámica. El ':' le indica que 'id' es una variable */}
        <Route path="/producto/:id" element={<ProductDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;