import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { productoService } from '../services/supabase';
import { useQuote } from '../contexts/QuoteContext';
import SimilarProducts from '../components/SimilarProducts';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, FreeMode, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useQuote();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [currentMainImage, setCurrentMainImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Función de carga del producto
  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await productoService.getProducto(parseInt(id));
      setProducto(data);
    } catch (err) {
      console.error("Error al obtener el producto:", err);
      setError('No se pudo cargar el producto o no fue encontrado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Efecto para inicializar la imagen principal
  useEffect(() => {
    if (producto) {
      setCurrentMainImage(producto.imagen_url || "/default-product.jpg");
      setCurrentImageIndex(0);
    }
  }, [producto]);

  // Obtener todas las imágenes disponibles
  const getAvailableImages = () => {
    if (!producto) return [];
    
    const images = [];
    if (producto.imagen_url) images.push(producto.imagen_url);
    if (producto.imagen_url_2) images.push(producto.imagen_url_2);
    if (producto.imagen_url_3) images.push(producto.imagen_url_3);
    
    return images.length > 0 ? images : ["/default-product.jpg"];
  };

  // Navegación de imágenes
  const goToNextImage = () => {
    const images = getAvailableImages();
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setCurrentMainImage(images[nextIndex]);
  };

  const goToPrevImage = () => {
    const images = getAvailableImages();
    const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setCurrentMainImage(images[prevIndex]);
  };

  const goToImage = (index) => {
    const images = getAvailableImages();
    if (index >= 0 && index < images.length) {
      setCurrentImageIndex(index);
      setCurrentMainImage(images[index]);
    }
  };

  // Limpiar sessionStorage de productos antiguos al montar el componente
  useEffect(() => {
    const cleanupOldKeys = () => {
      try {
        const keys = Object.keys(sessionStorage);
        const productKeys = keys.filter(key => key.startsWith('productDetailRefreshed_'));
        
        // Mantener solo las últimas 10 claves para evitar acumulación
        if (productKeys.length > 10) {
          productKeys.slice(0, -10).forEach(key => {
            sessionStorage.removeItem(key);
          });
        }
      } catch (error) {
        console.warn('Error al limpiar sessionStorage:', error);
      }
    };
    
    cleanupOldKeys();
  }, []);

  // Precio formateado
  const getFormattedPrice = () => {
    if (!producto?.precio) return null;
    return parseFloat(producto.precio).toFixed(2);
  };

  // Especificaciones técnicas
  const getTechnicalSpecs = () => {
    if (!producto) return [];
    
    const specs = [
      { label: 'Código', value: producto.codigo },
      { label: 'Categoría', value: producto.categoria_nombre || 'No especificada' },
      { label: 'Peso', value: producto.peso ? `${producto.peso} kg` : 'No especificado', icon: 'weight' },
    ];

    if (producto.medidas) {
      specs.push({ label: 'Medidas', value: producto.medidas });
    }
    if (producto.presentacion) {
      specs.push({ label: 'Presentación', value: producto.presentacion });
    }
    if (producto.material) {
      specs.push({ label: 'Material', value: producto.material });
    }
    if (producto.color) {
      specs.push({ label: 'Color', value: producto.color });
    }

    return specs;
  };

  // Handlers
  const handleImageLoad = () => setImageLoading(false);
  const handleImageError = () => setImageLoading(false);

  const handleThumbnailClick = (imageUrl) => {
    const images = getAvailableImages();
    const index = images.findIndex(img => img === imageUrl);
    if (index !== -1) {
      setCurrentImageIndex(index);
      setCurrentMainImage(imageUrl);
    }
  };

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setCantidad(value);
    }
  };

  const handleCantidadIncrement = () => setCantidad(prev => prev + 1);
  const handleCantidadDecrement = () => setCantidad(prev => Math.max(1, prev - 1));

  const handleCotizar = () => {
    if (producto) {
      // Crear un objeto producto con la cantidad especificada
      const productToAdd = {
        ...producto,
        quantity: cantidad
      };
      
      addItem(productToAdd);
      
      // Activar animación de éxito
      setShowSuccessAnimation(true);
      
      // Resetear animación después de un tiempo
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);
      
      // Mostrar mensaje de éxito (opcional)
      console.log(`Producto "${producto.nombre}" agregado a la cotización con cantidad ${cantidad}`);
      
      // Opcional: navegar a la cotización
      // navigate('/cotizacion');
    }
  };

  // Función inteligente para volver al catálogo
  const handleBackToCatalog = () => {
    navigate('/catalogo');
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="product-detail-error">
        <div className="error-container">
          <h2>Producto no encontrado</h2>
          <p>{error || 'El producto solicitado no existe.'}</p>
          <Link to="/catalogo" className="back-to-catalog-btn">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-nav">
        <button onClick={handleBackToCatalog} className="back-button">
          <FaArrowLeft />
          <span>Volver</span>
        </button>
        <div className="breadcrumb-path">
          <Link to="/" className="breadcrumb-link">Inicio</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/catalogo" className="breadcrumb-link">Catálogo</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">
            {producto.nombre.length > 30 
              ? `${producto.nombre.substring(0, 30)}...` 
              : producto.nombre
            }
          </span>
        </div>
      </nav>

      <div className="product-detail-container">
        {/* Main Product Section - Redesigned Layout */}
        <div className="product-main-section">
          {/* Left Column - Images Only */}
          <div className="product-left-column">
            {/* Product Image Gallery */}
            <div className="product-image-section">
              <div className="image-gallery-container">
                {/* Desktop Navigation Arrows */}
                <div className="desktop-nav-arrows">
                  <button 
                    className="nav-arrow nav-arrow-prev"
                    onClick={goToPrevImage}
                    aria-label="Imagen anterior"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    className="nav-arrow nav-arrow-next"
                    onClick={goToNextImage}
                    aria-label="Siguiente imagen"
                  >
                    <FaChevronRight />
                  </button>
                </div>

                {/* Mobile Swiper */}
                <div className="mobile-swiper-container">
                  <Swiper
                    modules={[Navigation, Pagination, EffectFade, Thumbs]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={false}
                    pagination={false}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    speed={300}
                    onSlideChange={(swiper) => {
                      setCurrentImageIndex(swiper.activeIndex);
                      const images = getAvailableImages();
                      setCurrentMainImage(images[swiper.activeIndex]);
                    }}
                    className="mobile-image-swiper"
                  >
                    {getAvailableImages().map((image, index) => (
                      <SwiperSlide key={index}>
                        <div 
                          className="product-image-container" 
                          onClick={() => setImageModalOpen(true)}
                        >
                          {imageLoading && index === currentImageIndex && (
                            <div className="image-loading-skeleton">
                              <div className="loading-spinner"></div>
                            </div>
                          )}
                          <img 
                            src={image} 
                            alt={`${producto.nombre} - Vista ${index + 1}`}
                            className={`product-main-image ${imageLoading && index === currentImageIndex ? 'loading' : 'loaded'}`}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            loading="lazy"
                          />
                          <div className="image-zoom-overlay">
                            <span className="zoom-icon">🔍</span>
                            <span className="zoom-text">Toca para ampliar</span>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Desktop Static Image */}
                <div className="desktop-image-container">
                  <div 
                    className="product-image-container" 
                    onClick={() => setImageModalOpen(true)}
                  >
                    {currentMainImage ? (
                      <>
                        {imageLoading && (
                          <div className="image-loading-skeleton">
                            <div className="loading-spinner"></div>
                          </div>
                        )}
                        <img 
                          src={currentMainImage} 
                          alt={producto.nombre} 
                          className={`product-main-image ${imageLoading ? 'loading' : 'loaded'}`}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                          loading="lazy"
                        />
                        <div className="image-zoom-overlay">
                          <span className="zoom-icon">🔍</span>
                          <span className="zoom-text">Hacer clic para ampliar</span>
                        </div>
                      </>
                    ) : (
                      <div className="no-image-placeholder">
                        <span>Imagen Próximamente</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery Thumbnails - Responsive */}
            <div className="image-gallery-thumbnails">
              <div className="gallery-thumbnails">
                {getAvailableImages().map((image, index) => (
                  <div 
                    key={index}
                    className={`thumbnail-item ${currentImageIndex === index ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${producto.nombre} - Vista ${index + 1}`}
                      className="thumbnail-img"
                    />
                  </div>
                ))}
                
                {/* Placeholder for missing images */}
                {getAvailableImages().length < 3 && (
                  <div className="thumbnail-item placeholder">
                    <img 
                      src="/banner-altura.jpg" 
                      alt="Más imágenes en camino"
                      className="thumbnail-img placeholder-img"
                    />
                    <div className="placeholder-overlay">
                      <span className="placeholder-text">MÁS IMÁGENES EN CAMINO</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Product Information - Reorganized */}
          <div className="product-right-column">
            {/* Product Header - Compact */}
            <div className="product-header">
              <h1 className="product-title">{producto.nombre}</h1>
              <div className="product-meta">
                <span className="product-code">Código: {producto.codigo}</span>
                {producto.categoria_nombre && (
                  <span className="product-category">{producto.categoria_nombre}</span>
                )}
              </div>
            </div>

            {/* Price Section - Moved up */}
            {getFormattedPrice() && (
              <div className="product-pricing">
                <div className="price-section">
                  <span className="price-label">Precio Unitario</span>
                  <div className="price-value">
                    <span className="currency">$</span>
                    <span className="amount">{getFormattedPrice()}</span>
                    {producto.moneda && <span className="currency-code">({producto.moneda})</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Product Description - Compact */}
            {producto.descripcion && (
              <div className="product-description">
                <h3>Descripción</h3>
                <p>{producto.descripcion}</p>
              </div>
            )}

            {/* Actions Section - Moved up */}
            <div className="product-actions">
              <div className="quantity-section">
                <label htmlFor="cantidad" className="quantity-label">Cantidad</label>
                <div className="quantity-controls">
                  <button 
                    type="button" 
                    className="quantity-btn quantity-decrease"
                    onClick={handleCantidadDecrement}
                    disabled={cantidad <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="cantidad"
                    value={cantidad}
                    onChange={handleCantidadChange}
                    min="1"
                    className="quantity-input"
                  />
                  <button 
                    type="button" 
                    className="quantity-btn quantity-increase"
                    onClick={handleCantidadIncrement}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                className={`add-to-quote-btn ${showSuccessAnimation ? 'success' : ''}`}
                onClick={handleCotizar}
              >
                <span className="btn-icon">{showSuccessAnimation ? '👍' : '📋'}</span>
                <span className="btn-text">{showSuccessAnimation ? '' : 'Agregar a Cotización'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="technical-specs-section">
          <div className="specs-header">
            <h2>Especificaciones Técnicas</h2>
            <p>Detalles técnicos del producto</p>
          </div>
          
          <div className="specs-grid">
            {getTechnicalSpecs().map((spec, index) => (
              <div key={index} className="spec-item">
                <div className="spec-label">
                  {spec.icon === 'weight' && <span className="weight-icon">⚖️</span>}
                  {spec.label}
                </div>
                <div className="spec-value">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products Section - Moved after technical specs */}
        {producto && (
          <SimilarProducts currentProduct={producto} />
        )}

      </div>

      {/* Image Modal with Swiper */}
      {imageModalOpen && (
        <div className="image-modal-overlay" onClick={() => setImageModalOpen(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setImageModalOpen(false)}
            >
              ×
            </button>
            
            <Swiper
              modules={[Navigation, Pagination, EffectFade, Thumbs]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={300}
              initialSlide={currentImageIndex}
              onSlideChange={(swiper) => {
                setCurrentImageIndex(swiper.activeIndex);
                const images = getAvailableImages();
                setCurrentMainImage(images[swiper.activeIndex]);
              }}
              className="modal-swiper"
            >
              {getAvailableImages().map((image, index) => (
                <SwiperSlide key={index}>
                  <img 
                    src={image} 
                    alt={`${producto.nombre} - Vista ${index + 1}`}
                    className="modal-image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="modal-image-info">
              <h3>{producto.nombre}</h3>
              <p>Código: {producto.codigo}</p>
              <p className="image-counter">
                {currentImageIndex + 1} de {getAvailableImages().length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;