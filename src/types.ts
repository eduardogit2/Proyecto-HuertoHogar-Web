export interface Resena {
  usuario: string;
  calificacion: number;
  texto: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  precioConDescuento?: number;
  categoria: string;
  imagen: string;
  etiqueta?: string;
  descripcion: string;
  stock: number;
  stockCritico: number | null;
  origen: string;
  unidad: string;
  resenas: Resena[];
}

export interface Usuario {
  id?: number;
  rut: string;
  nombre: string;
  apellidos?: string;
  correo: string;
  contrasena: string;
  esAdmin: boolean;
  esVendedor?: boolean;
  direcciones?: Direccion[];
  historial?: Pedido[];
  puntos?: number;
  region?: string;
  comuna?: string;
}

export interface Direccion {
  calle: string;
  ciudad: string;
  region: string;
}

export interface PublicacionBlog {
  id: number;
  titulo: string;
  imagen: string;
  fecha: string;
  categoria: string;
  contenido: string;
}

export interface ComentarioBlog {
  usuario: string;
  texto: string;
}

export interface CarritoItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  unidad: string;
}

export interface Pedido {
  id: number;
  fecha: string;
  items: CarritoItem[];
  totalOriginal: number;
  totalFinal: number;
  puntosUsados: number;
  puntosGanados: number;
  estado: 'En preparación' | 'Enviado' | 'En camino' | 'Entregado' | 'Cancelado';
  tipoEntrega: 'domicilio' | 'retiro en sucursal';
  direccion?: string;
  sucursal?: string;
  correoCliente: string;
}