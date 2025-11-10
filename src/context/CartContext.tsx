import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CarritoItem, Producto } from '../types';
import { useNotification } from './NotificationContext';
import { useProductContext } from './ProductContext';

interface CartContextType {
  carrito: CarritoItem[];
  totalCarrito: number;
  contadorCarrito: number;
  agregarAlCarrito: (producto: Producto, cantidad: number) => Promise<void>;
  cambiarCantidad: (idProducto: number, cantidadACambiar: number) => Promise<void>;
  limpiarCarrito: () => Promise<void>;
  estaEnStock: (producto: Producto, cantidadDeseada: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const { showNotification } = useNotification();
  const { productos, actualizarStockProducto, restaurarStockProducto } = useProductContext();

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
    const productoEnContext = productos.find(p => p.id === producto.id);
    if (!productoEnContext) return false;

    const itemEnCarrito = carrito.find(item => item.id === producto.id);
    const cantidadActualEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    
    const cantidadNetaAAgregar = cantidadDeseada - cantidadActualEnCarrito;
    
    if (cantidadNetaAAgregar > 0 && productoEnContext.stock < cantidadNetaAAgregar) {
      showNotification(`Stock insuficiente. Solo quedan ${productoEnContext.stock} unidades.`, 'error');
      return false;
    }
    return true;
  };
  
  const agregarAlCarrito = async (producto: Producto, cantidad: number) => {
    
    const exito = await actualizarStockProducto(producto.id, cantidad);
    
    if (!exito) {
      showNotification(`Stock insuficiente para ${producto.nombre}.`, 'error');
      return;
    }

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
    showNotification(`${producto.nombre} (x${cantidad}) añadido al carrito.`, 'success');
  };

  const cambiarCantidad = async (idProducto: number, cantidadACambiar: number) => {
    const item = carrito.find(item => item.id === idProducto);
    if (!item) return;

    if (cantidadACambiar > 0) {
      const exito = await actualizarStockProducto(idProducto, 1);
      if (!exito) {
        showNotification(`No hay más stock de ${item.nombre}`, 'error');
        return;
      }
    } else {
      await restaurarStockProducto(idProducto, 1);
    }

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

  const limpiarCarrito = async () => {
    for (const item of carrito) {
      await restaurarStockProducto(item.id, item.cantidad);
    }
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