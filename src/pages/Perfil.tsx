import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { validarRut } from '../utils/validation';
import type { Usuario, Pedido } from '../types';
import { formatearPrecio } from '../utils/format';
import { Modal, Button, Tab, Tabs } from 'react-bootstrap';
import { api } from '../services/mockApi';

function TabDatosPersonales() {
  const { usuarioActual, updateUser } = useAuth();
  const { showNotification } = useNotification();

  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [contrasena, setContrasena] = useState('');

  useEffect(() => {
    if (usuarioActual) {
      setNombre(usuarioActual.nombre || '');
      setRut(usuarioActual.rut || '');
    }
  }, [usuarioActual]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioActual) return;

    if (!validarRut(rut)) {
      showNotification('El RUT ingresado no es válido.', 'error');
      return;
    }
    if (contrasena && (contrasena.length < 4 || contrasena.length > 10)) {
      showNotification('La contraseña debe tener entre 4 y 10 caracteres.', 'error');
      return;
    }

    const usuarioActualizado: Usuario = {
      ...usuarioActual,
      nombre: nombre,
      rut: rut,
      contrasena: contrasena ? contrasena : usuarioActual.contrasena
    };

    updateUser(usuarioActualizado);
    setContrasena('');
  };

  return (
    <form id="formularioPerfil" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="nombrePerfil" className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          id="nombrePerfil"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="correoPerfil" className="form-label">Correo electrónico</label>
        <input
          type="email"
          className="form-control"
          id="correoPerfil"
          value={usuarioActual?.correo || ''}
          disabled
        />
      </div>
      <div className="mb-3">
        <label htmlFor="rutPerfil" className="form-label">RUT</label>
        <input
          type="text"
          className="form-control"
          id="rutPerfil"
          required
          value={rut}
          onChange={(e) => setRut(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="contrasenaPerfil" className="form-label">Cambiar Contraseña</label>
        <input
          type="password"
          className="form-control"
          id="contrasenaPerfil"
          placeholder="Déjalo en blanco si no quieres cambiarla"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primario w-100">Guardar Cambios</button>
    </form>
  );
}

function TabDirecciones() {
  const { usuarioActual, updateUser } = useAuth();
  const { showNotification } = useNotification();

  const [calle, setCalle] = useState('');
  const [editandoIndice, setEditandoIndice] = useState<number | null>(null);

  const [regiones, setRegiones] = useState<Record<string, string[]>>({});
  const [comunas, setComunas] = useState<string[]>([]);
  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');

  const direcciones = usuarioActual?.direcciones || [];

  useEffect(() => {
    api.getRegionesYComunas().then(setRegiones);
  }, []);

  useEffect(() => {
    if (regionSeleccionada && regiones[regionSeleccionada]) {
      setComunas(regiones[regionSeleccionada]);
      if (editandoIndice === null) {
        setComunaSeleccionada('');
      }
    } else {
      setComunas([]);
    }
  }, [regionSeleccionada, regiones, editandoIndice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioActual || !calle || !comunaSeleccionada || !regionSeleccionada) {
      showNotification('Por favor, completa calle, región y comuna.', 'error');
      return;
    }

    const nuevaDireccion = { calle, ciudad: comunaSeleccionada, region: regionSeleccionada };

    const nuevasDirecciones = editandoIndice !== null
      ? direcciones.map((dir, indice) =>
        indice === editandoIndice ? nuevaDireccion : dir
      )
      : [...direcciones, nuevaDireccion];

    updateUser({ ...usuarioActual, direcciones: nuevasDirecciones });
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setCalle('');
    setRegionSeleccionada('');
    setComunaSeleccionada('');
    setEditandoIndice(null);
  };

  const handleEditar = (indice: number) => {
    const dir = direcciones[indice];
    setCalle(dir.calle);
    setRegionSeleccionada(dir.region);
    setComunaSeleccionada(dir.ciudad);
    setEditandoIndice(indice);
  };

  const handleEliminar = (indice: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      if (!usuarioActual) return;
      const nuevasDirecciones = direcciones.filter((_, i) => i !== indice);
      updateUser({ ...usuarioActual, direcciones: nuevasDirecciones });
      showNotification('Dirección eliminada.', 'success');
    }
  };

  return (
    <>
      <div id="contenedorDirecciones" className="mb-4">
        {direcciones.length === 0 ? (
          <p className="text-muted">No tienes direcciones guardadas.</p>
        ) : (
          direcciones.map((dir, indice) => (
            <div key={indice} className="card mb-2 shadow-sm p-3">
              <p className="mb-1 fw-bold">Dirección #{indice + 1}</p>
              <p className="mb-1">{dir.calle}, {dir.ciudad}, {dir.region}</p>
              <div className="mt-2">
                <button type="button" className="btn btn-sm btn-info me-2" onClick={() => handleEditar(indice)}>Editar</button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleEliminar(indice)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

      <h5 className="mt-4">{editandoIndice !== null ? 'Editar Dirección' : 'Agregar Nueva Dirección'}</h5>
      <form id="formularioDireccion" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="calleDireccion" className="form-label">Calle y Número</label>
          <input type="text" className="form-control" id="calleDireccion" required value={calle} onChange={(e) => setCalle(e.target.value)} />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="region" className="form-label">Región</label>
            <select
              className="form-select"
              id="region"
              value={regionSeleccionada}
              onChange={(e) => setRegionSeleccionada(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona una región</option>
              {Object.keys(regiones).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="comuna" className="form-label">Comuna</label>
            <select
              className="form-select"
              id="comuna"
              value={comunaSeleccionada}
              onChange={(e) => setComunaSeleccionada(e.target.value)}
              disabled={comunas.length === 0}
              required
            >
              <option value="" disabled>Selecciona una comuna</option>
              {comunas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primario w-100">{editandoIndice !== null ? 'Actualizar Dirección' : 'Guardar Dirección'}</button>
        {editandoIndice !== null && (
          <button type="button" className="btn btn-link w-100" onClick={limpiarFormulario}>Cancelar Edición</button>
        )}
      </form>
    </>
  );
}

function TabHistorial({ onAbrirModal }: { onAbrirModal: (pedido: Pedido) => void }) {
  const { usuarioActual } = useAuth();
  const [historial, setHistorial] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (usuarioActual?.correo) {
      api.getPedidosByCliente(usuarioActual.correo)
        .then((pedidos: Pedido[]) => {
          setHistorial(pedidos);
          setCargando(false);
        });
    }
  }, [usuarioActual?.correo]);

  if (cargando) {
    return <p>Cargando historial...</p>;
  }

  return (
    <>
      <div id="historial-compras" className="list-group">
        {historial.length === 0 ? (
          <div id="mensaje-sin-historial" className="text-center text-muted fst-italic mt-3">
            Aún no tienes compras en tu historial.
          </div>
        ) : (
          historial.map(compra => (
            <div key={compra.id} className="list-group-item list-group-item-action mb-2">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Pedido #{compra.id}</h5>
                <small>{new Date(compra.fecha).toLocaleDateString()}</small>
              </div>
              <p className="mb-1">Tipo: <strong className="text-capitalize">{compra.tipoEntrega}</strong></p>
              <p className="mb-1">Estado: <span className="badge bg-primary">{compra.estado}</span></p>
              <small>Productos: {compra.items.map(item => `${item.nombre} (x${item.cantidad})`).join(', ')}</small>
              <div className="d-flex justify-content-between fw-bold mt-2">
                <span>Total: {formatearPrecio(compra.totalFinal)}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={() => onAbrirModal(compra)}
                >
                  Ver Seguimiento
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

const sucursales: Record<string, { lat: number, lng: number, direccion: string }> = {
  'Santiago Centro': { lat: -33.447487, lng: -70.665365, direccion: 'Av. Libertador 123, Santiago' },
  'Santiago Oriente': { lat: -33.414983, lng: -70.569426, direccion: 'Av. Apoquindo 456, Las Condes' },
  'Santiago Poniente': { lat: -33.473531, lng: -70.766735, direccion: 'Av. Pajaritos 789, Maipú' },
  'Concepción': { lat: -36.82766, lng: -73.05036, direccion: 'Av. O’Higgins 321' },
  'Viña del Mar': { lat: -33.023215, lng: -71.551398, direccion: 'Av. Valparaíso 654' },
  'Puerto Montt': { lat: -41.47294, lng: -72.93722, direccion: 'Mall Paseo Costanera Piso 2 Local 21' },
  'Villarrica': { lat: -39.2842, lng: -72.2285, direccion: 'Calle Fresia 75, Villarrica' },
  'Nacimiento': { lat: -37.5085, lng: -72.6369, direccion: 'Calle El Roble 10, Nacimiento' },
  'Valparaíso': { lat: -33.0458, lng: -71.6197, direccion: 'Calle Condell 500, Valparaíso' }
};

function encontrarSucursalMasCercana(direccionUsuario?: string) {
  if (!direccionUsuario) return 'Santiago Centro';
  const region = direccionUsuario.split(',').pop()?.trim().toLowerCase();
  if (region?.includes('metropolitana')) return 'Santiago Centro';
  if (region?.includes('valparaíso')) return 'Valparaíso';
  if (region?.includes('biobío')) return 'Concepción';
  if (region?.includes('los lagos')) return 'Puerto Montt';
  if (region?.includes('la araucanía')) return 'Villarrica';
  return 'Santiago Centro';
}

function ModalSeguimiento({ pedido, onClose }: { pedido: Pedido | null, onClose: () => void }) {
  if (!pedido) return null;

  let titulo = 'Detalle del Pedido';
  let contenido = null;

  if (pedido.tipoEntrega === 'retiro en sucursal' && pedido.sucursal) {
    titulo = 'Detalles de la Sucursal';
    const datosSucursal = sucursales[pedido.sucursal];
    if (datosSucursal) {
      const urlOpenStreetMap = `https://www.openstreetmap.org/export/embed.html?bbox=${datosSucursal.lng - 0.01},${datosSucursal.lat - 0.005},${datosSucursal.lng + 0.01},${datosSucursal.lat + 0.005}&marker=${datosSucursal.lat},${datosSucursal.lng}&zoom=15`;
      contenido = (
        <>
          <p><strong>Sucursal:</strong> {pedido.sucursal}</p>
          <p><strong>Dirección:</strong> {datosSucursal.direccion}</p>
          <p><strong>Estado:</strong> <span className="badge bg-primary">{pedido.estado}</span></p>
          <iframe width="100%" height="300" frameBorder="0" style={{ border: 0 }} src={urlOpenStreetMap} allowFullScreen title="mapa-sucursal"></iframe>
        </>
      );
    } else {
      contenido = <><p><strong>Sucursal:</strong> {pedido.sucursal}</p><p>Dirección no disponible.</p></>;
    }
  } else if (pedido.tipoEntrega === 'domicilio') {
    titulo = 'Seguimiento del Pedido';
    const sucursalOrigen = encontrarSucursalMasCercana(pedido.direccion);
    const datosSucursalOrigen = sucursales[sucursalOrigen];
    let mapaHtml = <p className="text-center text-muted">El mapa de seguimiento estará disponible una vez que el pedido esté 'En camino'.</p>;

    if (pedido.estado === 'En camino' && datosSucursalOrigen) {
      const urlOpenStreetMap = `https://www.openstreetmap.org/export/embed.html?bbox=${datosSucursalOrigen.lng - 0.01},${datosSucursalOrigen.lat - 0.005},${datosSucursalOrigen.lng + 0.01},${datosSucursalOrigen.lat + 0.005}&marker=${datosSucursalOrigen.lat},${datosSucursalOrigen.lng}&zoom=15`;
      mapaHtml = (
        <>
          <p className="text-center">Ubicación estimada del repartidor:</p>
          <iframe width="100%" height="300" frameBorder="0" style={{ border: 0 }} src={urlOpenStreetMap} allowFullScreen title="mapa-seguimiento"></iframe>
        </>
      );
    }

    contenido = (
      <>
        <p>Tu pedido será enviado a: <strong>{pedido.direccion}</strong>.</p>
        <p><strong>Estado:</strong> <span className={`badge ${pedido.estado === 'Entregado' ? 'bg-success' : 'bg-info text-dark'}`}>{pedido.estado}</span></p>
        <p><strong>Origen:</strong> Sucursal {sucursalOrigen}</p>
        {mapaHtml}
      </>
    );
  }

  return (
    <Modal show={pedido !== null} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title id="tituloModalSeguimiento">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body id="cuerpoModalSeguimiento">
        {contenido}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Perfil() {
  const { usuarioActual } = useAuth();
  const [pedidoModal, setPedidoModal] = useState<Pedido | null>(null);

  if (!usuarioActual) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <>
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="card shadow-lg p-4">
              <h2 className="card-title text-center mb-4" style={{ color: 'var(--color-primario)' }}>Mi Perfil</h2>
              <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-star-fill"></i>
                <span id="puntos-fidelizacion">Puntos de fidelización: {usuarioActual.puntos || 0}</span>
              </div>

              <Tabs defaultActiveKey="perfil" id="pestanasPerfil" className="mb-3" justify>
                <Tab eventKey="perfil" title="Datos Personales">
                  <TabDatosPersonales />
                </Tab>
                <Tab eventKey="direccion" title="Dirección de Envío">
                  <TabDirecciones />
                </Tab>
                <Tab eventKey="historial" title="Historial de Compras">
                  <TabHistorial onAbrirModal={setPedidoModal} />
                </Tab>
              </Tabs>

            </div>
          </div>
        </div>
      </main>

      <ModalSeguimiento
        pedido={pedidoModal}
        onClose={() => setPedidoModal(null)}
      />
    </>
  );
}