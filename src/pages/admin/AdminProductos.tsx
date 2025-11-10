import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/mockApi';
import type { Producto } from '../../types';
import { formatearPrecio } from '../../utils/format';
import { useNotification } from '../../context/NotificationContext';

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    setCargando(true);
    api.getProductos()
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setCargando(false);
      });
  };

  const handleEliminar = (id: number) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto con ID: ${id}?`)) {
      api.deleteProducto(id)
        .then(() => {
          showNotification('Producto eliminado.', 'success');
          cargarProductos();
        })
        .catch(err => {
          console.error("Error al eliminar producto:", err);
          showNotification('Error al eliminar el producto.', 'error');
        });
    }
  };

  if (cargando) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 texto-secundario">Gestión de Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primario">
          <i className="bi bi-plus-circle me-2"></i> Nuevo Producto
        </Link>
      </header>

      <div className="table-responsive">
        <table className="table table-hover shadow-sm">
          <thead className="bg-light">
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Origen</th>
              <th>Etiqueta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="cuerpoTablaProductos">
            {productos.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted">No hay productos registrados.</td>
              </tr>
            ) : (
              productos.map(producto => {
                const precioFinal = producto.precioConDescuento ?? producto.precio;
                const precioMostrar = precioFinal === 0 ? 'Gratis' : formatearPrecio(precioFinal);
                const alertaStockCritico = (producto.stockCritico !== null && producto.stock <= producto.stockCritico)
                  ? '<span class="badge bg-danger ms-2">Stock Crítico</span>'
                  : '';

                const descuento = producto.precioConDescuento !== undefined
                  ? Math.round(((producto.precio - producto.precioConDescuento) / producto.precio) * 100)
                  : 0;
                const textoDescuento = descuento > 0 ? ` (${descuento}% de dcto.)` : '';
                const etiqueta = producto.precioConDescuento !== undefined ? 'Oferta' : 'Normal';

                return (
                  <tr key={producto.id}>
                    <td>{producto.id || ''}</td>
                    <td>{producto.nombre}</td>
                    <td>{precioMostrar}</td>
                    <td dangerouslySetInnerHTML={{ __html: `${producto.stock} ${alertaStockCritico}` }} />
                    <td>{producto.categoria || 'N/A'}</td>
                    <td>{producto.origen || 'N/A'}</td>
                    <td>
                      <span className={`badge ${etiqueta === 'Oferta' ? 'bg-warning' : 'bg-success'}`}>
                        {etiqueta} {textoDescuento}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/productos/editar/${producto.id}`} className="btn btn-sm btn-warning me-2">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(producto.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}