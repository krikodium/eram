// src/components/CategoryIcons.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CategoryIcons.css';
import { Link } from 'react-router-dom';
import {
  FaFireExtinguisher,
  FaHardHat,
  FaFirstAid,
  FaCampground,
  FaClipboardList
} from "react-icons/fa6";
import { FaAmbulance } from "react-icons/fa";

const iconMap = {
  "Baldes de Incendio": <FaFireExtinguisher />,
  "Botas Industriales": <FaHardHat />,
  "Botiquines Primeros Auxilios": <FaFirstAid />,
  "Camillas - Inmovilizador - Férulas": <FaAmbulance />,
  "Carpa Para piso": <FaCampground />,
  "Carteleria": <FaClipboardList />
};

const DefaultIcon = <FaHardHat />;

function NextArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={`${className} custom-arrow next-arrow`} onClick={onClick}>
      ›
    </div>
  );
}

function PrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={`${className} custom-arrow prev-arrow`} onClick={onClick}>
      ‹
    </div>
  );
}

const CategoryIcons = () => {
  const [categorias, setCategorias] = useState([]);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${api}/api/categorias`);
        const data = Array.isArray(response.data) ? response.data : [];
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategorias();
  }, [api]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '40px',
        }
      }
    ]
  };

  return (
    <section className="category-slider-section">
      <div className="section-header">
        <h2 className="section-title">Nuestras Categorías</h2>
        <p className="section-subtitle">Explorá nuestras líneas de protección profesional</p>
      </div>
      <div className="slider-container">
        <Slider {...settings}>
          {categorias.map((cat) => (
            <div key={cat.id} className="category-slide">
              <Link to={`/catalogo?categoria_id=${cat.id}`} className="category-card">
                <div className="category-icon-wrapper">
                  {iconMap[cat.nombre] || DefaultIcon}
                </div>
                <span className="category-name">{cat.nombre}</span>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default CategoryIcons;
