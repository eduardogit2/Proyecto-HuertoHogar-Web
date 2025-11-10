import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/mockApi';
import type { PublicacionBlog } from '../../types';
import { useNotification } from '../../context/NotificationContext';

export default function AdminBlog() {
  const [publicaciones, setPublicaciones] = useState<PublicacionBlog[]>([]);
  const [cargando, setCargando] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = () => {
    setCargando(true);
    api.getBlogPosts()
      .then(data => {
        setPublicaciones(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar publicaciones:", err);
        setCargando(false);
      });
  };

  const handleEliminar = (id: number) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la publicación con ID: ${id}?`)) {
      api.deleteBlogPost(id)
        .then(() => {
          showNotification('Publicación eliminada.', 'success');
          cargarPublicaciones();
        })
        .catch(err => {
          console.error("Error al eliminar publicación:", err);
          showNotification('Error al eliminar la publicación.', 'error');
        });
    }
  };

  if (cargando) {
    return <p>Cargando publicaciones...</p>;
  }

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 texto-secundario">Gestión de Blog</h1>
        <Link to="/admin/blog/nuevo" id="botonCrearPublicacion" className="btn btn-primario">
          <i className="bi bi-plus-circle-fill me-2"></i>Crear Nueva Publicación
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="cuerpoTablaBlog">
                {publicaciones.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">No hay publicaciones para mostrar.</td>
                  </tr>
                ) : (
                  publicaciones.map(pub => (
                    <tr key={pub.id}>
                      <td>{pub.id}</td>
                      <td>{pub.titulo}</td>
                      <td><span className="badge bg-success">{pub.categoria}</span></td>
                      <td>{pub.fecha}</td>
                      <td>
                        <Link to={`/admin/blog/editar/${pub.id}`} className="btn btn-sm btn-warning me-2">
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(pub.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}