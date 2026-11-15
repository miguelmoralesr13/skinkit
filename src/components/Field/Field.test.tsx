/// <reference types="bun" />
import '../../test/dom'
import { afterEach, describe, expect, test } from 'bun:test'
import { Field } from './Field'
import { Input } from '../Input'
import { Slider } from '../Slider'
import { limpiar, montar } from '../../test/montar'

afterEach(limpiar)

describe('Field associateLabel', () => {
  test('genera un id, lo pasa al hijo y cablea <label htmlFor>', () => {
    const h = montar(
      <Field label="Latitud" associateLabel>
        <Input />
      </Field>,
    )
    const entrada = h.querySelector('input')!
    const etiqueta = h.querySelector('label')!
    expect(entrada.id).not.toBe('')
    expect(etiqueta.htmlFor).toBe(entrada.id)
  })
  test('respeta el id del hijo y htmlFor explícito', () => {
    const h = montar(
      <Field label="Vol" associateLabel>
        <Slider id="mio" />
      </Field>,
    )
    expect(h.querySelector('label')!.htmlFor).toBe('mio')
    expect(h.querySelector('input')!.id).toBe('mio')
    limpiar()
    const h2 = montar(
      <Field label="Vol" htmlFor="otro" associateLabel>
        <Input />
      </Field>,
    )
    expect(h2.querySelector('input')!.id).toBe('otro')
  })
  test('con varios hijos no toca nada', () => {
    const h = montar(
      <Field label="x" associateLabel>
        <span>a</span>
        <span>b</span>
      </Field>,
    )
    expect(h.querySelector('label')!.hasAttribute('for')).toBe(false)
  })
  test('sin la prop la etiqueta no se asocia (marcado de siempre)', () => {
    const h = montar(
      <Field label="Latitud">
        <Input />
      </Field>,
    )
    expect(h.querySelector('label')!.hasAttribute('for')).toBe(false)
  })
})
