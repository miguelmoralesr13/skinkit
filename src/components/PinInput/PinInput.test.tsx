/// <reference types="bun" />
import '../../test/dom'
import { afterEach, describe, expect, test } from 'bun:test'
import { createRef } from 'react'
import { PinInput, type PinInputHandle } from './PinInput'
import { click, limpiar, montar, tecla } from '../../test/montar'

afterEach(limpiar)
const campos = (h: HTMLElement) => Array.from(h.querySelectorAll<HTMLInputElement>('[data-part="field"]'))
const tecl = (h: HTMLElement, k: string) => h.querySelector<HTMLElement>(`[data-key="${k}"]`)!

describe('PinInput · autoFocus y onClear', () => {
  test('autoFocus enfoca la primera casilla vacía', () => {
    const h = montar(<PinInput length={4} defaultValue="12" autoFocus />)
    expect(document.activeElement).toBe(campos(h)[2])
  })
  test('sin autoFocus no toma el foco', () => {
    montar(<PinInput length={4} />)
    expect(document.activeElement).toBe(document.body)
  })
  test('ref.clear() borra, avisa con onClear y devuelve el foco', () => {
    const ref = createRef<PinInputHandle>()
    let valor = '1234'
    let avisos = 0
    const h = montar(<PinInput ref={ref} length={4} value={valor} onChange={(v) => (valor = v)} onClear={() => avisos++} />)
    ref.current!.clear()
    expect(valor).toBe('')
    expect(avisos).toBe(1)
    expect(document.activeElement).toBe(campos(h)[0])
  })
})

describe('PinInput keypad', () => {
  test('teclas en pantalla escriben, borran y limpian; completa con onComplete', () => {
    let valor = ''
    let completo = ''
    let avisos = 0
    const h = montar(<PinInput length={4} mask keypad defaultValue="" onChange={(v) => (valor = v)} onComplete={(v) => (completo = v)} onClear={() => avisos++} />)
    for (const d of '0123') click(tecl(h, d))
    expect(valor).toBe('0123')
    expect(completo).toBe('0123')
    click(tecl(h, 'backspace'))
    expect(valor).toBe('012')
    click(tecl(h, 'clear'))
    expect(valor).toBe('')
    expect(avisos).toBe(1)
  })
  test('las casillas no piden el teclado del sistema', () => {
    const h = montar(<PinInput length={4} keypad />)
    for (const c of campos(h)) {
      expect(c.getAttribute('inputmode')).toBe('none')
      expect(c.readOnly).toBe(true)
    }
  })
  test('el teclado físico escribe sobre el grupo (sin doble conteo)', () => {
    let valor = ''
    const h = montar(<PinInput length={4} keypad onChange={(v) => (valor = v)} />)
    const grupo = h.querySelector('[data-part="group"]')!
    tecla(campos(h)[0], '7') // burbujea desde una casilla
    tecla(grupo, '8')
    expect(valor).toBe('78')
    tecla(campos(h)[0], 'Backspace')
    expect(valor).toBe('7')
  })
  test('autoFocus con keypad enfoca el grupo', () => {
    const h = montar(<PinInput length={4} keypad autoFocus />)
    expect(document.activeElement).toBe(h.querySelector('[data-part="group"]'))
  })
  test('sin keypad no hay teclado ni atributos nuevos', () => {
    const h = montar(<PinInput length={4} />)
    expect(h.querySelector('[data-sk="keypad"]')).toBeNull()
    expect(h.querySelector('[data-keypad]')).toBeNull()
  })
})
