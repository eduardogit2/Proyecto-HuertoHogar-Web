import { Routes, Route, Link, Outlet, NavLink } from 'react-router-dom';
import Layout from './components/Layout';
import RutaPrivada from './components/RutaPrivada';
import { useAuth } from './context/AuthContext';

import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import Blog from './pages/Blog';
import Sucursales from './pages/Sucursales';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Ingreso from './pages/Ingreso';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';
import Compra from './pages/Compra';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminProductos from './pages/admin/AdminProductos';
import FormularioProducto from './pages/admin/FormularioProducto';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import FormularioUsuario from './pages/admin/FormularioUsuario';
import AdminBlog from './pages/admin/AdminBlog';
import FormularioBlog from './pages/admin/FormularioBlog';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminReportes from './pages/admin/AdminReportes';
import AdminPerfil from './pages/admin/AdminPerfil';


const AdminLayout = () => {
  const { logout } = useAuth();
  
  return (
    <div className="d-flex" id="contenedor-admin">
      <nav 
        className="p-3 bg-white border-end shadow-sm" 
        style={{ minHeight: '100vh', width: '250px' }}
      >
        <div className="text-center mb-4">
            <Link className="d-flex align-items-center gap-2 text-decoration-none" to="/">
                <img src="/img/logo.jpg" alt="HuertoHogar" className="imagen-logo" />
                <h5 className="mb-0 texto-secundario">HuertoHogar</h5>
            </Link>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin" end>
              <i className="bi bi-grid-fill me-2"></i><span>Principal</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/pedidos">
              <i className="bi bi-receipt me-2"></i><span>Pedidos</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/productos">
              <i className="bi bi-box-seam-fill me-2"></i><span>Productos</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/usuarios">
              <i className="bi bi-people-fill me-2"></i><span>Usuarios</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/blog">
              <i className="bi bi-pencil-square me-2"></i><span>Blog</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/categorias">
              <i className="bi bi-tag me-2"></i><span>Categorías</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/reportes">
              <i className="bi bi-bar-chart-line me-2"></i><span>Reportes</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/perfil">
              <i className="bi bi-person-circle me-2"></i><span>Perfil</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-link" onClick={logout}>
              <i className="bi bi-box-arrow-right me-2"></i><span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <main className="flex-grow-1 p-4" style={{ backgroundColor: 'var(--color-beige-suave)' }}>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Productos />} />
        <Route path="blog" element={<Blog />} />
        <Route path="sucursales" element={<Sucursales />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="ingreso" element={<Ingreso />} />
        <Route path="registro" element={<Registro />} />

        <Route element={<RutaPrivada />}>
          <Route path="perfil" element={<Perfil />} />
          <Route path="compra" element={<Compra />} />
        </Route>

        <Route path="*" element={
          <div className="container my-5 text-center">
            <h1>404 - Página No Encontrada</h1>
            <p>La página que buscas no existe.</p>
            <Link to="/" className="btn btn-primario">Volver al Inicio</Link>
          </div>
        } />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="pedidos" element={<AdminPedidos />} />
        <Route path="ordenes" element={<AdminPedidos />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="productos/nuevo" element={<FormularioProducto />} />
        <Route path="productos/editar/:id" element={<FormularioProducto />} />
        <Route path="categorias" element={<AdminCategorias />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="usuarios/nuevo" element={<FormularioUsuario />} />
        <Route path="usuarios/editar/:correo" element={<FormularioUsuario />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="blog/nuevo" element={<FormularioBlog />} />
        <Route path="blog/editar/:id" element={<FormularioBlog />} />
        <Route path="reportes" element={<AdminReportes />} />
        <Route path="perfil" element={<AdminPerfil />} />
      </Route>
      
    </Routes>
  );
}

export default App;