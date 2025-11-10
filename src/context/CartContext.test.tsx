import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import type { Producto } from '../types';

const mockShowNotification = vi.fn();
vi.mock('./NotificationContext', () => ({
  useNotification: () => ({
    showNotification: mockShowNotification,
  }),
}));

const mockProducto1: Producto = { id: 100, nombre: "Manzana", precio: 1000, stock: 10, resenas: [], categoria: 'Frutas', descripcion: '', imagen: '', origen: '', stockCritico: null, unidad: 'kg' };
const mockProducto2: Producto = { id: 200, nombre: "Naranja", precio: 500, stock: 5, resenas: [], categoria: 'Frutas', descripcion: '', imagen: '', origen: '', stockCritico: null, unidad: 'kg' };

const renderCartHook = () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );
  return renderHook(() => useCart(), { wrapper });
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('Hook: useCart', () => {

  test('debe inicializar con un carrito vacío', () => {
    const { result } = renderCartHook();
    expect(result.current.carrito).toEqual([]);
    expect(result.current.contadorCarrito).toBe(0);
    expect(result.current.totalCarrito).toBe(0);
  });

  test('debe agregar un nuevo producto al carrito', () => {
    const { result } = renderCartHook();

    act(() => {
      result.current.agregarAlCarrito(mockProducto1, 2);
    });

    expect(result.current.carrito.length).toBe(1);
    expect(result.current.carrito[0].id).toBe(100);
    expect(result.current.carrito[0].cantidad).toBe(2);
    expect(result.current.contadorCarrito).toBe(2);
    expect(result.current.totalCarrito).toBe(2000);
  });

  test('debe incrementar la cantidad de un producto existente', () => {
    const { result } = renderCartHook();

    act(() => {
      result.current.agregarAlCarrito(mockProducto1, 2);
    });
    act(() => {
      result.current.agregarAlCarrito(mockProducto1, 3);
    });

    expect(result.current.carrito.length).toBe(1);
    expect(result.current.carrito[0].cantidad).toBe(5);
    expect(result.current.contadorCarrito).toBe(5);
    expect(result.current.totalCarrito).toBe(5000);
  });

  test('debe manejar múltiples productos en el carrito', () => {
    const { result } = renderCartHook();

    act(() => {
      result.current.agregarAlCarrito(mockProducto1, 2);
    });
    act(() => {
      result.current.agregarAlCarrito(mockProducto2, 1);
    });

    expect(result.current.carrito.length).toBe(2);
    expect(result.current.contadorCarrito).toBe(3);
    expect(result.current.totalCarrito).toBe(2500);
  });

  test('debe disminuir la cantidad con cambiarCantidad', () => {
    const { result } = renderCartHook();
    act(() => {
      result.current.agregarAlCarrito(mockProducto1, 3);
    });

    act(() => {
      result.current.cambiarCantidad(100, -1);
    });

    expect(result.current.carrito[0].cantidad).toBe(2);
    expect(result.current.totalCarrito).toBe(2000);
  });

  test('debe eliminar un producto si cambiarCantidad llega a 0', () => {
    const { result } = renderCartHook();
    act(() => {
      result.current.agregarAlCarrito(mockProducto1, 1);
    });

    act(() => {
      result.current.cambiarCantidad(100, -1);
    });

    expect(result.current.carrito.length).toBe(0);
    expect(result.current.totalCarrito).toBe(0);
  });

  test('estaEnStock debe retornar false y notificar si el stock es insuficiente', () => {
    const { result } = renderCartHook();

    const stockInsuficiente = result.current.estaEnStock(mockProducto1, 11);

    expect(stockInsuficiente).toBe(false);
    expect(mockShowNotification).toHaveBeenCalledWith('Stock insuficiente. Solo quedan 10 unidades de Manzana.', 'error');
  });

  test('estaEnStock debe retornar true si el stock es suficiente', () => {
    const { result } = renderCartHook();

    const stockSuficiente = result.current.estaEnStock(mockProducto1, 5);

    expect(stockSuficiente).toBe(true);
    expect(mockShowNotification).not.toHaveBeenCalled();
  });
});