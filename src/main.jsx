import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Inicializar AOS al renderizar
AOS.init({
  duration: 800,
  once: true,
  offset: 150,
});

createRoot(document.getElementById('root')).render(
  <App />
);
