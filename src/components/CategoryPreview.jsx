import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import './CategoryPreview.css';
import { FaSpinner } from 'react-icons/fa';

const CategoryPreview = ({ category, products, isLoading, position }) => {
  if (!category) return null;

  const style = {
    top: `${position.top}px`,
    left: `${position.left}px`,
  };
  
  const imageUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  return (
    <div className="category-preview-popup" style={style}>
      <h4 className="preview-title">{category.nombre}</h4>
      <div className="preview-content">
        {isLoading ? (
          <div className="preview-loading">
            <FaSpinner className="spinner" />
            <span>Cargando...</span>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            loop={true}
            className="preview-carousel"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <img 
                  src={`${imageUrl}${product.imagen_url}`} 
                  alt={product.nombre} 
                  className="preview-product-image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default CategoryPreview;