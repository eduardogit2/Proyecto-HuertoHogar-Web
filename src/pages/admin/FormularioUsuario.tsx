import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/mockApi';
import type { Usuario } from '../../types';
import { validarRut, validarCorreo } from '../../utils/validation';
import { useNotification } from '../../context/NotificationContext';

const usuarioVacio: Omit<Usuario, 'id'> = {
  rut: '',
  nombre: '',
  apellidos: '',
  correo: '',
  contrasena: '',
  esAdmin: false,
  esVendedor: false,
  direcciones: [],
  historial: [],
  puntos: 0
};

export default function FormularioUsuario() {
  const { correo } = useParams<{ correo: string }>();
  const navigate = useNavigate();
  const esModoEdicion = Boolean(correo);
  const { showNotification } = useNotification();

  const [usuario, setUsuario] = useState(usuarioVacio);
  const [cargando, setCargando] = useState(true);

  const [regiones, setRegiones] = useState<Record<string, string[]>>({});
  const [comunas, setComunas] = useState<string[]>([]);

  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');


  useEffect(() => {
    setCargando(true);
    api.getRegionesYComunas().then(setRegiones);

    if (esModoEdicion && correo) {
      api.getUsuarioByCorreo(correo).then(u => {
        if (u) {
          setUsuario(u);
          if (u.region) {
            setRegionSeleccionada(u.region);
          }
          if (u.comuna) {
            setComunaSeleccionada(u.comuna);
          }
        }
        setCargando(false);
      });
    } else {
      setUsuario(usuarioVacio);
      setCargando(false);
    }
  }, [correo, esModoEdicion]);

  useEffect(() => {
    if (regionSeleccionada && regiones[regionSeleccionada]) {
      setComunas(regiones[regionSeleccionada]);
      if (!esModoEdicion) {
        setComunaSeleccionada('');
      }
    } else {
      setComunas([]);
    }
  }, [regionSeleccionada, regiones, esModoEdicion]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setUsuario(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === 'rol') {
      setUsuario(prev => ({
        ...prev,
        esAdmin: value === 'administrador',
        esVendedor: value === 'vendedor'
      }));
      return;
    }

    setUsuario(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'region') {
      setRegionSeleccionada(value);
      setComunaSeleccionada('');
      setUsuario(prev => ({ ...prev, comuna: '' }));
    }
    if (name === 'comuna') {
      setComunaSeleccionada(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarRut(usuario.rut)) {
      showNotification('El RUN ingresado no es válido.', 'error');
      return;
    }
    if (!esModoEdicion && !validarCorreo(usuario.correo)) {
      showNotification('Correo inválido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com.', 'error');
      return;
    }
    if (!esModoEdicion && usuario.contrasena.length < 4) {
      showNotification('La contraseña debe tener al menos 4 caracteres.', 'error');
      return;
    }
    if (esModoEdicion && usuario.contrasena && usuario.contrasena.length > 0 && usuario.contrasena.length < 4) {
      showNotification('La nueva contraseña debe tener al menos 4 caracteres.', 'error');
      return;
    }
    if (usuario.nombre.length === 0 || !usuario.apellidos || usuario.apellidos.length === 0) {
      showNotification('Nombre y Apellidos son requeridos.', 'error');
      return;
    }

    const usuarioFinal: Usuario = {
      ...usuario,
      region: regionSeleccionada,
      comuna: comunaSeleccionada,
    };

    const promesa = esModoEdicion
      ? api.updateUsuarioAdmin(correo!, usuarioFinal)
      : api.createUsuario({ ...usuarioFinal, id: Date.now() });

    promesa
      .then(() => {
        showNotification(esModoEdicion ? '¡Usuario editado!' : '¡Usuario creado!', 'success');
        navigate('/admin/usuarios');
      })
      .catch(err => {
        console.error(err);
        showNotification((err as Error).message, 'error');
      });
  };

  if (cargando) {
    return <p>Cargando formulario...</p>;
  }

  const getRol = () => {
    if (usuario.esAdmin) return 'administrador';
    if (usuario.esVendedor) return 'vendedor';
    return 'cliente';
  }

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 texto-secundario">
          {esModoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h1>
        <Link to="/admin/usuarios" className="btn btn-secundario">
          <i className="bi bi-arrow-left me-1"></i> Volver a la lista
        </Link>
      </header>

      <div className="card p-4 shadow-sm">
        <form id="formularioCrearUsuario" onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="rut" className="form-label">RUN</label>
            <input type="text" className="form-control" id="rut" name="rut" value={usuario.rut} onChange={handleChange} required />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" className="form-control" id="nombre" name="nombre" value={usuario.nombre} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input type="text" className="form-control" id="apellidos" name="apellidos" value={usuario.apellidos || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="correo" className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              id="correo"
              name="correo"
              value={usuario.correo}
              onChange={handleChange}
              required
              readOnly={esModoEdicion}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="contrasena"
              name="contrasena"
              onChange={handleChange}
              placeholder={esModoEdicion ? "Dejar en blanco para no cambiar" : "Mínimo 4 caracteres"}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="rol" className="form-label">Tipo de Usuario</label>
            <select className="form-select" id="rol" name="rol" value={getRol()} onChange={handleChange} required>
              <option value="cliente">Cliente</option>
              <option value="vendedor">Vendedor</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <hr />
          <h5 className="texto-secundario">Datos Adicionales (Opcional)</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="region" className="form-label">Región</label>
              <select
                className="form-select"
                id="region"
                name="region"
                value={regionSeleccionada}
                onChange={handleChange}
              >
                <option value="">Selecciona una región</option>
                {Object.keys(regiones).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="comuna" className="form-label">Comuna</label>
              <select
                className="form-select"
                id="comuna"
                name="comuna"
                value={comunaSeleccionada}
                onChange={handleChange}
                disabled={comunas.length === 0}
              >
                <option value="">Selecciona una comuna</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Link to="/admin/usuarios" className="btn btn-secondary me-2">Cancelar</Link>
            <button type="submit" className="btn btn-primario">
              {esModoEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}