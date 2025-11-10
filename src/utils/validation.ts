export function validarRut(rut: string): boolean {
  const valorLimpio = rut.replace(/[.-]/g, '').toUpperCase();

  if (!/^[0-9]{7,8}[0-9K]$/.test(valorLimpio)) {
    return false;
  }

  const cuerpo = valorLimpio.slice(0, -1);
  const dv = valorLimpio.slice(-1);

  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * factor;
    factor = (factor === 7) ? 2 : factor + 1;
  }

  const dvCalculado = 11 - (suma % 11);
  const dvCalculadoStr = (dvCalculado === 11) ? '0' : ((dvCalculado === 10) ? 'K' : dvCalculado.toString());

  return dvCalculadoStr === dv;
}

export function validarCorreo(correo: string): boolean {
  const expresionRegular = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  return expresionRegular.test(correo);
}

export function autoFormatRut(rut: string): string {
  const valorLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

  if (valorLimpio.length < 2) return valorLimpio;

  const cuerpo = valorLimpio.slice(0, -1);
  const dv = valorLimpio.slice(-1);

  let cuerpoFormateado = '';
  let j = 1;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    cuerpoFormateado = cuerpo.charAt(i) + cuerpoFormateado;
    if (j % 3 === 0 && j < cuerpo.length) {
      cuerpoFormateado = '.' + cuerpoFormateado;
    }
    j++;
  }

  return `${cuerpoFormateado}-${dv}`;
}