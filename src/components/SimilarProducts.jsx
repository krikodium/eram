import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productoService } from '../services/supabase';
import { FaEye } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './SimilarProducts.css';

function SimilarProducts({ currentProduct }) {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Ref para evitar múltiples ejecuciones y controlar el estado
  const fetchStateRef = useRef({
    hasFetched: false,
    currentProductId: null,
    currentCategoryId: null
  });

  useEffect(() => {
    // Solo ejecutar si tenemos un producto válido con categoría
    if (!currentProduct?.categoria_id || !currentProduct?.id) {
      setLoading(false);
      return;
    }

    const { hasFetched, currentProductId, currentCategoryId } = fetchStateRef.current;
    
    // Solo hacer fetch si es un producto diferente o no se ha hecho fetch antes
    const isNewProduct = currentProductId !== currentProduct.id;
    const isNewCategory = currentCategoryId !== currentProduct.categoria_id;
    
    if (!hasFetched || isNewProduct || isNewCategory) {
      // Actualizar el estado de referencia
      fetchStateRef.current = {
        hasFetched: true,
        currentProductId: currentProduct.id,
        currentCategoryId: currentProduct.categoria_id
      };

      const fetchSimilarProducts = async () => {
        try {
          setLoading(true);
          setError('');
          
          const data = await productoService.getProductosSimilares(
            currentProduct.categoria_id,
            currentProduct.id,
            3
          );
          
          setSimilarProducts(data || []);
        } catch (err) {
          console.error('Error al obtener productos similares:', err);
          setError('No se pudieron cargar productos similares');
          setSimilarProducts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSimilarProducts();
    }
  }, [currentProduct?.id, currentProduct?.categoria_id]); // Solo dependencias primitivas estables

  if (loading) {
    return (
      <div className="similar-products-container">
        <h3 className="similar-products-title">Productos Similares</h3>
        <div className="similar-products-loading">
          <div className="loading-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-code"></div>
            </div>
          </div>
          <div className="loading-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-code"></div>
            </div>
          </div>
          <div className="loading-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-code"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || similarProducts.length === 0) {
    return null; // No mostrar nada si hay error o no hay productos similares
  }

  return (
    <div className="similar-products-container">
      <h3 className="similar-products-title">Productos Similares</h3>
      
      {/* Desktop Grid */}
      <div className="similar-products-grid desktop-only">
        {similarProducts.map((product) => (
          <div key={product.id} className="similar-product-card">
            <div className="similar-product-image">
              <Link to={`/producto/${product.id}?categoria_id=${product.categoria_id}`}>
                <img
                  src={product.imagen_url || '/default-product.jpg'}
                  alt={product.nombre}
                  loading="lazy"
                />
              </Link>
            </div>
            <div className="similar-product-info">
              <h4 className="similar-product-name">
                <Link to={`/producto/${product.id}?categoria_id=${product.categoria_id}`}>
                  {product.nombre}
                </Link>
              </h4>
              <p className="similar-product-code">Código: {product.codigo}</p>
              <Link 
                to={`/producto/${product.id}?categoria_id=${product.categoria_id}`}
                className="similar-product-button"
              >
                <FaEye />
                Ver Producto
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="similar-products-carousel mobile-only">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1.2}
          centeredSlides={true}
          navigation={true}
          pagination={{ clickable: true }}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 12,
              centeredSlides: true
            },
            480: {
              slidesPerView: 1.5,
              spaceBetween: 16,
              centeredSlides: true
            }
          }}
          className="similar-products-swiper"
        >
          {similarProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="similar-product-card-mobile">
                <div className="similar-product-image-mobile">
                  <Link to={`/producto/${product.id}?categoria_id=${product.categoria_id}`}>
                    <img
                      src={product.imagen_url || '/default-product.jpg'}
                      alt={product.nombre}
                      loading="lazy"
                    />
                  </Link>
                </div>
                <div className="similar-product-info-mobile">
                  <h4 className="similar-product-name-mobile">
                    <Link to={`/producto/${product.id}?categoria_id=${product.categoria_id}`}>
                      {product.nombre}
                    </Link>
                  </h4>
                  <p className="similar-product-code-mobile">Código: {product.codigo}</p>
                  <Link 
                    to={`/producto/${product.id}?categoria_id=${product.categoria_id}`}
                    className="similar-product-button-mobile"
                  >
                    <FaEye />
                    Ver Producto
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default SimilarProducts;
