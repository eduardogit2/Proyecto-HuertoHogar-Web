import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/mockApi';

export default function AdminDashboard() {
  const { usuarioActual } = useAuth();
  const nombreAdmin = usuarioActual?.nombre || 'Administrador';

  const [cargando, setCargando] = useState(true);
  const [pedidosCount, setPedidosCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [usuariosCount, setUsuariosCount] = useState(0);

  useEffect(() => {
    Promise.all([
      api.getAllPedidos(),
      api.getProductos(),
      api.getUsuarios()
    ])
      .then(([pedidos, productos, usuarios]) => {
        setPedidosCount(pedidos.length);
        setProductosCount(productos.length);
        setUsuariosCount(usuarios.length);
      })
      .catch(err => console.error("Error al cargar datos del dashboard:", err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="container-fluid">
        <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
          <h1 className="h2 texto-secundario">¡Hola, {nombreAdmin}!</h1>
        </header>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 texto-secundario">¡Hola, {nombreAdmin}!</h1>
        <i className="bi bi-bell-fill h4 mb-0 texto-secundario"></i>
      </header>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <i className="bi bi-receipt h1 texto-secundario"></i>
              <h5 className="card-title texto-secundario mt-2">Gestión de Pedidos</h5>
              <p className="card-text texto-secundario">
                Hay <strong style={{ color: 'var(--color-primario)' }}>{pedidosCount}</strong> pedidos en total.
              </p>
              <Link to="/admin/pedidos" className="btn btn-primario mt-3">Ir a Pedidos</Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <i className="bi bi-box-seam-fill h1 texto-secundario"></i>
              <h5 className="card-title texto-secundario mt-2">Gestión de Productos</h5>
              <p className="card-text texto-secundario">
                Hay <strong style={{ color: 'var(--color-primario)' }}>{productosCount}</strong> productos en el catálogo.
              </p>
              <Link to="/admin/productos" className="btn btn-primario mt-3">Ir a Productos</Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <i className="bi bi-people-fill h1 texto-secundario"></i>
              <h5 className="card-title texto-secundario mt-2">Gestión de Usuarios</h5>
              <p className="card-text texto-secundario">
                Hay <strong style={{ color: 'var(--color-primario)' }}>{usuariosCount}</strong> usuarios registrados.
              </p>
              <Link to="/admin/usuarios" className="btn btn-primario mt-3">Ir a Usuarios</Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <i className="bi bi-pencil-square h1 texto-secundario"></i>
              <h5 className="card-title texto-secundario mt-2">Gestión del Blog</h5>
              <p className="card-text texto-secundario">
                Administra las publicaciones del blog.
              </p>
              <Link to="/admin/blog" className="btn btn-primario mt-3">Ir al Blog</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}