import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../types';
import { api } from '../services/mockApi';

interface ProductContextType {
  productos: Producto[];
  cargando: boolean;
  actualizarStockProducto: (productoId: number, cantidadARestar: number) => Promise<boolean>;
  restaurarStockProducto: (productoId: number, cantidadARestaurar: number) => Promise<void>;
  actualizarProductoCompleto: (productoActualizado: Producto) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext debe ser usado dentro de un ProductProvider');
  }
  return context;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.getProductos()
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setCargando(false);
      });
  }, []);

  const guardarProductosEnEstadoYDB = (nuevosProductos: Producto[]) => {
    setProductos(nuevosProductos);
    api.saveProductos(nuevosProductos);
  };

  const actualizarStockProducto = async (productoId: number, cantidadARestar: number): Promise<boolean> => {
    const indiceProducto = productos.findIndex(p => p.id === productoId);
    if (indiceProducto === -1) {
      console.error("Producto no encontrado para actualizar stock");
      return false;
    }

    const producto = productos[indiceProducto];
    if (producto.stock < cantidadARestar) {
      console.error("Stock insuficiente");
      return false;
    }

    const nuevosProductos = productos.map(p => 
      p.id === productoId ? { ...p, stock: p.stock - cantidadARestar } : p
    );
    
    guardarProductosEnEstadoYDB(nuevosProductos);
    return true;
  };

  const restaurarStockProducto = async (productoId: number, cantidadARestaurar: number) => {
    const indiceProducto = productos.findIndex(p => p.id === productoId);
    if (indiceProducto === -1) {
      console.error("Producto no encontrado para restaurar stock");
      return;
    }

    const nuevosProductos = productos.map(p => 
      p.id === productoId ? { ...p, stock: p.stock + cantidadARestaurar } : p
    );
    
    guardarProductosEnEstadoYDB(nuevosProductos);
  };
  
  const actualizarProductoCompleto = (productoActualizado: Producto) => {
    const nuevosProductos = productos.map(p =>
      p.id === productoActualizado.id ? productoActualizado : p
    );
    guardarProductosEnEstadoYDB(nuevosProductos);
  };

  return (
    <ProductContext.Provider value={{ productos, cargando, actualizarStockProducto, restaurarStockProducto, actualizarProductoCompleto }}>
      {children}
    </ProductContext.Provider>
  );
}