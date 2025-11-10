import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/mockApi';
import type { Producto } from '../types';
import TarjetaProducto from '../components/TarjetaProducto';
import ModalDetalleProducto from '../components/ModalDetalleProducto';

const descripcionesCategorias: Record<string, string> = {
  'Todos': 'Explora nuestra amplia selección de productos frescos y de alta calidad para tu hogar. HuertoHogar te ofrece una experiencia de compra única, con productos directamente del campo y de proveedores locales, garantizando sabor, frescura y la mejor calidad en cada compra.',
  'Frutas': 'Deliciosas y jugosas frutas de temporada, directamente del huerto a tu mesa...',
  'Verduras': 'Las verduras más frescas y nutritivas para una alimentación sana y equilibrada...',
  'Lácteos': 'Productos lácteos cremosos y frescos, perfectos para tu desayuno y recetas...',
  'Orgánicos': 'Productos cultivados de forma natural, para una opción más saludable y sostenible...'
};

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActual, setCategoriaActual] = useState("Todos");
  const [precioMaximo, setPrecioMaximo] = useState(10000);
  const [consultaBusqueda, setConsultaBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const cargarProductos = () => {
    setCargando(true);
    api.getProductos()
      .then(setProductos)
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleResenaAgregada = (productoActualizado: Producto) => {
    setProductos(prevProductos =>
      prevProductos.map(p =>
        p.id === productoActualizado.id ? productoActualizado : p
      )
    );
    setProductoSeleccionado(productoActualizado);
  };

  const categoriasUnicas = useMemo(() => {
    return ['Todos', ...new Set(productos.map(p => p.categoria))];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const consulta = consultaBusqueda.trim().toLowerCase();
    return productos.filter(p => {
      const categoriaOK = (categoriaActual === 'Todos') || (p.categoria === categoriaActual);
      const precioOK = p.precio <= precioMaximo;
      const consultaOK = p.nombre.toLowerCase().includes(consulta) || p.descripcion.toLowerCase().includes(consulta);
      return categoriaOK && precioOK && consultaOK;
    });
  }, [productos, categoriaActual, precioMaximo, consultaBusqueda]);

  return (
    <>
      <main className="container my-5">
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
                <hr />
                <h6 style={{ color: 'var(--color-primario)' }}>Filtrar por</h6>
                <div className="mb-3">
                  <label htmlFor="rangoPrecio" className="form-label small">Precio hasta ${precioMaximo.toLocaleString('es-CL')}</label>
                  <input
                    id="rangoPrecio"
                    type="range"
                    className="form-range"
                    min="0" max="10000" step="500"
                    value={precioMaximo}
                    onChange={(e) => setPrecioMaximo(Number(e.target.value))}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="campoBusqueda" className="form-label small">Buscar</label>
                  <input
                    id="campoBusqueda"
                    className="form-control form-control-sm"
                    type="search"
                    placeholder="Buscar productos..."
                    value={consultaBusqueda}
                    onChange={(e) => setConsultaBusqueda(e.target.value)}
                  />
                </div>
                <button
                  id="limpiarFiltros"
                  className="btn btn-sm btn-outline-secondary w-100 mt-2"
                  onClick={() => {
                    setCategoriaActual("Todos");
                    setPrecioMaximo(10000);
                    setConsultaBusqueda("");
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </aside>

          <section id="catalogo" className="col-lg-9">
            <div id="descripcionCategoria" className="alert alert-info descripcion-categoria">
              {descripcionesCategorias[categoriaActual] || 'Explora nuestros productos.'}
            </div>

            <div className="row" id="contenedorProductos">
              {cargando && <p>Cargando productos...</p>}
              {!cargando && productosFiltrados.length === 0 && (
                <div id="sinResultados" className="text-center text-muted mt-4">
                  No se encontraron productos.
                </div>
              )}
              {!cargando && productosFiltrados.map(p => (
                <TarjetaProducto
                  key={p.id}
                  producto={p}
                  onProductoClick={setProductoSeleccionado}
                />
              ))}
            </div>
          </section>

        </div>
      </main>

      <ModalDetalleProducto
        producto={productoSeleccionado}
        onClose={() => setProductoSeleccionado(null)}
        onResenaAgregada={handleResenaAgregada}
      />
    </>
  );
}