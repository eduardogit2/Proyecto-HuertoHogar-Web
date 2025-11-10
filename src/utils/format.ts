export function formatearPrecio(n: number): string {
  if (n === 0) {
    return "Gratis";
  }
  return n.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });
}