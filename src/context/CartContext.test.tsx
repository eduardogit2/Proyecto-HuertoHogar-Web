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

const mockActualizarStock = vi.fn().mockResolvedValue(true);
const mockRestaurarStock = vi.fn().mockResolvedValue(undefined);

vi.mock('./ProductContext', () => ({
  useProductContext: () => ({
    productos: [mockProducto1, mockProducto2], 
    actualizarStockProducto: mockActualizarStock,
    restaurarStockProducto: mockRestaurarStock,
  }),
}));

const renderCartHook = () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );
  return renderHook(() => useCart(), { wrapper });
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  mockActualizarStock.mockClear().mockResolvedValue(true); 
  mockRestaurarStock.mockClear().mockResolvedValue(undefined);
});

describe('Hook: useCart', () => {

  test('debe inicializar con un carrito vacío', () => {
    const { result } = renderCartHook();
    expect(result.current.carrito).toEqual([]);
    expect(result.current.contadorCarrito).toBe(0);
    expect(result.current.totalCarrito).toBe(0);
  });

  test('debe agregar un nuevo producto al carrito', async () => {
    const { result } = renderCartHook();

    await act(async () => {
      await result.current.agregarAlCarrito(mockProducto1, 2);
    });

    expect(result.current.carrito.length).toBe(1);
    expect(result.current.carrito[0].id).toBe(100);
    expect(result.current.carrito[0].cantidad).toBe(2);
    expect(result.current.contadorCarrito).toBe(2);
    expect(result.current.totalCarrito).toBe(2000);
    expect(mockActualizarStock).toHaveBeenCalledWith(100, 2);
  });

  test('debe incrementar la cantidad de un producto existente', async () => {
    const { result } = renderCartHook();

    await act(async () => {
      await result.current.agregarAlCarrito(mockProducto1, 2);
    });
    await act(async () => {
      await result.current.agregarAlCarrito(mockProducto1, 3);
    });

    expect(result.current.carrito.length).toBe(1);
    expect(result.current.carrito[0].cantidad).toBe(5);
    expect(result.current.contadorCarrito).toBe(5);
    expect(result.current.totalCarrito).toBe(5000);
    expect(mockActualizarStock).toHaveBeenCalledTimes(2);
  });

  test('debe manejar múltiples productos en el carrito', async () => {
    const { result } = renderCartHook();

    await act(async () => {
      await result.current.agregarAlCarrito(mockProducto1, 2);
    });
    await act(async () => {
      await result.current.agregarAlCarrito(mockProducto2, 1);
    });

    expect(result.current.carrito.length).toBe(2);
    expect(result.current.contadorCarrito).toBe(3);
    expect(result.current.totalCarrito).toBe(2500);
  });

  test('debe disminuir la cantidad con cambiarCantidad', async () => {
    const { result } = renderCartHook();
    await act(async () => {
      await result.current.agregarAlCarrito(mockProducto1, 3);
    });

    await act(async () => {
      await result.current.cambiarCantidad(100, -1);
    });

    expect(result.current.carrito[0].cantidad).toBe(2);
    expect(result.current.totalCarrito).toBe(2000);
    expect(mockRestaurarStock).toHaveBeenCalledWith(100, 1);
  });

  test('debe eliminar un producto si cambiarCantidad llega a 0', async () => {
    const { result } = renderCartHook();
    await act(async () => {
      await result.current.agregarAlCarrito(mockProducto1, 1);
    });

    await act(async () => {
      await result.current.cambiarCantidad(100, -1);
    });

    expect(result.current.carrito.length).toBe(0);
    expect(result.current.totalCarrito).toBe(0);
    expect(mockRestaurarStock).toHaveBeenCalledWith(100, 1);
  });

  test('estaEnStock debe retornar false y notificar si el stock es insuficiente', () => {
    const { result } = renderCartHook();

    const stockInsuficiente = result.current.estaEnStock(mockProducto1, 11);

    expect(stockInsuficiente).toBe(false);
    expect(mockShowNotification).toHaveBeenCalledWith('Stock insuficiente. Solo quedan 10 unidades.', 'error');
  });

  test('estaEnStock debe retornar true si el stock es suficiente', () => {
    const { result } = renderCartHook();

    const stockSuficiente = result.current.estaEnStock(mockProducto1, 5);

    expect(stockSuficiente).toBe(true);
    expect(mockShowNotification).not.toHaveBeenCalled();
  });
});