import { useState, useEffect } from 'react';
import { api } from '../../services/mockApi';
import type { Pedido } from '../../types';
import { formatearPrecio } from '../../utils/format';
import { useNotification } from '../../context/NotificationContext';
import ModalBoleta from '../../components/ModalBoleta';

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const { showNotification } = useNotification();

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = () => {
    setCargando(true);
    api.getAllPedidos()
      .then(data => {
        setPedidos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar pedidos:", err);
        setCargando(false);
      });
  };

  const handleEstadoChange = (pedidoId: number, nuevoEstado: Pedido['estado']) => {
    setPedidos(pedidosActuales =>
      pedidosActuales.map(p =>
        p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
      )
    );

    api.updatePedido(pedidoId, nuevoEstado)
      .then(() => {
        showNotification(`Pedido #${pedidoId} actualizado a "${nuevoEstado}"`, 'success');
      })
      .catch(err => {
        console.error("Error al actualizar pedido:", err);
        showNotification("Error al guardar el estado. Recargando...", 'error');
        cargarPedidos();
      });
  };

  if (cargando) {
    return <p>Cargando pedidos...</p>;
  }

  return (
    <>
      <div className="container-fluid">
        <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
          <h1 className="h2 texto-secundario">Gestión de Pedidos</h1>
        </header>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID Pedido</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Tipo Entrega</th>
                    <th>Detalle</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-muted">No hay pedidos para mostrar.</td>
                    </tr>
                  ) : (
                    pedidos.map(pedido => (
                      <tr key={pedido.id}>
                        <td>
                          <button
                            className="btn btn-link p-0"
                            onClick={() => setPedidoSeleccionado(pedido)}
                          >
                            {pedido.id}
                          </button>
                        </td>
                        <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                        <td>{pedido.correoCliente}</td>
                        <td>{formatearPrecio(pedido.totalFinal)}</td>
                        <td className="text-capitalize">{pedido.tipoEntrega}</td>
                        <td>{pedido.tipoEntrega === 'domicilio' ? pedido.direccion : pedido.sucursal}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={pedido.estado}
                            onChange={(e) => handleEstadoChange(pedido.id, e.target.value as Pedido['estado'])}
                          >
                            <option value="En preparación">En preparación</option>
                            <option value="En camino">En camino</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
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

      <ModalBoleta
        pedido={pedidoSeleccionado}
        onClose={() => setPedidoSeleccionado(null)}
      />
    </>
  );
}