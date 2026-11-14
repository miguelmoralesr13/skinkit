import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Regresión (0.8.3): el input nativo de Checkbox/Radio/Switch está oculto con `position: absolute`. Si su raíz no es
 * `position: relative`, el input queda lejos de la casilla y, al marcarla dentro de un Dialog, el navegador desplaza el
 * panel (overflow oculto) para enfocarlo: el encabezado se va, el pie sube y el diálogo queda en blanco.
 */
const css = (nombre: string) => readFileSync(join(import.meta.dir, `${nombre}.css`), 'utf8');
const bloque = (texto: string, selector: string) => {
  const i = texto.indexOf(`${selector} {`);
  expect(i).toBeGreaterThanOrEqual(0);
  return texto.slice(i, texto.indexOf('}', i));
};

describe('controles con input oculto', () => {
  for (const c of ['checkbox', 'radio', 'switch']) {
    test(`${c}: la raíz ancla el input oculto (position: relative)`, () => {
      expect(bloque(css(c), `[data-sk='${c}']`)).toContain('position: relative');
    });
  }

  test('dialog: el panel recorta sin poder desplazarse (overflow: clip)', () => {
    expect(bloque(css('dialog'), "[data-sk='dialog'] [data-part='panel']")).toContain(
      'overflow: clip',
    );
  });
});
