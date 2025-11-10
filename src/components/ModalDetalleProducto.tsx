import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import type { Producto, Resena } from '../types';
import { formatearPrecio } from '../utils/format';
import StarRating from './StarRating';
import { api } from '../services/mockApi';

interface ModalDetalleProductoProps {
  producto: Producto | null;
  onClose: () => void;
  onResenaAgregada: (productoActualizado: Producto) => void;
}

function RenderResenas({ resenas }: { resenas: Resena[] }) {
  if (resenas.length === 0) {
    return <p className="text-muted fst-italic text-center">Este producto no tiene reseñas. ¡Sé el primero en dejar una!</p>;
  }
  return (
    <>
      {resenas.map((resena, index) => (
        <div key={index} className="card card-body mb-2">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <strong>{resena.usuario}</strong>
            <StarRating calificacion={resena.calificacion} />
          </div>
          <p className="mb-0">{resena.texto}</p>
        </div>
      ))}
    </>
  );
}

export default function ModalDetalleProducto({ producto, onClose, onResenaAgregada }: ModalDetalleProductoProps) {
  const { agregarAlCarrito, estaEnStock } = useCart();
  const { usuarioActual } = useAuth();
  const { showNotification } = useNotification();

  const [cantidad, setCantidad] = useState(1);
  const [calificacionResena, setCalificacionResena] = useState(5);
  const [textoResena, setTextoResena] = useState("");

  const handleAgregarAlCarrito = () => {
    if (!producto) return;

    if (!usuarioActual) {
      showNotification('Debes iniciar sesión para comprar.', 'error');
      onClose();
      return;
    }

    if (cantidad <= 0) {
      showNotification('La cantidad debe ser mayor a 0.', 'error');
      return;
    }

    if (!estaEnStock(producto, cantidad)) {
      return;
    }

    agregarAlCarrito(producto, cantidad);
    showNotification(`${producto.nombre} (x${cantidad}) añadido al carrito.`, 'success');
    onClose();
  };

  const handleResenaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!producto || !usuarioActual) return;

    if (calificacionResena < 1 || calificacionResena > 5) {
      showNotification('La calificación debe ser entre 1 y 5.', 'error');
      return;
    }
    if (!textoResena.trim()) {
      showNotification('El comentario no puede estar vacío.', 'error');
      return;
    }

    const nuevaResena: Resena = {
      usuario: usuarioActual.nombre,
      calificacion: calificacionResena,
      texto: textoResena
    };

    api.addResena(producto.id, nuevaResena)
      .then(productoActualizado => {
        onResenaAgregada(productoActualizado);
        showNotification('¡Reseña enviada con éxito!', 'success');
        setTextoResena("");
        setCalificacionResena(5);
      })
      .catch(err => {
        console.error(err);
        showNotification('Error al enviar la reseña.', 'error');
      });
  };

  const handleOnExited = () => {
    setCantidad(1);
    setCalificacionResena(5);
    setTextoResena("");
  };

  if (!producto) return null;

  const precioFinal = producto.precioConDescuento ?? producto.precio;
  const precioMostrado = formatearPrecio(precioFinal);
  const precioOriginalMostrado = formatearPrecio(producto.precio);


  return (
    <Modal show={producto !== null} onHide={onClose} onExited={handleOnExited} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="tituloModalDetalleProducto">{producto.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="contenidoModalDetalleProducto">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid mb-3 w-100 rounded" />
          <p>
            <strong>Precio: </strong>
            {producto.precioConDescuento !== undefined ? (
              <>
                <span style={{ color: '#FFD700', fontWeight: 700 }}>{precioMostrado}</span>
                <small className="text-muted text-decoration-line-through ms-2">{precioOriginalMostrado}</small>
              </>
            ) : (
              <span>{precioMostrado}</span>
            )}
            <span> por {producto.unidad}</span>
          </p>
          <p><strong>Categoría:</strong> {producto.categoria}</p>
          <p><strong>Origen:</strong> {producto.origen}</p>
          <p><strong>Descripción:</strong> {producto.descripcion}</p>
          <p className="mb-3">
            <strong>Stock disponible:</strong>
            <span className="stock-disponible-modal"> {producto.stock} </span>
            {producto.unidad}{producto.stock !== 1 ? 's' : ''}
          </p>

          <div className="d-flex align-items-center justify-content-between mb-4">
            <label htmlFor="cantidad-modal" className="me-2 fw-bold">Cantidad:</label>
            <input
              type="number"
              id="cantidad-modal"
              className="form-control w-25 text-center me-3"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              min="1"
              max={producto.stock}
              disabled={producto.stock <= 0}
            />
            <button
              className="btn btn-primario agregar-al-carrito-modal"
              onClick={handleAgregarAlCarrito}
              disabled={producto.stock <= 0}
            >
              {producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
            </button>
          </div>
        </div>

        <hr />

        <h5 className="mb-3">Reseñas de Clientes</h5>
        <div id="contenedor-resenas" className="mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <RenderResenas resenas={producto.resenas} />
        </div>

        {!usuarioActual ? (
          <p id="mensaje-seccion-resena" className="text-muted text-center fst-italic">
            Debes <Link to="/ingreso" onClick={onClose}>iniciar sesión</Link> para dejar una reseña.
          </p>
        ) : (
          <div id="seccion-formulario-resena">
            <h6 className="mb-3">Deja tu reseña</h6>
            <form id="formulario-resena" onSubmit={handleResenaSubmit}>
              <div className="mb-3">
                <label htmlFor="calificacion-resena" className="form-label">Valoración (1-5)</label>
                <input
                  type="number"
                  id="calificacion-resena"
                  className="form-control"
                  min="1" max="5"
                  value={calificacionResena}
                  onChange={(e) => setCalificacionResena(Number(e.target.value))}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="texto-resena" className="form-label">Comentario</label>
                <textarea
                  id="texto-resena"
                  className="form-control"
                  rows={3}
                  value={textoResena}
                  onChange={(e) => setTextoResena(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primario">Enviar Reseña</button>
              </div>
            </form>
          </div>
        )}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}