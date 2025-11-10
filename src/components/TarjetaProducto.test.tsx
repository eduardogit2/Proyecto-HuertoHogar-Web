import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TarjetaProducto from './TarjetaProducto';

vi.mock('./StarRating', () => ({
  default: ({ calificacion }: { calificacion: number }) => (
    <div data-testid="star-rating">{calificacion.toFixed(1)} estrellas</div>
  ),
}));

const mockProducto = {
  id: 100,
  nombre: "Manzana Fuji",
  precio: 1200,
  categoria: "Frutas",
  imagen: "img/prod1.jpg",
  descripcion: "Descripción de prueba...",
  stock: 50,
  stockCritico: null,
  origen: "Valle del Maule, Chile",
  unidad: "kg",
  resenas: [{ usuario: "Ana", calificacion: 5, texto: "..." }],
};

const mockOnClick = vi.fn();

describe('Componente: TarjetaProducto', () => {

  test('renderiza la información básica del producto', () => {
    render(<TarjetaProducto producto={mockProducto} onProductoClick={mockOnClick} />);

    expect(screen.getByText('Manzana Fuji')).toBeInTheDocument();
    expect(screen.getByText('Valle del Maule, Chile')).toBeInTheDocument();
    expect(screen.getByText('$1.200')).toBeInTheDocument();
  });

  test('muestra el precio con descuento si existe', () => {
    const productoEnOferta = { ...mockProducto, precioConDescuento: 1000 };
    render(<TarjetaProducto producto={productoEnOferta} onProductoClick={mockOnClick} />);

    expect(screen.getByText('$1.000')).toBeInTheDocument();
    expect(screen.getByText('$1.200')).toBeInTheDocument();
  });

  test('llama a onProductoClick cuando se hace clic', async () => {
    render(<TarjetaProducto producto={mockProducto} onProductoClick={mockOnClick} />);

    await userEvent.click(screen.getByText('Manzana Fuji'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockProducto);
  });

  test('muestra el stock en singular (ej: 1 kg)', () => {
    const productoStockUno = { ...mockProducto, stock: 1, unidad: 'kg' };
    render(<TarjetaProducto producto={productoStockUno} onProductoClick={mockOnClick} />);
    expect(screen.getByText('Stock: 1 kg')).toBeInTheDocument();
  });

  test('muestra el stock en singular (ej: 1 frasco)', () => {
    const productoStockUno = { ...mockProducto, stock: 1, unidad: 'frasco' };
    render(<TarjetaProducto producto={productoStockUno} onProductoClick={mockOnClick} />);
    expect(screen.getByText('Stock: 1 frasco')).toBeInTheDocument();
  });

  test('muestra el stock en plural (ej: 50 frascos)', () => {
    const productoStockPlural = { ...mockProducto, stock: 50, unidad: 'frasco' };
    render(<TarjetaProducto producto={productoStockPlural} onProductoClick={mockOnClick} />);
    expect(screen.getByText('Stock: 50 frascos')).toBeInTheDocument();
  });
});