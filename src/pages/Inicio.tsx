import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/mockApi';
import type { Producto } from '../types';
import TarjetaProducto from '../components/TarjetaProducto';
import ModalDetalleProducto from '../components/ModalDetalleProducto';

export default function Inicio() {
  const [productosDestacados, setProductosDestacados] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  useEffect(() => {
    setCargando(true);
    api.getProductos()
      .then(todosLosProductos => {
        const destacados = todosLosProductos
          .filter(p => p.etiqueta === 'Oferta')
          .slice(0, 3);
        setProductosDestacados(destacados);
      })
      .catch(err => console.error("Error al cargar productos destacados:", err))
      .finally(() => setCargando(false));
  }, []);

  const handleAbrirModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
  };

  const handleCerrarModal = () => {
    setProductoSeleccionado(null);
  };

  const handleResenaAgregada = (productoActualizado: Producto) => {
    setProductosDestacados(prevDestacados =>
      prevDestacados.map(p =>
        p.id === productoActualizado.id ? productoActualizado : p
      )
    );
    setProductoSeleccionado(productoActualizado);
  };

  return (
    <>
      <header className="portada">
        <div className="superposicion-portada">
          <div className="container contenido-portada text-center">
            <h1 className="fw-bold">Productos frescos directo a tu hogar</h1>
            <h2 className="lead">Frutas, verduras y productos orgánicos seleccionados por productores locales.</h2>
            <Link to="/productos" className="btn btn-lg btn-primario">Ver catálogo</Link>
          </div>
        </div>
      </header>

      <main className="container my-5">

        <section className="text-center mb-5">
          <h2 className="fw-bold mb-3">Nuestra Esencia</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            En HuertoHogar, somos más que una tienda de alimentos. Somos una comunidad dedicada a la sostenibilidad,
            la calidad y el sabor auténtico de la naturaleza. Trabajamos de la mano con agricultores locales para
            llevar lo mejor de la tierra directamente a tu mesa.
          </p>
          <Link to="/nosotros" className="btn btn-outline-primario mt-3">Conoce Nuestra Historia</Link>
        </section>

        <section className="seccion-alternativa py-5 mb-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-4">Productos Destacados</h2>
            <div className="row g-4" id="contenedorProductos">
              {cargando && <p className="text-center">Cargando ofertas...</p>}
              {!cargando && productosDestacados.length === 0 && (
                <p className="text-center text-muted">No hay ofertas destacadas por el momento.</p>
              )}
              {!cargando && productosDestacados.map(producto => (
                <TarjetaProducto
                  key={producto.id}
                  producto={producto}
                  onProductoClick={handleAbrirModal}
                />
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/productos" className="btn btn-outline-primario mt-3">Ver Todos los Productos</Link>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="fw-bold mb-3">Últimas Novedades del Blog</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Mantente al día con nuestros artículos sobre alimentación saludable, consejos de jardinería y recetas
            deliciosas.
          </p>
          <Link to="/blog" className="btn btn-outline-primario mt-3">Ir al Blog</Link>
        </section>
      </main>

      <ModalDetalleProducto
        producto={productoSeleccionado}
        onClose={handleCerrarModal}
        onResenaAgregada={handleResenaAgregada}
      />
    </>
  );
}