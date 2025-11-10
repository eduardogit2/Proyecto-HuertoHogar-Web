import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/mockApi';
import type { Usuario } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const { usuarioActual } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    setCargando(true);
    api.getUsuarios()
      .then(data => {
        setUsuarios(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar usuarios:", err);
        setCargando(false);
      });
  };

  const handleEliminar = (correo: string) => {
    if (correo === usuarioActual?.correo) {
      showNotification('No puedes eliminarte a ti mismo.', 'error');
      return;
    }
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario con correo: ${correo}?`)) {
      api.deleteUsuario(correo)
        .then(() => {
          showNotification('Usuario eliminado.', 'success');
          cargarUsuarios();
        })
        .catch(err => {
          console.error("Error al eliminar usuario:", err);
          showNotification((err as Error).message, 'error');
        });
    }
  };

  if (cargando) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 texto-secundario">Gestión de Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primario">
          <i className="bi bi-person-plus-fill me-2"></i> Nuevo Usuario
        </Link>
      </header>

      <div className="table-responsive">
        <table className="table table-hover shadow-sm">
          <thead className="bg-light">
            <tr>
              <th>RUN</th>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="cuerpoTablaUsuarios">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">No hay usuarios registrados.</td>
              </tr>
            ) : (
              usuarios.map(usuario => {
                const rolUsuario = usuario.esAdmin ? 'Administrador' : (usuario.esVendedor ? 'Vendedor' : 'Cliente');
                return (
                  <tr key={usuario.correo}>
                    <td>{usuario.rut || 'N/A'}</td>
                    <td>{usuario.nombre} {usuario.apellidos || ''}</td>
                    <td>{usuario.correo}</td>
                    <td>{rolUsuario}</td>
                    <td>
                      <Link to={`/admin/usuarios/editar/${usuario.correo}`} className="btn btn-sm btn-warning me-2">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleEliminar(usuario.correo)}
                        disabled={usuario.correo === 'admin@huertohogar.cl'}
                      >
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