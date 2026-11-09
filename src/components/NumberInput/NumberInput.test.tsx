/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { NumberInput } from './NumberInput'

/** Atributos del <input> real (data-part="field"). */
function campo(html: string): string {
  const m = html.match(/<input[^>]*data-part="field"[^>]*>/)
  if (!m) throw new Error(`sin <input data-part="field"> en: ${html}`)
  return m[0]
}

/** Atributos de la raíz (data-sk="number-input"). */
function raiz(html: string): string {
  const m = html.match(/<div[^>]*data-sk="number-input"[^>]*>/)
  if (!m) throw new Error(`sin raíz en: ${html}`)
  return m[0]
}

describe('NumberInput · nombre accesible', () => {
  test('aria-label va al <input> real, no a la raíz', () => {
    const html = renderToStaticMarkup(<NumberInput aria-label="Cantidad de Arroz" value={2} />)
    expect(campo(html)).toContain('aria-label="Cantidad de Arroz"')
    expect(raiz(html)).not.toContain('aria-label')
  })

  test('aria-labelledby va al <input> real', () => {
    const html = renderToStaticMarkup(<NumberInput aria-labelledby="titulo-fila" value={0} />)
    expect(campo(html)).toContain('aria-labelledby="titulo-fila"')
    expect(raiz(html)).not.toContain('aria-labelledby')
  })

  test('por omisión no agrega aria-label ni aria-labelledby (mismo comportamiento que antes)', () => {
    const html = renderToStaticMarkup(<NumberInput label="Cantidad" id="cant" value={1} />)
    expect(campo(html)).not.toContain('aria-label=')
    expect(campo(html)).not.toContain('aria-labelledby')
    expect(html).toContain('<label data-part="label" for="cant">Cantidad</label>')
    expect(campo(html)).toContain('id="cant"')
  })
})
