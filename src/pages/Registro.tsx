import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { validarRut, validarCorreo, autoFormatRut } from '../utils/validation';
import { api } from '../services/mockApi';

export default function Registro() {
  const { register } = useAuth();
  const { showNotification } = useNotification();

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [contrasena2, setContrasena2] = useState('');

  const [regiones, setRegiones] = useState<Record<string, string[]>>({});
  const [comunas, setComunas] = useState<string[]>([]);
  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');

  useEffect(() => {
    api.getRegionesYComunas().then(setRegiones);
  }, []);

  useEffect(() => {
    if (regionSeleccionada && regiones[regionSeleccionada]) {
      setComunas(regiones[regionSeleccionada]);
      setComunaSeleccionada('');
    } else {
      setComunas([]);
    }
  }, [regionSeleccionada, regiones]);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorLimpio = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
    setRut(valorLimpio);
  };

  const handleRutBlur = () => {
    if (rut) {
      setRut(autoFormatRut(rut));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarRut(rut)) {
      showNotification('El RUT ingresado no es válido.', 'error');
      return;
    }
    if (contrasena.length < 4 || contrasena.length > 10) {
      showNotification('La contraseña debe tener entre 4 y 10 caracteres.', 'error');
      return;
    }
    if (contrasena !== contrasena2) {
      showNotification('Las contraseñas no coinciden.', 'error');
      return;
    }
    if (!validarCorreo(correo)) {
      showNotification('El correo debe ser de los dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.', 'error');
      return;
    }
    if (!regionSeleccionada || !comunaSeleccionada) {
      showNotification('Debes seleccionar tu región y comuna.', 'error');
      return;
    }

    try {
      await register({
        nombre,
        apellidos,
        rut: autoFormatRut(rut),
        correo,
        contrasena,
        region: regionSeleccionada,
        comuna: comunaSeleccionada
      });
    } catch (error) {
      showNotification((error as Error).message, 'error');
      console.error(error);
    }
  };

  return (
    <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', padding: '2rem 0' }}>
      <div className="card shadow-sm p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Crear cuenta</h2>
        <form id="formularioRegistro" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                placeholder="Ej: Juan"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="apellidos" className="form-label">Apellidos (Opcional)</label>
              <input
                type="text"
                className="form-control"
                id="apellidos"
                name="apellidos"
                placeholder="Ej: Pérez"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="rut" className="form-label">RUT</label>
            <input
              type="text"
              className="form-control"
              id="rut"
              name="rut"
              placeholder="Ej: 12345678-9"
              required
              value={rut}
              onChange={handleRutChange}
              onBlur={handleRutBlur}
              maxLength={12}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              id="correo"
              name="correo"
              placeholder="ejemplo@correo.com"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
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

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="contrasena" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="contrasena"
                name="contrasena"
                placeholder="Entre 4 y 10 caracteres"
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="contrasena2" className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-control"
                id="contrasena2"
                name="contrasena2"
                placeholder="Repite la contraseña"
                required
                value={contrasena2}
                onChange={(e) => setContrasena2(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primario w-100">Registrarse</button>
        </form>
        <p className="text-center mt-3">
          ¿Ya tienes cuenta? <Link to="/ingreso">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}