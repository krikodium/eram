// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // <-- 1. Importa Link
import axios from 'axios';
import './ProductDetail.css'; // <-- 2. Importa el nuevo archivo CSS

function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/productos/${id}`);
        setProducto(response.data);
      } catch (err) {
        console.error("Error al obtener el producto:", err);
        setError('No se pudo cargar el producto o no fue encontrado.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="product-detail-container">Cargando producto...</p>;
  if (error) return <p className="product-detail-container">{error}</p>;
  if (!producto) return <p className="product-detail-container">Producto no encontrado.</p>;

  return (
    <div className="product-detail-container">
      {/* 3. Enlace para volver al catálogo */}
      <Link to="/catalogo" className="back-link">
        &larr; Volver al Catálogo
      </Link>

      <div className="product-detail-layout">
        <div className="product-image-placeholder">
          <span>Imagen Próximamente</span>
        </div>

        <div className="product-info">
          <h1>{producto.nombre}</h1>
          <p className="description">{producto.descripcion}</p>

          <div className="product-price">${parseFloat(producto.precio).toFixed(2)}</div>

          {/* 4. Sección de Especificaciones para datos clave */}
          <h3>Especificaciones Técnicas</h3>
          <table className="product-specs">
            <tbody>
              <tr>
                <td>Marca:</td>
                <td>{producto.marca}</td>
              </tr>
              <tr>
                <td>SKU:</td>
                <td>{producto.sku}</td>
              </tr>
              {/* Ejemplo de cómo añadir más datos si existieran */}
              {producto.absorcion && (
                 <tr>
                    <td>Absorción:</td>
                    <td>{producto.absorcion}</td>
                 </tr>
              )}
            </tbody>
          </table>

          {/* 5. El botón de ficha técnica ahora usa una clase CSS */}
          {producto.ficha_tecnica_url && (
            <a
              href={producto.ficha_tecnica_url}
              target="_blank"
              rel="noopener noreferrer"
              className="product-ficha-link"
            >
              Ver Ficha Técnica
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;