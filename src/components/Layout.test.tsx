import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';
import userEvent from '@testing-library/user-event';

const mockLogout = vi.fn();
const mockUseAuth = vi.fn();
const mockUseCart = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../context/CartContext', () => ({
  useCart: () => mockUseCart(),
}));

const renderWithRouter = () => {
  render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>
  );
};

beforeEach(() => {
  mockLogout.mockClear();
  mockUseAuth.mockReturnValue({
    usuarioActual: { nombre: 'Cliente', esAdmin: false },
    logout: mockLogout,
  });
  mockUseCart.mockReturnValue({
    carrito: [],
    contadorCarrito: 0,
    totalCarrito: 0,
    limpiarCarrito: vi.fn(),
    cambiarCantidad: vi.fn(),
  });
});

describe('Componente: Layout (Navbar)', () => {

  test('debe mostrar "Iniciar sesión" y "Regístrate" si el usuario está deslogueado', () => {
    mockUseAuth.mockReturnValue({ usuarioActual: null });
    renderWithRouter();

    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('Regístrate')).toBeInTheDocument();
    expect(screen.queryByText(/Hola/i)).not.toBeInTheDocument();
  });

  test('debe mostrar "Hola, Cliente" y NO "Panel de Admin" para un cliente logueado', async () => {
    renderWithRouter();

    expect(screen.getByText('Hola, Cliente')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Hola, Cliente'));

    expect(screen.queryByText('Panel de Admin')).not.toBeInTheDocument();
  });

  test('debe mostrar "Hola, Admin" y "Panel de Admin" para un admin logueado', async () => {
    mockUseAuth.mockReturnValue({
      usuarioActual: { nombre: 'Admin', esAdmin: true },
      logout: mockLogout,
    });
    renderWithRouter();

    expect(screen.getByText('Hola, Admin')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Hola, Admin'));

    expect(screen.getByText('Panel de Admin')).toBeInTheDocument();
  });

  test('debe mostrar el contador del carrito correctamente', () => {
    mockUseCart.mockReturnValue({
      carrito: [],
      contadorCarrito: 5,
      totalCarrito: 12345,
      limpiarCarrito: vi.fn(),
      cambiarCantidad: vi.fn(),
    });
    renderWithRouter();

    expect(screen.getByText('5')).toBeInTheDocument();
  });

});