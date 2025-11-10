import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/mockApi';
import { formatearPrecio } from '../utils/format';
import type { Pedido } from '../types';
import ModalBoleta from '../components/ModalBoleta';

const sucursales = [
  'Santiago Centro', 'Santiago Oriente', 'Santiago Poniente',
  'Concepción', 'Viña del Mar', 'Puerto Montt',
  'Villarrica', 'Nacimiento', 'Valparaíso'
];

export default function Compra() {
  const { usuarioActual } = useAuth();
  const { carrito, totalCarrito, limpiarCarrito } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [metodoEntrega, setMetodoEntrega] = useState<'sucursal' | 'domicilio' | ''>('');
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');
  const [opcionDireccion, setOpcionDireccion] = useState('nueva');
  const [calle, setCalle] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [region, setRegion] = useState('');
  const [guardarDireccion, setGuardarDireccion] = useState(true);
  const [usarPuntos, setUsarPuntos] = useState(false);
  const [boleta, setBoleta] = useState<Pedido | null>(null);

  const puntosUsuario = usuarioActual?.puntos || 0;

  const totalFinal = useMemo(() => {
    let total = totalCarrito;
    if (usarPuntos) {
      total = Math.max(0, total - puntosUsuario);
    }
    return total;
  }, [totalCarrito, usarPuntos, puntosUsuario]);

  const handleFinalizarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioActual) {
      showNotification("Error: No se encontró usuario.", 'error');
      navigate('/ingreso');
      return;
    }

    let detallesEntrega: { tipoEntrega: 'domicilio' | 'retiro en sucursal', direccion?: string, sucursal?: string } | null = null;
    let nuevaDireccionAGuardar: { calle: string, ciudad: string, region: string } | undefined = undefined;

    if (!metodoEntrega) {
      showNotification('Por favor, selecciona un método de entrega.', 'error');
      return;
    }

    if (metodoEntrega === 'sucursal') {
      if (!sucursalSeleccionada) {
        showNotification('Por favor, selecciona una sucursal para el retiro.', 'error');
        return;
      }
      detallesEntrega = { tipoEntrega: 'retiro en sucursal', sucursal: sucursalSeleccionada };

    } else if (metodoEntrega === 'domicilio') {
      let direccionSeleccionada = '';
      if (opcionDireccion === 'nueva') {
        if (!calle || !ciudad || !region) {
          showNotification('Por favor, completa todos los campos de la nueva dirección.', 'error');
          return;
        }
        direccionSeleccionada = `${calle}, ${ciudad}, ${region}`;
        if (guardarDireccion) {
          nuevaDireccionAGuardar = { calle, ciudad, region };
        }
      } else {
        const indice = parseInt(opcionDireccion.replace('guardada-', ''));
        const dir = usuarioActual.direcciones?.[indice];
        if (dir) {
          direccionSeleccionada = `${dir.calle}, ${dir.ciudad}, ${dir.region}`;
        }
      }
      detallesEntrega = { tipoEntrega: 'domicilio', direccion: direccionSeleccionada };
    }

    if (!detallesEntrega) {
      showNotification('Error en los detalles de entrega.', 'error');
      return;
    }

    const puntosUsados = usarPuntos ? puntosUsuario : 0;
    const puntosGanados = Math.floor(totalFinal / 1000);

    const nuevoPedido: Pedido = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      items: carrito,
      totalOriginal: totalCarrito,
      totalFinal: totalFinal,
      puntosUsados: puntosUsados,
      puntosGanados: puntosGanados,
      estado: 'En preparación',
      ...detallesEntrega,
      correoCliente: usuarioActual.correo
    };

    try {
      await api.crearPedido(nuevoPedido, guardarDireccion, nuevaDireccionAGuardar);

      limpiarCarrito();
      showNotification('¡Compra realizada con éxito!', 'success');
      setBoleta(nuevoPedido);
    } catch (error) {
      console.error(error);
      showNotification('Error al procesar el pedido.', 'error');
    }
  };


  return (
    <>
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form onSubmit={handleFinalizarCompra}>
              <div className="card shadow-lg p-4">
                <h2 className="card-title text-center mb-4" style={{ color: 'var(--color-primario)' }}>Finalizar Compra</h2>

                <div id="resumen-compra">
                  {carrito.length === 0 ? (
                    <div id="mensaje-sin-productos" className="text-center text-muted fst-italic mt-4">
                      Tu carrito está vacío. <Link to="/productos">¡Vuelve a la tienda!</Link>
                    </div>
                  ) : (
                    carrito.map(item => (
                      <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                        <div>
                          <strong>{item.nombre}</strong>
                          <p className="mb-0 text-muted small">{formatearPrecio(item.precio)} x {item.cantidad} {item.unidad}</p>
                        </div>
                        <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                      </div>
                    ))
                  )}
                </div>

                {puntosUsuario > 0 && (
                  <div id="seccionPuntos" className="mt-4 card p-3">
                    <h5>Puntos de Fidelización</h5>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="usarPuntosCheckbox"
                        checked={usarPuntos}
                        onChange={(e) => setUsarPuntos(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="usarPuntosCheckbox">
                        Usar mis {puntosUsuario} puntos (equivalen a {formatearPrecio(puntosUsuario)})
                      </label>
                    </div>
                  </div>
                )}

                <hr className="my-4" />

                <div className="mb-4">
                  <label htmlFor="metodoEntrega" className="form-label fw-bold">Elige cómo recibir tu pedido:</label>
                  <select
                    className="form-select"
                    id="metodoEntrega"
                    value={metodoEntrega}
                    onChange={(e) => setMetodoEntrega(e.target.value as 'sucursal' | 'domicilio' | '')}
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="sucursal">Retiro en sucursal</option>
                    <option value="domicilio">Envío a domicilio</option>
                  </select>
                </div>

                {metodoEntrega === 'sucursal' && (
                  <div id="seccionSucursal">
                    <label htmlFor="selectorSucursal" className="form-label fw-bold">Elige tu sucursal:</label>
                    <select
                      className="form-select form-select-sm"
                      id="selectorSucursal"
                      value={sucursalSeleccionada}
                      onChange={(e) => setSucursalSeleccionada(e.target.value)}
                    >
                      <option value="" disabled>Selecciona una sucursal</option>
                      {sucursales.map(suc => <option key={suc} value={suc}>{suc}</option>)}
                    </select>
                  </div>
                )}

                {metodoEntrega === 'domicilio' && (
                  <div id="seccionDireccion">
                    <h5 className="fw-bold">Dirección de Envío</h5>
                    <div className="mb-3">
                      <label htmlFor="selectorDireccion" className="form-label">Direcciones guardadas</label>
                      <select
                        className="form-select"
                        id="selectorDireccion"
                        value={opcionDireccion}
                        onChange={(e) => setOpcionDireccion(e.target.value)}
                      >
                        <option value="nueva">Usar una nueva dirección</option>
                        {usuarioActual?.direcciones?.map((dir, indice) => (
                          <option key={indice} value={`guardada-${indice}`}>
                            {dir.calle}, {dir.ciudad}, {dir.region}
                          </option>
                        ))}
                      </select>
                    </div>

                    {opcionDireccion === 'nueva' && (
                      <div id="camposNuevaDireccion">
                        <div className="mb-3">
                          <label htmlFor="calleDireccion" className="form-label">Calle</label>
                          <input type="text" className="form-control" id="calleDireccion" placeholder="Ej: Av. Principal 123" value={calle} onChange={(e) => setCalle(e.target.value)} />
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="ciudadDireccion" className="form-label">Ciudad</label>
                            <input type="text" className="form-control" id="ciudadDireccion" placeholder="Ej: Santiago" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="regionDireccion" className="form-label">Región</label>
                            <input type="text" className="form-control" id="regionDireccion" placeholder="Ej: Metropolitana" value={region} onChange={(e) => setRegion(e.target.value)} />
                          </div>
                        </div>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxGuardarDireccion"
                            checked={guardarDireccion}
                            onChange={(e) => setGuardarDireccion(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="checkboxGuardarDireccion">
                            Guardar esta dirección para futuras compras
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center fw-bold fs-5">
                  <span>Total a pagar:</span>
                  <span id="total-final">{formatearPrecio(totalFinal)}</span>
                </div>

                {carrito.length > 0 && (
                  <div className="d-grid mt-4">
                    <button id="boton-finalizar" type="submit" className="btn btn-primario btn-lg">Finalizar Compra</button>
                  </div>
                )}

                <div className="text-center mt-3">
                  <Link to="/productos" className="btn btn-link text-muted">Volver a la tienda</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <ModalBoleta
        pedido={boleta}
        onClose={() => {
          setBoleta(null);
          navigate('/perfil');
        }}
      />
    </>
  );
}