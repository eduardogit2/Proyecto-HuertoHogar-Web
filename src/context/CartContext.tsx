import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CarritoItem, Producto } from '../types';
import { useNotification } from './NotificationContext';

interface CartContextType {
  carrito: CarritoItem[];
  totalCarrito: number;
  contadorCarrito: number;
  agregarAlCarrito: (producto: Producto, cantidad: number) => void;
  cambiarCantidad: (idProducto: number, cantidadACambiar: number) => void;
  limpiarCarrito: () => void;
  estaEnStock: (producto: Producto, cantidadDeseada: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  const actualizarCarritoYGuardar = (nuevoCarrito: CarritoItem[]) => {
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);
  };

  const estaEnStock = (producto: Producto, cantidadDeseada: number): boolean => {
    const itemEnCarrito = carrito.find(item => item.id === producto.id);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    if ((cantidadActual + cantidadDeseada) > producto.stock) {
      showNotification(`Stock insuficiente. Solo quedan ${producto.stock} unidades de ${producto.nombre}.`, 'error');
      return false;
    }
    return true;
  };

  const agregarAlCarrito = (producto: Producto, cantidad: number) => {
    const precioFinal = producto.precioConDescuento ?? producto.precio;
    const itemExistente = carrito.find(item => item.id === producto.id);

    let nuevoCarrito = [];
    if (itemExistente) {
      nuevoCarrito = carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
    } else {
      nuevoCarrito = [
        ...carrito,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: precioFinal,
          cantidad: cantidad,
          unidad: producto.unidad
        }
      ];
    }
    actualizarCarritoYGuardar(nuevoCarrito);
  };

  const cambiarCantidad = (idProducto: number, cantidadACambiar: number) => {
    const item = carrito.find(item => item.id === idProducto);
    if (!item) return;

    if (cantidadACambiar === -1 && item.cantidad === 1) {
      const nuevoCarrito = carrito.filter(i => i.id !== idProducto);
      actualizarCarritoYGuardar(nuevoCarrito);
    } else {
      const nuevoCarrito = carrito.map(i =>
        i.id === idProducto
          ? { ...i, cantidad: i.cantidad + cantidadACambiar }
          : i
      );
      actualizarCarritoYGuardar(nuevoCarrito);
    }
  };

  const limpiarCarrito = () => {
    actualizarCarritoYGuardar([]);
  };

  const contadorCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const value = {
    carrito,
    totalCarrito,
    contadorCarrito,
    estaEnStock,
    agregarAlCarrito,
    cambiarCantidad,
    limpiarCarrito
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}