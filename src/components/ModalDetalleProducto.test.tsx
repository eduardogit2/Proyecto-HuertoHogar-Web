import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalDetalleProducto from './ModalDetalleProducto';
import type { Producto } from '../types';
import { MemoryRouter } from 'react-router-dom';

const mockAgregarAlCarrito = vi.fn();
const mockEstaEnStock = vi.fn(() => true);
const mockShowNotification = vi.fn();
const mockOnClose = vi.fn();
const mockOnResenaAgregada = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    agregarAlCarrito: mockAgregarAlCarrito,
    estaEnStock: mockEstaEnStock,
  }),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../context/NotificationContext', () => ({
  useNotification: () => ({
    showNotification: mockShowNotification,
  }),
}));

vi.mock('../services/mockApi', () => ({
  api: {
    addResena: vi.fn(() => Promise.resolve(mockProducto)),
  },
}));

vi.mock('./StarRating', () => ({
  default: () => <div data-testid="star-rating-mock"></div>,
}));

const mockProducto: Producto = {
  id: 100, nombre: "Manzana Test", precio: 1000, stock: 10, resenas: [],
  categoria: 'Frutas', descripcion: 'Descripción de prueba', imagen: '', origen: '', stockCritico: null, unidad: 'kg'
};

const renderModal = (producto: Producto | null, usuario: { nombre: string } | null) => {
  mockUseAuth.mockReturnValue({ usuarioActual: usuario });
  render(
    <MemoryRouter>
      <ModalDetalleProducto
        producto={producto}
        onClose={mockOnClose}
        onResenaAgregada={mockOnResenaAgregada}
      />
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  mockEstaEnStock.mockReturnValue(true);
});

describe('Componente: ModalDetalleProducto', () => {

  test('debe renderizar la info del producto si se pasa un producto', () => {
    renderModal(mockProducto, null);
    expect(screen.getByText('Manzana Test')).toBeInTheDocument();
    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument();
    expect(screen.getByText('$1.000')).toBeInTheDocument();
  });

  test('debe llamar a showNotification y cerrar si el usuario está deslogueado y agrega al carrito', async () => {
    renderModal(mockProducto, null);

    await userEvent.click(screen.getByRole('button', { name: /Agregar al Carrito/i }));

    expect(mockShowNotification).toHaveBeenCalledWith('Debes iniciar sesión para comprar.', 'error');
    expect(mockAgregarAlCarrito).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('debe llamar a agregarAlCarrito si el usuario está logueado y hay stock', async () => {
    renderModal(mockProducto, { nombre: 'Test' });

    const inputCantidad = screen.getByLabelText('Cantidad:');
    await userEvent.clear(inputCantidad);
    await userEvent.type(inputCantidad, '2');

    await userEvent.click(screen.getByRole('button', { name: /Agregar al Carrito/i }));

    expect(mockEstaEnStock).toHaveBeenCalledWith(mockProducto, 2);
    expect(mockAgregarAlCarrito).toHaveBeenCalledWith(mockProducto, 2);
    expect(mockShowNotification).toHaveBeenCalledWith('Manzana Test (x2) añadido al carrito.', 'success');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('debe mostrar el link de "inicia sesión" para reseñas si está deslogueado', () => {
    renderModal(mockProducto, null);
    expect(screen.getByText(/Debes/i)).toBeInTheDocument();
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    expect(screen.queryByText('Deja tu reseña')).not.toBeInTheDocument();
  });

  test('debe mostrar el formulario de reseñas si está logueado', () => {
    renderModal(mockProducto, { nombre: 'Test' });
    expect(screen.getByText('Deja tu reseña')).toBeInTheDocument();
    expect(screen.queryByText(/Debes iniciar sesión/i)).not.toBeInTheDocument();
  });
});