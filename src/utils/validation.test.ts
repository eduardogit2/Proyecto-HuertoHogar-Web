import { describe, test, expect } from 'vitest';
import { validarCorreo, autoFormatRut } from './validation';


describe('Utilidad: validarCorreo', () => {

  test('debe validar correos de dominios permitidos', () => {
    expect(validarCorreo('usuario@duoc.cl')).toBe(true);
    expect(validarCorreo('usuario@profesor.duoc.cl')).toBe(true);
    expect(validarCorreo('usuario@gmail.com')).toBe(true);
  });

  test('debe invalidar correos de otros dominios', () => {
    expect(validarCorreo('usuario@hotmail.com')).toBe(false);
    expect(validarCorreo('usuario@outlook.com')).toBe(false);
    expect(validarCorreo('usuario@dominio.cl')).toBe(false);
  });
});

describe('Utilidad: autoFormatRut', () => {

  test('debe formatear un RUT sin formato', () => {
    expect(autoFormatRut('19011022k')).toBe('19.011.022-K');
  });

  test('debe manejar RUTs más cortos', () => {
    expect(autoFormatRut('12345678')).toBe('1.234.567-8');
  });

  test('debe ignorar puntos y guiones existentes al formatear', () => {
    expect(autoFormatRut('19.011022-k')).toBe('19.011.022-K');
  });
});