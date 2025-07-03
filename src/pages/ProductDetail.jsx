import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api}/api/productos/${id}`);
        setProducto(response.data);
      } catch (err) {
        console.error("Error al obtener el producto:", err);
        setError('No se pudo cargar el producto o no fue encontrado.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, api]);

  if (loading) return <p className="product-detail-container">Cargando producto...</p>;
  if (error) return <p className="product-detail-container">{error}</p>;
  if (!producto) return <p className="product-detail-container">Producto no encontrado.</p>;

  return (
    <div className="product-detail-container" data-aos="fade-up">
      <Link to="/catalogo" className="back-link">
        &larr; Volver al Catálogo
      </Link>

      <div className="product-detail-layout">
        <div className="product-image-placeholder">
          {producto.imagen_url ? (
            <img src={producto.imagen_url} alt={producto.nombre} className="product-img-real" />
          ) : (
            <span>Imagen Próximamente</span>
          )}
        </div>

        <div className="product-info">
          <h1>{producto.nombre}</h1>
          <p className="description">{producto.descripcion}</p>

          {producto.precio && (
            <div className="product-price">
              ${parseFloat(producto.precio).toFixed(2)}
            </div>
          )}

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
              {producto.absorcion && (
                <tr>
                  <td>Absorción:</td>
                  <td>{producto.absorcion}</td>
                </tr>
              )}
              {producto.talles_disponibles && (
                <tr>
                  <td>Talles:</td>
                  <td>{producto.talles_disponibles}</td>
                </tr>
              )}
            </tbody>
          </table>

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
