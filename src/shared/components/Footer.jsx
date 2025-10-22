// src/shared/components/Footer.jsx - Professional Comprehensive Footer
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaShieldAlt,
  FaAward,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaTruck,
  FaHeadset,
  FaLock
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="footer-container">
          
          {/* Company Info Section */}
          <div className="footer-section company-info">
            <div className="footer-logo">
              <h3>ERAM</h3>
              <p className="footer-tagline">Seguridad Industrial de Excelencia</p>
            </div>
            <p className="company-description">
              Desde 2003, ERAM es líder en la distribución de equipos de protección 
              personal y seguridad industrial, comprometidos con la protección de 
              trabajadores en toda Argentina.
            </p>
            
            {/* Certifications removed */}
          </div>

          {/* Contact Info Section */}
          <div className="footer-section contact-info">
            <h4>Información de Contacto</h4>
            <div className="contact-details">
              <div className="contact-item">
                <FaMapMarkerAlt />
                <div>
                  <strong>Oficina Principal</strong>
                  <p>Av. San Martín 7421, CABA<br />Buenos Aires, Argentina</p>
                </div>
              </div>
              
              <div className="contact-item">
                <FaPhone />
                <div>
                  <strong>Teléfonos</strong>
                  <p>4753-7846 / 4754-8879</p>
                </div>
              </div>
              
              <div className="contact-item">
                <FaWhatsapp />
                <div>
                  <strong>WhatsApp Ventas</strong>
                  <p>+54 9 11 3374-9000</p>
                </div>
              </div>
              
              <div className="contact-item">
                <FaEnvelope />
                <div>
                  <strong>Email</strong>
                  <p>ventas@eram.com.ar<br />Mail de contacto</p>
                </div>
              </div>
              
              <div className="contact-item">
                <FaClock />
                <div>
                  <strong>Horario de Atención</strong>
                  <p>Lun - Vie: 9:00 - 17:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section quick-links">
            <h4>Enlaces Rápidos</h4>
            <div className="links-grid">
              <div className="pyramid-row top-row">
                <div className="link-group">
                  <h5>Productos</h5>
                  <ul>
                    <li><Link to="/catalogo">Catálogo Completo</Link></li>
                    <li><Link to="/catalogo?rubro_id=1">Protección Personal</Link></li>
                    <li><Link to="/catalogo?rubro_id=2">Trabajo en Altura</Link></li>
                    <li><Link to="/novedades">Novedades</Link></li>
                  </ul>
                </div>
                
                <div className="link-group">
                  <h5>Servicios</h5>
                  <ul>
                    <li><Link to="/cotizacion">Solicitar Cotización</Link></li>
                    <li><Link to="/login">Área Clientes</Link></li>
                    <li><Link to="/capacitacion">Capacitación</Link></li>
                    <li><Link to="/soporte-tecnico">Soporte Técnico</Link></li>
                  </ul>
                </div>
              </div>
              
              <div className="pyramid-row bottom-row">
                <div className="link-group services-group">
                  <h5>Empresa</h5>
                  <ul>
                    <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
                    <li><Link to="/historia">Nuestra Historia</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Services & Features Section */}
          <div className="footer-section services-features">
            <h4>Nuestros Servicios</h4>
            <div className="feature-list">
              <div className="feature-item">
                <FaTruck />
                <div>
                  <strong>Envío a Todo el País</strong>
                  <p>Logística nacional especializada</p>
                </div>
              </div>
              
              <div className="feature-item">
                <FaHeadset />
                <div>
                  <strong>Asesoramiento Técnico</strong>
                  <p>Expertos en seguridad industrial</p>
                </div>
              </div>
              
              <div className="feature-item">
                <FaLock />
                <div>
                  <strong>Compra Segura</strong>
                  <p>Protección SSL</p>
                </div>
              </div>
              
              <div className="feature-item">
                <FaAward />
                <div>
                  <strong>Garantía de Calidad</strong>
                  <p>Productos verificados</p>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="social-media">
              <h5>Síguenos</h5>
              <div className="social-links">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
                <a href="https://wa.me/5491133749000" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} ERAM Seguridad Industrial. Todos los derechos reservados.</p>
              <p className="established">Empresa Argentina desde 2003</p>
            </div>
            
            <div className="footer-links">
              <Link to="/privacidad">Política de Privacidad</Link>
              <Link to="/terminos">Términos y Condiciones</Link>
              <Link to="/cookies">Política de Cookies</Link>
              <Link to="/contacto">Contacto</Link>
            </div>
            
            <div className="footer-tech">
              <p>Plataforma desarrollada con tecnología React</p>
              <p className="demo-note">* Versión Demo - Funcionalidad de simulación</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;