import { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/mockApi';
import type { Pedido, Producto, Usuario } from '../../types';
import { Card, Row, Col, ListGroup, ProgressBar } from 'react-bootstrap';
import { formatearPrecio } from '../../utils/format';

export default function AdminReportes() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        setCargando(true);
        Promise.all([
            api.getAllPedidos(),
            api.getProductos(),
            api.getUsuarios()
        ])
            .then(([pedidosData, productosData, usuariosData]) => {
                setPedidos(pedidosData);
                setProductos(productosData);
                setUsuarios(usuariosData);
            })
            .catch(err => console.error("Error al cargar datos del dashboard:", err))
            .finally(() => setCargando(false));
    }, []);

    const reporteVentas = useMemo(() => {
        const totalVentas = pedidos.reduce((acc, p) => acc + p.totalFinal, 0);
        const totalPedidos = pedidos.length;
        const pedidosPorEstado = pedidos.reduce((acc, p) => {
            acc[p.estado] = (acc[p.estado] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const datosGraficoEstados = Object.entries(pedidosPorEstado).map(([label, value]) => ({
            label,
            value,
            variant: label === 'Entregado' ? 'success' : (label === 'Cancelado' ? 'danger' : (label === 'En camino' ? 'info' : 'warning'))
        }));

        return { totalVentas, totalPedidos, datosGraficoEstados };
    }, [pedidos]);

    const reporteInventario = useMemo(() => {
        const stockBajo = productos
            .filter(p => (p.stockCritico !== null && p.stock <= p.stockCritico) || p.stock < 10)
            .sort((a, b) => a.stock - b.stock);

        const totalStockGeneral = productos.reduce((acc, p) => acc + p.stock, 0);

        return { stockBajo, totalStockGeneral, todosLosProductos: productos };
    }, [productos]);

    const reporteClientes = useMemo(() => {
        const totalUsuarios = usuarios.length;
        const distribucionRoles = usuarios.reduce((acc, u) => {
            if (u.esAdmin) acc["Admin"] = (acc["Admin"] || 0) + 1;
            else if (u.esVendedor) acc["Vendedor"] = (acc["Vendedor"] || 0) + 1;
            else acc["Cliente"] = (acc["Cliente"] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return { totalUsuarios, distribucionRoles };
    }, [usuarios]);

    if (cargando) {
        return <p>Generando reportes...</p>;
    }

    return (
        <div className="container-fluid">
            <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
                <h1 className="h2 texto-secundario">Reportes</h1>
            </header>

            <Row className="g-4">
                <Col md={6} lg={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">
                            <i className="bi bi-bar-chart-fill me-2"></i>
                            Reporte de Ventas
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                    Ventas Totales:
                                    <strong className="fs-5">{formatearPrecio(reporteVentas.totalVentas)}</strong>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                    Pedidos Totales:
                                    <strong className="fs-5">{reporteVentas.totalPedidos}</strong>
                                </ListGroup.Item>
                            </ListGroup>
                            <hr />
                            <h6>Pedidos por Estado</h6>
                            {reporteVentas.datosGraficoEstados.length > 0 ? (
                                reporteVentas.datosGraficoEstados.map(item => (
                                    <div key={item.label}>
                                        <div className="d-flex justify-content-between small">
                                            <span>{item.label}</span>
                                            <strong>{item.value}</strong>
                                        </div>
                                        <ProgressBar
                                            now={(item.value / reporteVentas.totalPedidos) * 100}
                                            variant={item.variant as string}
                                            className="mb-2"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted small text-center">No hay datos de pedidos para mostrar.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">
                            <i className="bi bi-box-seam-fill me-2"></i>
                            Reporte de Inventario
                        </Card.Header>
                        <Card.Body className="d-flex flex-column">
                            <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                    Stock General Total:
                                    <strong className="fs-5">{reporteInventario.totalStockGeneral}</strong>
                                </ListGroup.Item>
                            </ListGroup>
                            <hr />

                            <h6 className="card-subtitle mb-2">Productos con Stock Bajo</h6>
                            <ListGroup variant="flush" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {reporteInventario.stockBajo.length > 0 ? (
                                    reporteInventario.stockBajo.map(p => (
                                        <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center p-2">
                                            <span className="small">{p.nombre}</span>
                                            <span className="badge bg-danger rounded-pill">Stock: {p.stock}</span>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item className="text-muted small">No hay productos con stock bajo.</ListGroup.Item>
                                )}
                            </ListGroup>
                            <hr />

                            <h6 className="card-subtitle mb-2">Inventario de Productos ({reporteInventario.todosLosProductos.length} items)</h6>
                            <ListGroup variant="flush" className="flex-grow-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {reporteInventario.todosLosProductos.map(p => {
                                    const unidadesPluralizables = ['bolsa', 'litro', 'frasco'];
                                    const unidadTexto = p.stock !== 1 && unidadesPluralizables.includes(p.unidad)
                                        ? `${p.unidad}s`
                                        : p.unidad;

                                    return (
                                        <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center p-2">
                                            <span className="small">{p.nombre}</span>
                                            <strong className="small">Stock: {p.stock} {unidadTexto}</strong>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">
                            <i className="bi bi-people-fill me-2"></i>
                            Reporte de Clientes
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                    Usuarios Totales:
                                    <strong className="fs-5">{reporteClientes.totalUsuarios}</strong>
                                </ListGroup.Item>
                            </ListGroup>
                            <hr />
                            <h6>Distribución de Roles</h6>
                            {Object.keys(reporteClientes.distribucionRoles).length > 0 ? (
                                Object.entries(reporteClientes.distribucionRoles).map(([label, value]) => (
                                    <div key={label}>
                                        <div className="d-flex justify-content-between small">
                                            <span>{label}</span>
                                            <strong>{value}</strong>
                                        </div>
                                        <ProgressBar
                                            now={(value / reporteClientes.totalUsuarios) * 100}
                                            variant={label === 'Admin' ? 'danger' : (label === 'Vendedor' ? 'info' : 'primary')}
                                            className="mb-2"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted small text-center">No hay datos de roles para mostrar.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}