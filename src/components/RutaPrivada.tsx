import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function RutaPrivada() {
  const { usuarioActual } = useAuth();

  if (!usuarioActual) {
    return <Navigate to="/ingreso" replace />;
  }

  return <Outlet />;
}