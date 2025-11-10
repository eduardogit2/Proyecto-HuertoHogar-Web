import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { validarCorreo } from '../utils/validation';

export default function Ingreso() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (contrasena.length < 4 || contrasena.length > 10) {
      showNotification('La contraseña debe tener entre 4 y 10 caracteres.', 'error');
      return;
    }

    if (correo !== 'admin@huertohogar.cl' && !validarCorreo(correo)) {
      showNotification('El correo debe ser de los dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.', 'error');
      return;
    }
    await login(correo, contrasena);
  };

  return (
    <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <form id="formularioIngreso" onSubmit={handleSubmit} autoComplete="off">
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
          <div className="mb-3">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="contrasena"
              name="contrasena"
              placeholder="Ingresa tu contraseña"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primario w-100">Iniciar sesión</button>
        </form>
        <p className="text-center mt-3">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </main>
  );
}