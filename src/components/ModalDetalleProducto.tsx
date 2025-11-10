import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useProductContext } from '../context/ProductContext';
import type { Producto, Resena } from '../types';
import { formatearPrecio } from '../utils/format';
import StarRating from './StarRating';
import { api } from '../services/mockApi';
import { Modal, Button } from 'react-bootstrap';

interface ModalDetalleProductoProps {
  producto: Producto | null;
  onClose: () => void;
  onResenaAgregada: (productoActualizado: Producto) => void;
}

function RenderResenas({ resenas }: { resenas: Resena[] }) {
  if (resenas.length === 0) {
    return <p className="text-muted fst-italic text-center">Este producto no tiene reseñas.</p>;
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
  const { productos: productosEnVivo } = useProductContext();
  
  const [cantidad, setCantidad] = useState(1);
  const [calificacionResena, setCalificacionResena] = useState(5);
  const [textoResena, setTextoResena] = useState("");
  const [isAgregando, setIsAgregando] = useState(false);

  const productoVivo = useMemo(() => {
    if (!producto) return null;
    return productosEnVivo.find(p => p.id === producto.id) || producto;
  }, [producto, productosEnVivo]);


  const handleAgregarAlCarrito = async () => {
    if (!productoVivo) return;
    setIsAgregando(true);

    if (!usuarioActual) {
      showNotification('Debes iniciar sesión para comprar.', 'error');
      onClose();
      setIsAgregando(false);
      return;
    }
    
    if (cantidad <= 0) {
      showNotification('La cantidad debe ser mayor a 0.', 'error');
      setIsAgregando(false);
      return;
    }

    if (!await estaEnStock(productoVivo, cantidad)) {
      setIsAgregando(false);
      return;
    }
    
    await agregarAlCarrito(productoVivo, cantidad);
    
    setIsAgregando(false);
    onClose();
  };

  const handleResenaSubmit = (e: React.FormEvent) => {
    if (!productoVivo || !usuarioActual) return;
    e.preventDefault();

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

    api.addResena(productoVivo.id, nuevaResena)
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

  if (!productoVivo) return null;

  const precioFinal = productoVivo.precioConDescuento ?? productoVivo.precio;
  const precioMostrado = formatearPrecio(precioFinal);
  const precioOriginalMostrado = formatearPrecio(productoVivo.precio);

  return (
    <Modal show={producto !== null} onHide={onClose} onExited={handleOnExited} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="tituloModalDetalleProducto">{productoVivo.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="contenidoModalDetalleProducto">
          <img src={productoVivo.imagen} alt={productoVivo.nombre} className="img-fluid mb-3 w-100 rounded" />
          <p>
            <strong>Precio: </strong>
            {productoVivo.precioConDescuento !== undefined ? (
              <>
                <span style={{ color: '#FFD700', fontWeight: 700 }}>{precioMostrado}</span>
                <small className="text-muted text-decoration-line-through ms-2">{precioOriginalMostrado}</small>
              </>
            ) : (
              <span>{precioMostrado}</span>
            )}
            <span> por {productoVivo.unidad}</span>
          </p>
          <p><strong>Categoría:</strong> {productoVivo.categoria}</p>
          <p><strong>Origen:</strong> {productoVivo.origen}</p>
          <p><strong>Descripción:</strong> {productoVivo.descripcion}</p>
          
          <p className="mb-3">
            <strong>Stock disponible:</strong> 
            <span className="stock-disponible-modal"> {productoVivo.stock} </span> 
            {productoVivo.unidad}{productoVivo.stock !== 1 ? 's' : ''}
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
              max={productoVivo.stock}
              disabled={productoVivo.stock <= 0 || isAgregando}
            />
            <button 
              className="btn btn-primario agregar-al-carrito-modal"
              onClick={handleAgregarAlCarrito}
              disabled={productoVivo.stock <= 0 || isAgregando}
            >
              {isAgregando ? 'Agregando...' : (productoVivo.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock')}
            </button>
          </div>
        </div>
        
        <hr />
        
        <h5 className="mb-3">Reseñas de Clientes</h5>
        <div id="contenedor-resenas" className="mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <RenderResenas resenas={productoVivo.resenas} />
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