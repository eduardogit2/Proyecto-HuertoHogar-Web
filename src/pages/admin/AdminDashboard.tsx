import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { usuarioActual } = useAuth();
  const nombreAdmin = usuarioActual?.nombre || 'Administrador';

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 texto-secundario">¡HOLA, {nombreAdmin}!</h1>
        <i className="bi bi-bell-fill h4 mb-0 texto-secundario"></i>
      </header>
      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title texto-secundario">Gestión de Pedidos</h5>
              <p className="card-text texto-secundario">Revisa, actualiza y gestiona todos los pedidos de los clientes.</p>
              <Link to="/admin/pedidos" className="btn btn-primario mt-3">Ir a Pedidos</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title texto-secundario">Gestión de Productos</h5>
              <p className="card-text texto-secundario">Administra y organiza el catálogo de productos de tu tienda.</p>
              <Link to="/admin/productos" className="btn btn-primario mt-3">Ir a Productos</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title texto-secundario">Gestión de Usuarios</h5>
              <p className="card-text texto-secundario">Revisa y gestiona los usuarios registrados en tu plataforma.</p>
              <Link to="/admin/usuarios" className="btn btn-primario mt-3">Ir a Usuarios</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title texto-secundario">Gestión del Blog</h5>
              <p className="card-text texto-secundario">Crea, edita y publica nuevos artículos en el blog de la tienda.</p>
              <Link to="/admin/blog" className="btn btn-primario mt-3">Ir al Blog</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}