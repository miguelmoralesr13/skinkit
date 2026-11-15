/// <reference types="bun" />
import '../../test/dom'
import { afterEach, describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Keypad } from './Keypad'
import { click, limpiar, montar, tecla } from '../../test/montar'

afterEach(limpiar)
const tecl = (h: HTMLElement, k: string) => h.querySelector<HTMLElement>(`[data-key="${k}"]`)!
const pulsar = (h: HTMLElement, digs: string) => digs.split('').forEach((d) => click(tecl(h, d)))

describe('Keypad', () => {
  test('emite enteros de la unidad menor y muestra los decimales', () => {
    const vistos: number[] = []
    const h = montar(<Keypad decimals={2} onChange={(v) => vistos.push(v)} />)
    pulsar(h, '125')
    pulsar(h, '0')
    expect(vistos).toEqual([1, 12, 125, 1250])
    expect(vistos.every(Number.isInteger)).toBe(true)
    expect(h.querySelector('[data-part="amount"]')!.textContent).toBe('12,50')
  })
  test('borrar, limpiar y tope de dígitos', () => {
    const vistos: number[] = []
    const h = montar(<Keypad maxDigits={3} onChange={(v) => vistos.push(v)} />)
    pulsar(h, '1234')
    expect(vistos).toEqual([1, 12, 123])
    click(tecl(h, 'backspace'))
    click(tecl(h, 'clear'))
    expect(vistos).toEqual([1, 12, 123, 12, 0])
  })
  test('atajos fijan el valor y aceptar respeta allowZero', () => {
    const enviados: number[] = []
    const h = montar(<Keypad decimals={2} shortcuts={[10000, 50000]} onSubmit={(v) => enviados.push(v)} />)
    const aceptar = h.querySelector<HTMLButtonElement>('[data-part="submit"]')!
    expect(aceptar.disabled).toBe(true)
    click(h.querySelector('[data-part="shortcut"][data-value="50000"]')!)
    expect(h.querySelector('[data-part="amount"]')!.textContent).toBe('500,00')
    click(h.querySelector('[data-part="submit"]')!)
    expect(enviados).toEqual([50000])
  })
  test('teclado físico: dígitos, Retroceso, Supr y Enter', () => {
    const enviados: number[] = []
    const h = montar(<Keypad onSubmit={(v) => enviados.push(v)} />)
    const raiz = h.querySelector('[data-sk="keypad"]')!
    tecla(raiz, '4')
    tecla(raiz, '2')
    tecla(raiz, '7')
    tecla(raiz, 'Backspace')
    tecla(raiz, 'Enter')
    expect(enviados).toEqual([42])
    tecla(raiz, 'Delete')
    expect(h.querySelector('[data-part="amount"]')!.textContent).toBe('0')
  })
  test('captureKeys escucha toda la página pero no los campos de texto', () => {
    const h = montar(<Keypad captureKeys />)
    const campo = document.createElement('input') // fuera de React: solo cuenta el listener de página
    document.body.appendChild(campo)
    tecla(document as unknown as Element, '9')
    tecla(campo, '5')
    expect(h.querySelector('[data-part="amount"]')!.textContent).toBe('9')
  })
  test('las teclas miden al menos 44 px (min-h-14 = 3.5rem) y llevan aria-label', () => {
    const css = readFileSync(join(import.meta.dir, '../../styles/components/keypad.css'), 'utf8')
    expect(css).toContain('min-h-14')
    const h = montar(<Keypad />)
    expect(tecl(h, 'backspace').getAttribute('aria-label')).toBe('Borrar')
  })
})
