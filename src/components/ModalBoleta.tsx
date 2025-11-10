import { Modal, Button } from 'react-bootstrap';
import type { Pedido } from '../types';
import { formatearPrecio } from '../utils/format';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

interface ModalBoletaProps {
  pedido: Pedido | null;
  onClose: () => void;
}

export default function ModalBoleta({ pedido, onClose }: ModalBoletaProps) {
  const { showNotification } = useNotification();
  const { usuarioActual } = useAuth();

  const handleDescargarBoleta = () => {
    if (!pedido || !usuarioActual) return;

    const contenido = `
Boleta de Compra HuertoHogar
----------------------------
Pedido: #${pedido.id}
Fecha: ${new Date(pedido.fecha).toLocaleString()}
----------------------------
Productos:
${pedido.items.map(item => `  - ${item.nombre} x ${item.cantidad} ${item.unidad} - ${formatearPrecio(item.precio * item.cantidad)}`).join('\n')}
----------------------------
Detalle:
Total original: ${formatearPrecio(pedido.totalOriginal)}
Puntos usados: -${pedido.puntosUsados || 0}
Total final: ${formatearPrecio(pedido.totalFinal)}
----------------------------
Puntos ganados en esta compra: ${pedido.puntosGanados}
Nuevo saldo de puntos: ${usuarioActual.puntos || 0}
----------------------------
Gracias por su compra.
`;
    try {
      const blob = new Blob([contenido], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Boleta_Pedido_${pedido.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      showNotification('Error al descargar la boleta.', 'error');
    }
  };

  if (!pedido || !usuarioActual) return null;

  return (
    <Modal show={pedido !== null} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title id="modalBoletaLabel">Boleta de Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Número de Pedido:</strong> <span id="boletaId">{pedido.id}</span></p>
        <p><strong>Fecha:</strong> <span id="boletaFecha">{new Date(pedido.fecha).toLocaleString()}</span></p>
        <hr />
        <h6>Productos</h6>
        <ul id="boletaProductos" className="list-unstyled">
          {pedido.items.map((item, index) => (
            <li key={index}>
              {item.nombre} (${item.cantidad} {item.unidad}) - {formatearPrecio(item.precio * item.cantidad)}
            </li>
          ))}
        </ul>
        <hr />
        <div className="d-flex justify-content-between">
          <span>Total Original:</span>
          <span id="boletaTotalOriginal">{formatearPrecio(pedido.totalOriginal)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Puntos usados:</span>
          <span id="boletaPuntosUsados">-${pedido.puntosUsados || 0}</span>
        </div>
        <div className="d-flex justify-content-between fw-bold">
          <span>Total Final:</span>
          <span id="boletaTotalFinal">{formatearPrecio(pedido.totalFinal)}</span>
        </div>
        <hr />
        <p className="text-center small mt-2">
          ¡Has ganado <span id="boletaPuntosGanados">{pedido.puntosGanados}</span> puntos en esta compra!
        </p>
        <p className="text-center small">Tu nuevo saldo es: <span id="boletaSaldoFinal">{usuarioActual.puntos || 0}</span> puntos.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        <Button variant="primary" id="btnDescargarBoleta" onClick={handleDescargarBoleta}>
          Descargar Boleta
        </Button>
      </Modal.Footer>
    </Modal>
  );
}