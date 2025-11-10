import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/mockApi';
import type { PublicacionBlog } from '../types';
import ModalBlog from '../components/ModalBlog';

const descripcionesCategorias: Record<string, string> = {
  "Todos": "Explora todos los artículos de nuestro blog, desde recetas saludables hasta consejos de sostenibilidad, pensados para ti y para el planeta.",
  "Sostenibilidad": "Artículos sobre prácticas ecológicas, cuidado del medio ambiente y cómo puedes reducir tu huella de carbono, un pequeño paso a la vez.",
  "Recetas": "Inspírate con recetas frescas y nutritivas que puedes preparar con nuestros productos. ¡Comidas deliciosas que te harán sentir bien!",
  "Comunidad": "Conoce de cerca cómo trabajamos con pequeños productores locales y las iniciativas que apoyamos para fortalecer nuestra comunidad."
};

export default function Blog() {
  const [publicaciones, setPublicaciones] = useState<PublicacionBlog[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActual, setCategoriaActual] = useState("Todos");
  const [postSeleccionado, setPostSeleccionado] = useState<PublicacionBlog | null>(null);

  useEffect(() => {
    setCargando(true);
    api.getBlogPosts()
      .then(setPublicaciones)
      .finally(() => setCargando(false));
  }, []);

  const categoriasUnicas = useMemo(() => {
    return ['Todos', ...new Set(publicaciones.map(p => p.categoria))];
  }, [publicaciones]);

  const publicacionesFiltradas = useMemo(() => {
    if (categoriaActual === "Todos") {
      return publicaciones;
    }
    return publicaciones.filter(pub => pub.categoria === categoriaActual);
  }, [publicaciones, categoriaActual]);

  const getResumen = (contenidoHtml: string) => {
    const div = document.createElement('div');
    div.innerHTML = contenidoHtml;
    return (div.textContent || "").substring(0, 150).trim() + '...';
  };

  if (cargando) {
    return <div className="container my-5"><p>Cargando publicaciones...</p></div>
  }

  return (
    <>
      <main className="container my-5">
        <h1 className="text-center">Blog de HuertoHogar</h1>
        <p className="lead text-center mb-5">Conoce nuestras últimas noticias, recetas y compromisos con el medio ambiente.</p>
        <div className="row">
          <aside className="col-lg-3 mb-4">
            <div className="card shadow-sm barra-lateral-fija">
              <div className="card-body">
                <h5 className="card-title">Categorías</h5>
                <ul id="listaCategorias" className="list-group list-group-flush" style={{ cursor: 'pointer' }}>
                  {categoriasUnicas.map(cat => (
                    <li
                      key={cat}
                      className={`list-group-item list-group-item-action ${cat === categoriaActual ? 'active' : ''}`}
                      onClick={() => setCategoriaActual(cat)}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <section className="col-lg-9">
            <div id="descripcionCategoria" className="alert alert-info descripcion-categoria">
              {descripcionesCategorias[categoriaActual] || ''}
            </div>

            <div id="contenedorBlog" className="row">
              {publicacionesFiltradas.length === 0 ? (
                <p className="text-muted">No hay publicaciones en esta categoría.</p>
              ) : (
                publicacionesFiltradas.map(pub => (
                  <div key={pub.id} className="col-md-6 mb-4 d-flex">
                    <div className="card h-100 shadow-sm tarjeta-blog">
                      <img src={pub.imagen} className="tarjeta-imagen-superior imagen-blog" alt={pub.titulo} />
                      <div className="card-body tarjeta-cuerpo">
                        <div className="contenedor-texto-tarjeta">
                          <h5 className="card-title">{pub.titulo}</h5>
                          <p className="card-text text-muted small">{pub.fecha} | Categoría: {pub.categoria}</p>
                          <p className="resumen-contenido-blog">{getResumen(pub.contenido)}</p>
                        </div>
                        <button
                          className="btn btn-primario mt-3"
                          onClick={() => setPostSeleccionado(pub)}
                        >
                          Leer más
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <ModalBlog
        publicacion={postSeleccionado}
        onClose={() => setPostSeleccionado(null)}
      />
    </>
  );
}