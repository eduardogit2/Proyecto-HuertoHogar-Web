import { useState, useEffect } from 'react';
import { api } from '../../services/mockApi';
import { Link } from 'react-router-dom';

export default function AdminCategorias() {
    const [categorias, setCategorias] = useState<string[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        api.getCategoriasUnicas()
            .then(data => {
                setCategorias(data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error al cargar categorías:", err);
                setCargando(false);
            });
    }, []);

    return (
        <div className="container-fluid">
            <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
                <h1 className="h2 texto-secundario">Gestión de Categorías</h1>
            </header>
            <div className="card shadow-sm">
                <div className="card-header">
                    <h5 className="mb-0">Categorías Existentes</h5>
                </div>

                {cargando ? (
                    <div className="card-body">
                        <p>Cargando categorías...</p>
                    </div>
                ) : (
                    <ul className="list-group list-group-flush">
                        {categorias.map(cat => (
                            <li key={cat} className="list-group-item">{cat}</li>
                        ))}
                        {categorias.length === 0 && (
                            <li className="list-group-item text-muted">No se encontraron categorías.</li>
                        )}
                    </ul>
                )}

                <div className="card-footer">
                    <p className="text-muted small mb-0">
                        Para agregar una nueva categoría, simplemente <Link to="/admin/productos/nuevo">crea un nuevo producto</Link> y asígnale el nuevo nombre de categoría.
                    </p>
                    <p className="text-muted small mb-0">
                        Para eliminar una categoría, asegúrate de que ningún producto la esté utilizando.
                    </p>
                </div>
            </div>
        </div>
    );
}