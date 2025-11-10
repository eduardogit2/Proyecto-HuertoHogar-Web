import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/mockApi';
import type { PublicacionBlog } from '../../types';
import { useNotification } from '../../context/NotificationContext';

const postVacio: Omit<PublicacionBlog, 'id' | 'fecha'> = {
  titulo: '',
  categoria: '',
  imagen: 'img/default-blog.jpg',
  contenido: '<p>Escribe tu contenido aquí...</p>'
};

export default function FormularioBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esModoEdicion = Boolean(id);
  const { showNotification } = useNotification();

  const [post, setPost] = useState(postVacio);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (esModoEdicion && id) {
      setCargando(true);
      api.getBlogPostById(Number(id)).then(p => {
        if (p) {
          setPost(p);
        }
        setCargando(false);
      });
    } else {
      setPost(postVacio);
      setCargando(false);
    }
  }, [id, esModoEdicion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!post.titulo || !post.categoria || !post.contenido) {
      showNotification("Por favor, completa todos los campos.", 'error');
      return;
    }

    const promesa = esModoEdicion
      ? api.updateBlogPost(post as PublicacionBlog)
      : api.createBlogPost({ ...post, fecha: new Date().toISOString().slice(0, 10) });

    promesa
      .then(() => {
        showNotification(esModoEdicion ? '¡Publicación editada!' : '¡Publicación creada!', 'success');
        navigate('/admin/blog');
      })
      .catch(err => {
        console.error(err);
        showNotification('Error al guardar la publicación.', 'error');
      });
  };

  if (cargando) {
    return <p>Cargando formulario...</p>;
  }

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 texto-secundario">
          {esModoEdicion ? `Editando Publicación` : 'Nueva Publicación'}
        </h1>
        <Link to="/admin/blog" className="btn btn-secundario">
          <i className="bi bi-arrow-left me-1"></i> Volver a la lista
        </Link>
      </header>

      <form id="formularioPublicacionBlog" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-9">
            <div className="card shadow-sm p-4">
              <div className="mb-3">
                <label htmlFor="titulo" className="form-label fs-5">Título de la Publicación</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="titulo"
                  name="titulo"
                  value={post.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="contenido" className="form-label">Contenido (HTML permitido)</label>
                <textarea
                  className="form-control"
                  id="contenido"
                  name="contenido"
                  rows={20}
                  value={post.contenido}
                  onChange={handleChange}
                  placeholder="Usa etiquetas como <p>, <ul>, <li>, <h3>, etc."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="card shadow-sm p-4">
              <h5 className="mb-3">Detalles</h5>
              <div className="mb-3">
                <label htmlFor="categoria" className="form-label">Categoría</label>
                <input
                  type="text"
                  className="form-control"
                  id="categoria"
                  name="categoria"
                  value={post.categoria}
                  onChange={handleChange}
                  placeholder="Ej: Sostenibilidad"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="imagen" className="form-label">URL de la Imagen</label>
                <input
                  type="text"
                  className="form-control"
                  id="imagen"
                  name="imagen"
                  value={post.imagen}
                  onChange={handleChange}
                  placeholder="Ej: img/nombre.jpg"
                  required
                />
                {post.imagen && (
                  <img src={post.imagen} alt="Vista previa" className="img-fluid rounded mt-2" />
                )}
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primario">
                  {esModoEdicion ? 'Guardar Cambios' : 'Publicar'}
                </button>
                <Link to="/admin/blog" className="btn btn-outline-secondary">Cancelar</Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}