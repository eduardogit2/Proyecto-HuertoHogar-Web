import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/mockApi';
import type { Producto } from '../../types';
import { formatearPrecio } from '../../utils/format';
import { useNotification } from '../../context/NotificationContext';

const productoVacio: Partial<Producto> = {
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
  stockCritico: null,
  categoria: '',
  origen: '',
  unidad: '',
  etiqueta: 'Normal',
  imagen: 'img/default.jpg'
};

export default function FormularioProducto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esModoEdicion = Boolean(id);
  const { showNotification } = useNotification();

  const [producto, setProducto] = useState<Partial<Producto>>(productoVacio);
  const [descuento, setDescuento] = useState(0);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    api.getCategoriasUnicas().then(setCategorias);

    if (esModoEdicion && id) {
      api.getProductoById(Number(id)).then(p => {
        if (p) {
          const desc = p.precioConDescuento !== undefined
            ? Math.round(((p.precio - p.precioConDescuento) / p.precio) * 100)
            : 0;

          setProducto(p);
          setDescuento(desc);
        }
        setCargando(false);
      });
    } else {
      setProducto(productoVacio);
      setDescuento(0);
      setCargando(false);
    }
  }, [id, esModoEdicion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    const valor = (type === 'number' && name !== 'stockCritico')
      ? Number(value)
      : (name === 'stockCritico' && value === '')
        ? null
        : value;

    setProducto(prev => ({
      ...prev,
      [name]: valor
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!producto.nombre || producto.nombre.length < 3) {
      showNotification("El nombre es requerido.", 'error');
      return;
    }
    if (!producto.categoria) {
      showNotification("La categoría es requerida.", 'error');
      return;
    }

    const precioNum = Number(producto.precio) || 0;
    const precioConDescuento = descuento > 0 ? precioNum * (1 - descuento / 100) : undefined;
    const etiqueta = descuento > 0 ? 'Oferta' : 'Normal';

    const productoBase = {
      ...productoVacio,
      ...producto,
    };

    const productoFinal: Producto = {
      id: esModoEdicion ? producto.id! : Date.now(),
      nombre: productoBase.nombre!,
      descripcion: productoBase.descripcion!,
      categoria: productoBase.categoria!,
      origen: productoBase.origen!,
      unidad: productoBase.unidad!,
      imagen: productoBase.imagen || 'img/default.jpg',
      resenas: esModoEdicion ? (producto.resenas || []) : [],

      precio: precioNum,
      stock: Number(producto.stock) || 0,
      stockCritico: producto.stockCritico ? Number(producto.stockCritico) : null,
      precioConDescuento: precioConDescuento,
      etiqueta: etiqueta,
    };

    const promesa = esModoEdicion
      ? api.updateProducto(productoFinal)
      : api.createProducto(productoFinal);

    promesa
      .then(() => {
        showNotification(esModoEdicion ? '¡Producto editado!' : '¡Producto creado!', 'success');
        navigate('/admin/productos');
      })
      .catch(err => {
        console.error(err);
        showNotification('Error al guardar el producto.', 'error');
      });
  };

  if (cargando) {
    return <p>Cargando formulario...</p>;
  }

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 texto-secundario">
          {esModoEdicion ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h1>
        <Link to="/admin/productos" className="btn btn-secundario">
          <i className="bi bi-arrow-left me-1"></i> Volver a la lista
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body">
          <form id="formularioCrearProducto" onSubmit={handleSubmit} noValidate>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="id" className="form-label">Código (ID)</label>
                <input
                  type="number"
                  className="form-control"
                  id="id"
                  name="id"
                  value={producto.id || ''}
                  onChange={handleChange}
                  placeholder={esModoEdicion ? '' : 'Dejar vacío para auto-generar'}
                  disabled={esModoEdicion}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" className="form-control" id="nombre" name="nombre" value={producto.nombre} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <textarea className="form-control" id="descripcion" name="descripcion" rows={3} value={producto.descripcion} onChange={handleChange}></textarea>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="precio" className="form-label">Precio</label>
                <input type="number" className="form-control" id="precio" name="precio" value={producto.precio} onChange={handleChange} required min="0" />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="descuento" className="form-label">Descuento (%)</label>
                <input type="number" className="form-control" id="descuento" name="descuento" value={descuento} onChange={(e) => setDescuento(Number(e.target.value))} min="0" max="100" />
              </div>
              <div className="col-md-4 mb-3">
                <label>Precio Final</label>
                <input
                  type="text"
                  className="form-control"
                  value={formatearPrecio(descuento > 0 ? (producto.precio || 0) * (1 - descuento / 100) : (producto.precio || 0))}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="stock" className="form-label">Stock</label>
                <input type="number" className="form-control" id="stock" name="stock" value={producto.stock} onChange={handleChange} required min="0" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="stockCritico" className="form-label">Stock Crítico (Opcional)</label>
                <input type="number" className="form-control" id="stockCritico" name="stockCritico" value={producto.stockCritico || ''} onChange={handleChange} min="0" />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="categoria" className="form-label">Categoría</label>
                <select className="form-select" id="categoria" name="categoria" value={producto.categoria} onChange={handleChange} required>
                  <option value="" disabled>Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <small>¿Categoría nueva? Escríbela en el campo de al lado.</small>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="categoriaNueva" className="form-label">O escribe una nueva categoría</label>
                <input
                  type="text"
                  className="form-control"
                  id="categoriaNueva"
                  placeholder="Ej: Congelados"
                  onChange={(e) => setProducto(prev => ({ ...prev, categoria: e.target.value }))}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="origen" className="form-label">Origen</label>
                <input type="text" className="form-control" id="origen" name="origen" value={producto.origen} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="unidad" className="form-label">Unidad</label>
                <input type="text" className="form-control" id="unidad" name="unidad" value={producto.unidad} onChange={handleChange} required placeholder="Ej: kg, bolsa, frasco" />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="imagen" className="form-label">Ruta de Imagen</label>
              <input type="text" className="form-control" id="imagen" name="imagen" value={producto.imagen} onChange={handleChange} placeholder="Ej: img/prod1.jpg" />
              <small className="text-muted">Asegúrate que la imagen exista en la carpeta `/public/img/`.</small>
            </div>

            <div className="d-flex justify-content-end">
              <Link to="/admin/productos" className="btn btn-secondary me-2">Cancelar</Link>
              <button type="submit" className="btn btn-primario">
                {esModoEdicion ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}