/// <reference types="bun" />
import '../../test/dom'
import { afterEach, describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { SegmentedControl } from './SegmentedControl'
import { limpiar, montar, rerender } from '../../test/montar'

afterEach(limpiar)
const css = readFileSync(join(import.meta.dir, '../../styles/components/segmented.css'), 'utf8')

describe('SegmentedControl scrollable', () => {
  test('emite data-scrollable solo con la prop', () => {
    const h = montar(
      <SegmentedControl defaultValue="a" scrollable>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
      </SegmentedControl>,
    )
    expect(h.querySelector('[data-sk="segmented"]')!.hasAttribute('data-scrollable')).toBe(true)
    limpiar()
    const h2 = montar(
      <SegmentedControl defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
      </SegmentedControl>,
    )
    expect(h2.querySelector('[data-sk="segmented"]')!.hasAttribute('data-scrollable')).toBe(false)
  })
  test('la opción activa se desplaza dentro de la franja', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f']
    const ui = (v: string) => (
      <SegmentedControl value={v} scrollable>
        {items.map((i) => (
          <SegmentedControl.Item key={i} value={i}>
            {i}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl>
    )
    const h = montar(ui('a'))
    const raiz = h.querySelector<HTMLElement>('[data-sk="segmented"]')!
    Object.defineProperty(raiz, 'clientWidth', { value: 100, configurable: true })
    const el = h.querySelector<HTMLElement>('[data-state="inactive"][role="radio"]:last-child')!
    Object.defineProperty(el, 'offsetLeft', { value: 400 })
    Object.defineProperty(el, 'offsetWidth', { value: 60 })
    rerender(ui('f'))
    expect(raiz.scrollLeft).toBe(360)
  })
  test('el CSS del desplazamiento está tras el atributo opt-in', () => {
    expect(css).toContain("[data-sk='segmented'][data-scrollable]")
    expect(css).toContain('overflow-x: auto')
  })
})
