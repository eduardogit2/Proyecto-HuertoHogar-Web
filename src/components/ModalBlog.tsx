import { useState, useEffect } from 'react';
import type { PublicacionBlog, ComentarioBlog } from '../types';
import { api } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface ModalBlogProps {
  publicacion: PublicacionBlog | null;
  onClose: () => void;
}

export default function ModalBlog({ publicacion, onClose }: ModalBlogProps) {
  const { usuarioActual } = useAuth();
  const { showNotification } = useNotification();
  const [comentarios, setComentarios] = useState<ComentarioBlog[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [cargandoComentarios, setCargandoComentarios] = useState(false);

  useEffect(() => {
    if (publicacion) {
      cargarComentarios(publicacion.id);
    }
  }, [publicacion]);

  const cargarComentarios = (id: number) => {
    setCargandoComentarios(true);
    api.getBlogComments(id)
      .then(setComentarios)
      .finally(() => setCargandoComentarios(false));
  };

  const handleSubmitComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || !publicacion || !usuarioActual) return;

    const comentario: ComentarioBlog = {
      usuario: usuarioActual.nombre,
      texto: nuevoComentario
    };

    api.addBlogComment(publicacion.id, comentario).then(comentarioGuardado => {
      setComentarios(prev => [...prev, comentarioGuardado]);
      setNuevoComentario("");
      showNotification('Comentario publicado', 'success');
    });
  };

  const handleOnExited = () => {
    setNuevoComentario("");
    setComentarios([]);
  };

  if (!publicacion) return null;

  return (
    <Modal show={publicacion !== null} onHide={onClose} onExited={handleOnExited} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="tituloModalPublicacion">{publicacion.titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img id="imagenModalPublicacion" src={publicacion.imagen} className="img-fluid mb-3 w-100" alt={publicacion.titulo} />
        <p id="fechaModalPublicacion" className="text-muted small">
          {publicacion.fecha} | Categoría: {publicacion.categoria}
        </p>
        <div id="contenidoModalPublicacion" dangerouslySetInnerHTML={{ __html: publicacion.contenido }} />
        <hr />

        <h5>Comentarios</h5>
        <div id="contenedorComentarios">
          {cargandoComentarios ? (
            <p>Cargando comentarios...</p>
          ) : comentarios.length === 0 ? (
            <p className="text-muted fst-italic text-center">Sé el primero en comentar.</p>
          ) : (
            comentarios.map((comentario, index) => (
              <div key={index} className="card tarjeta-cuerpo mb-2 p-2">
                <strong>{comentario.usuario}</strong>
                <p className="mb-0">{comentario.texto}</p>
              </div>
            ))
          )}
        </div>

        {!usuarioActual ? (
          <div id="mensajeSeccionComentario" className="text-muted text-center my-3">
            <p>Para dejar un comentario, <Link to="/ingreso" onClick={onClose}>inicia sesión aquí</Link>.</p>
          </div>
        ) : (
          <div id="seccionFormularioComentario">
            <h6 className="mt-4">Agrega un comentario</h6>
            <form id="formularioComentario" onSubmit={handleSubmitComentario}>
              <div className="mb-3">
                <textarea
                  id="texto-comentario"
                  className="form-control"
                  rows={3}
                  placeholder="Escribe tu comentario..."
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primario">Publicar</button>
              </div>
            </form>
          </div>
        )}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}