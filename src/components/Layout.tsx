import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatearPrecio } from '../utils/format';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';

function MenuAutenticacion() {
  const { usuarioActual, logout } = useAuth();
  const navigate = useNavigate();

  if (usuarioActual) {
    return (
      <Dropdown as={Nav.Item}>
        <Dropdown.Toggle as={Nav.Link} id="menuDesplegableUsuario" style={{ color: 'var(--color-texto-principal)' }}>
          Hola, {usuarioActual.nombre}
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Item onClick={() => navigate('/perfil')}>Mi Perfil</Dropdown.Item>
          {usuarioActual.esAdmin && (
            <Dropdown.Item onClick={() => navigate('/admin')}>Panel de Admin</Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <Nav.Item className="d-flex gap-2">
      <Link to="/ingreso" className="btn btn-sm btn-acento" style={{ backgroundColor: 'var(--color-primario)' }}>
        <span style={{ color: '#fff' }}>Iniciar sesión</span>
      </Link>
      <Link to="/registro" className="btn btn-sm btn-acento" style={{ backgroundColor: 'var(--color-primario)' }}>
        <span style={{ color: '#fff' }}>Regístrate</span>
      </Link>
    </Nav.Item>
  );
}

function MenuCarrito() {
  const { carrito, contadorCarrito, totalCarrito, limpiarCarrito, cambiarCantidad } = useCart();
  const navigate = useNavigate();

  return (
    <Dropdown as={Nav.Item}>
      <Dropdown.Toggle as="button" className="btn btn-acento btn-sm position-relative" id="desplegableCarrito">
        <i className="bi bi-cart"></i>
        <span id="contadorCarrito"
          className="badge bg-danger position-absolute top-0 start-100 translate-middle">{contadorCarrito}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu align="end" className="p-3" style={{ minWidth: '300px' }}>
        <div id="itemsCarrito">
          {carrito.length === 0 ? (
            <span className="text-muted">Tu carrito está vacío</span>
          ) : (
            carrito.map(item => (
              <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <strong>{item.nombre}</strong><br />
                  <small>{formatearPrecio(item.precio)} x {item.cantidad} {item.unidad}{item.cantidad > 1 ? 's' : ''}</small>
                </div>
                <div className="d-flex align-items-center">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                  <span className="mx-2">{item.cantidad}</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <Dropdown.Divider />

        <div className="d-flex justify-content-between fw-bold">
          <span>Total:</span> <span id="totalCarrito">{formatearPrecio(totalCarrito)}</span>
        </div>
        <div className="mt-2">
          <button
            id="botonIrAPagar"
            className="btn btn-sm btn-primario w-100"
            onClick={() => navigate('/compra')}
          >
            Continuar con la compra
          </button>
        </div>
        <div className="mt-2">
          <button id="botonLimpiarCarrito" className="btn btn-sm btn-outline-danger w-100" onClick={limpiarCarrito}>
            Limpiar el carrito
          </button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}


export default function Layout() {
  return (
    <>
      <Navbar expand="lg" className="shadow-sm barra-navegacion">
        <div className="container">
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <img src="/img/logo.jpg" alt="HuertoHogar" className="imagen-logo" />
            <span style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-secundario)', fontWeight: 700 }}>HuertoHogar</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navegacionPrincipal" />
          <Navbar.Collapse id="navegacionPrincipal">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
              <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
              <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
              <Nav.Link as={NavLink} to="/sucursales">Sucursales</Nav.Link>
              <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
              <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
            </Nav>
            <Nav className="d-flex align-items-center gap-2">
              <MenuAutenticacion />
              <MenuCarrito />
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>

      <Outlet />


      <footer className="mt-5">
        © 2025 HuertoHogar — Productos frescos y sostenibles
      </footer>
    </>
  )
}