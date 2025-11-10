import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Usuario } from '../types';
import { api } from '../services/mockApi';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  usuarioActual: Usuario | null;
  login: (correo: string, contrasena: string) => Promise<void>;
  register: (usuario: Omit<Usuario, 'id' | 'esAdmin'>) => Promise<void>;
  logout: () => void;
  updateUser: (usuarioActualizado: Usuario) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const sesionIniciada = localStorage.getItem('sesionIniciada') === 'true';
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    if (sesionIniciada && usuarioGuardado) {
      setUsuarioActual(JSON.parse(usuarioGuardado));
    }
  }, []);

  const login = async (correo: string, contrasena: string) => {
    try {
      const usuario = await api.login(correo, contrasena);
      setUsuarioActual(usuario);
      showNotification(`¡Bienvenido de nuevo, ${usuario.nombre}!`, 'success');
      if (usuario.esAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      showNotification('Credenciales incorrectas.', 'error');
    }
  };

  const register = async (nuevoUsuario: Omit<Usuario, 'id' | 'esAdmin'>) => {
    await api.register(nuevoUsuario);
    showNotification('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
    navigate('/ingreso');
  };

  const logout = () => {
    localStorage.removeItem('sesionIniciada');
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('carrito');
    setUsuarioActual(null);
    showNotification('Has cerrado sesión.', 'info');
    navigate('/');
  };

  const updateUser = async (usuarioActualizado: Usuario) => {
    try {
      const usuarioGuardado = await api.updateUser(usuarioActualizado);
      setUsuarioActual(usuarioGuardado);
      showNotification('Perfil actualizado con éxito.', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Error al actualizar el perfil.', 'error');
    }
  };

  const value = {
    usuarioActual,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}