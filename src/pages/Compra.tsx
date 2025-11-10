import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/mockApi';
import { formatearPrecio } from '../utils/format';
import type { Pedido, Direccion } from '../types'; 
import ModalBoleta from '../components/ModalBoleta';
import { Form, Row, Col } from 'react-bootstrap';

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
  const [guardarDireccion, setGuardarDireccion] = useState(true);

  const [usarPuntos, setUsarPuntos] = useState(false);
  const [boleta, setBoleta] = useState<Pedido | null>(null);

  const [regiones, setRegiones] = useState<Record<string, string[]>>({});
  const [comunas, setComunas] = useState<string[]>([]);
  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');

  useEffect(() => {
    api.getRegionesYComunas().then(setRegiones);
  }, []);

  useEffect(() => {
    if (regionSeleccionada && regiones[regionSeleccionada]) {
      setComunas(regiones[regionSeleccionada]);
      setComunaSeleccionada('');
    } else {
      setComunas([]);
    }
  }, [regionSeleccionada, regiones]);


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
        if (!calle || !comunaSeleccionada || !regionSeleccionada) {
          showNotification('Por favor, completa calle, región y comuna.', 'error');
          return;
        }
        direccionSeleccionada = `${calle}, ${comunaSeleccionada}, ${regionSeleccionada}`;
        if (guardarDireccion) {
          nuevaDireccionAGuardar = { calle, ciudad: comunaSeleccionada, region: regionSeleccionada };
        }
      } else {
        const indice = parseInt(opcionDireccion.replace('guardada-', ''));
        const dir = usuarioActual.direcciones?.[indice];
        if (dir) {
          direccionSeleccionada = `${dir.calle}, ${dir.ciudad}, ${dir.region}`;
        } else {
          showNotification('La dirección guardada no es válida. Por favor, selecciona "nueva dirección".', 'error');
          return;
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
            <Form onSubmit={handleFinalizarCompra}>
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
                    <Form.Check
                      type="checkbox"
                      id="usarPuntosCheckbox"
                      label={`Usar mis ${puntosUsuario} puntos (equivalen a ${formatearPrecio(puntosUsuario)})`}
                      checked={usarPuntos}
                      onChange={(e) => setUsarPuntos(e.target.checked)}
                    />
                  </div>
                )}

                <hr className="my-4" />

                <Form.Group className="mb-4">
                  <Form.Label htmlFor="metodoEntrega" className="fw-bold">Elige cómo recibir tu pedido:</Form.Label>
                  <Form.Select
                    id="metodoEntrega"
                    value={metodoEntrega}
                    onChange={(e) => setMetodoEntrega(e.target.value as 'sucursal' | 'domicilio' | '')}
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="sucursal">Retiro en sucursal</option>
                    <option value="domicilio">Envío a domicilio</option>
                  </Form.Select>
                </Form.Group>

                {metodoEntrega === 'sucursal' && (
                  <Form.Group id="seccionSucursal">
                    <Form.Label htmlFor="selectorSucursal" className="fw-bold">Elige tu sucursal:</Form.Label>
                    <Form.Select
                      id="selectorSucursal"
                      value={sucursalSeleccionada}
                      onChange={(e) => setSucursalSeleccionada(e.target.value)}
                    >
                      <option value="" disabled>Selecciona una sucursal</option>
                      {sucursales.map(suc => <option key={suc} value={suc}>{suc}</option>)}
                    </Form.Select>
                  </Form.Group>
                )}

                {metodoEntrega === 'domicilio' && (
                  <div id="seccionDireccion">
                    <h5 className="fw-bold">Dirección de Envío</h5>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="selectorDireccion">Direcciones guardadas</Form.Label>
                      <Form.Select
                        id="selectorDireccion"
                        value={opcionDireccion}
                        onChange={(e) => setOpcionDireccion(e.target.value)}
                      >
                        <option value="nueva">Usar una nueva dirección</option>
                        {usuarioActual?.direcciones?.map((dir: Direccion, indice: number) => ( 
                          <option key={indice} value={`guardada-${indice}`}>
                            {dir.calle}, {dir.ciudad}, {dir.region}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {opcionDireccion === 'nueva' && (
                      <div id="camposNuevaDireccion">
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="calleDireccion">Calle y Número</Form.Label>
                          <Form.Control type="text" id="calleDireccion" placeholder="Ej: Av. Principal 123" value={calle} onChange={(e) => setCalle(e.target.value)} />
                        </Form.Group>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label htmlFor="region">Región</Form.Label>
                              <Form.Select
                                id="region"
                                value={regionSeleccionada}
                                onChange={(e) => setRegionSeleccionada(e.target.value)}
                                required
                              >
                                <option value="" disabled>Selecciona una región</option>
                                {Object.keys(regiones).map(r => <option key={r} value={r}>{r}</option>)}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label htmlFor="comuna">Comuna</Form.Label>
                              <Form.Select
                                id="comuna"
                                value={comunaSeleccionada}
                                onChange={(e) => setComunaSeleccionada(e.target.value)}
                                disabled={comunas.length === 0}
                                required
                              >
                                <option value="" disabled>Selecciona una comuna</option>
                                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Check
                          type="checkbox"
                          id="checkboxGuardarDireccion"
                          label="Guardar esta dirección para futuras compras"
                          checked={guardarDireccion}
                          onChange={(e) => setGuardarDireccion(e.target.checked)}
                          className="mb-3"
                        />
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
            </Form>
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
