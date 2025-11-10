import type { Producto } from '../types';
import { formatearPrecio } from '../utils/format';
import StarRating from './StarRating';

interface TarjetaProductoProps {
  producto: Producto;
  onProductoClick: (producto: Producto) => void;
}

export default function TarjetaProducto({ producto, onProductoClick }: TarjetaProductoProps) {

  const calificacionPromedio = producto.resenas.length > 0
    ? (producto.resenas.reduce((acc, r) => acc + r.calificacion, 0) / producto.resenas.length)
    : 0;
  const textoResena = producto.resenas.length > 0 ? `(${producto.resenas.length})` : '';

  const porcentajeDescuento = producto.precioConDescuento
    ? Math.round(((producto.precio - producto.precioConDescuento) / producto.precio) * 100)
    : 0;
  const insigniaDescuento = porcentajeDescuento > 0 ? `<span class="badge bg-success ms-2">-${porcentajeDescuento}%</span>` : '';

  const precioFinal = producto.precioConDescuento ?? producto.precio;
  const precioMostrado = formatearPrecio(precioFinal);
  const precioOriginalMostrado = formatearPrecio(producto.precio);

  const unidadesPluralizables = ['bolsa', 'litro', 'frasco', 'kg'];
  const unidadTexto = producto.stock !== 1 && unidadesPluralizables.includes(producto.unidad)
    ? `${producto.unidad}s`
    : producto.unidad;

  return (
    <div className="col-sm-6 col-md-4 mb-4">
      <div
        className="card tarjeta-producto h-100 shadow-sm"
        style={{ cursor: 'pointer' }}
        onClick={() => onProductoClick(producto)}
      >
        <img
          src={producto.imagen.startsWith('img/') ? `/${producto.imagen}` : producto.imagen}
          alt={producto.nombre}
          className="imagen-producto card-img-top"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/cccccc?text=Imagen+No+Disponible')}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-center mb-1">{producto.nombre}</h5>
          <p className="text-center text-muted fw-light fst-italic mb-2">{producto.origen}</p>

          <div className="text-center mb-2 d-flex justify-content-center align-items-center gap-2">
            <StarRating calificacion={calificacionPromedio} />
            <span className="small text-muted">{calificacionPromedio.toFixed(1)} {textoResena}</span>
          </div>

          <p className="card-text text-center descripcion-producto">
            {producto.descripcion.substring(0, 70)}...
          </p>

          <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
            {producto.precioConDescuento !== undefined ? (
              <div>
                <span className="precio fw-bold" style={{ color: '#FFD700' }}>{precioMostrado}</span>
                <small className="text-muted text-decoration-line-through ms-2">{precioOriginalMostrado}</small>
                <span dangerouslySetInnerHTML={{ __html: insigniaDescuento }} />
              </div>
            ) : (
              <span className="precio fw-bold">{precioMostrado}</span>
            )}
            <span className="text-success fw-bold small">Stock: {producto.stock} {unidadTexto}</span>
          </div>
        </div>
      </div>
    </div>
  );
}