// src/components/ClientReviews.jsx
import React, { useState } from 'react';
import './ClientReviews.css';
import { FaStar, FaChevronLeft, FaChevronRight, FaUserCircle } from 'react-icons/fa';

const reviews = [
  {
    name: "Lucía G.",
    rating: 5,
    comment: "Excelente calidad y atención al cliente. Los guantes superaron mis expectativas.",
    image: "/src/assets/client1.jpg"
  },
  {
    name: "Carlos M.",
    rating: 4,
    comment: "Muy buenos productos. Me asesoraron bien y llegó todo en tiempo y forma.",
    image: null // Esta no tiene foto
  },
  {
    name: "Valeria R.",
    rating: 5,
    comment: "Compro hace años. Siempre confiables y con precios justos.",
    image: "/src/assets/client3.jpg"
  }
];

function ClientReviews() {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[current];

  return (
    <section className="reviews-carousel">
      <h2 className="reviews-title">Reseñas de Clientes</h2>
      <p className="reviews-subtitle">Conocé qué opinan quienes ya confiaron en nosotros</p>

      <div className="review-card">
        {currentReview.image ? (
          <img src={currentReview.image} alt={currentReview.name} className="review-avatar" />
        ) : (
          <FaUserCircle className="review-avatar placeholder-icon" />
        )}

        <div className="review-stars">
          {Array(currentReview.rating).fill().map((_, i) => (
            <FaStar key={i} className="star" />
          ))}
        </div>
        <p className="review-comment">"{currentReview.comment}"</p>
        <p className="review-name">- {currentReview.name}</p>

        <div className="review-nav">
          <button onClick={handlePrev} className="nav-btn"><FaChevronLeft /></button>
          <button onClick={handleNext} className="nav-btn"><FaChevronRight /></button>
        </div>
      </div>
    </section>
  );
}

export default ClientReviews;
