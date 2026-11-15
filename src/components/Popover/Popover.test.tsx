/// <reference types="bun" />
import '../../test/dom'
import { afterEach, beforeAll, describe, expect, test } from 'bun:test'
import { Popover } from './Popover'
import { DatePicker } from '../DatePicker'
import { Dialog } from '../Dialog'
import { click, evento, limpiar, montar } from '../../test/montar'

afterEach(limpiar)

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get: () => 300 })
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get: () => 250 })
})

const rect = (left: number, top: number, w = 100, h = 40) =>
  ({ left, top, right: left + w, bottom: top + h, width: w, height: h, x: left, y: top, toJSON() {} }) as DOMRect

function conRect(h: HTMLElement, r: DOMRect) {
  h.querySelector<HTMLElement>('[data-part="trigger"]')!.getBoundingClientRect = () => r
}
const panel = () => document.body.querySelector<HTMLElement>('[data-part="content"]')!
const pos = (el: HTMLElement) => [el.style.getPropertyValue('--sk-popover-left'), el.style.getPropertyValue('--sk-popover-top')]

describe('Popover portal (opt-in)', () => {
  test('por omisión el panel cuelga del popover, sin portal', () => {
    const h = montar(
      <Popover defaultOpen>
        <Popover.Trigger>Abrir</Popover.Trigger>
        <Popover.Content>X</Popover.Content>
      </Popover>,
    )
    expect(h.querySelector('[data-part="content"]')).not.toBeNull()
    expect(h.querySelector('[data-portal]')).toBeNull()
  })
  test('con portal el panel vive en document.body, fuera del contenedor', () => {
    const h = montar(
      <Popover portal defaultOpen>
        <Popover.Trigger>Abrir</Popover.Trigger>
        <Popover.Content>X</Popover.Content>
      </Popover>,
    )
    expect(h.querySelector('[data-part="content"]')).toBeNull()
    expect(panel().hasAttribute('data-portal')).toBe(true)
    expect(panel().closest('[data-skinkit-root]')).not.toBeNull()
  })
  test('se alinea al borde disponible en vez de salirse de la ventana', () => {
    const h = montar(
      <Popover portal defaultOpen>
        <Popover.Trigger>Abrir</Popover.Trigger>
        <Popover.Content>X</Popover.Content>
      </Popover>,
    )
    conRect(h, rect(900, 50))
    click(h.querySelector('[data-part="trigger"]')!) // cierra
    click(h.querySelector('[data-part="trigger"]')!) // reabre, ya con el rect
    // ventana de 1024 x 768, panel de 300 x 250, margen 8
    expect(pos(panel())).toEqual(['716px', '98px'])
    expect(panel().getAttribute('data-resolved-side')).toBe('bottom')
  })
  test('se voltea hacia arriba si abajo no cabe', () => {
    const h = montar(
      <Popover portal defaultOpen>
        <Popover.Trigger>Abrir</Popover.Trigger>
        <Popover.Content>X</Popover.Content>
      </Popover>,
    )
    conRect(h, rect(20, 700))
    click(h.querySelector('[data-part="trigger"]')!)
    click(h.querySelector('[data-part="trigger"]')!)
    expect(panel().getAttribute('data-resolved-side')).toBe('top')
    expect(pos(panel())).toEqual(['20px', '442px'])
  })
  test('click dentro del panel en portal no lo cierra; fuera sí', () => {
    montar(
      <Popover portal defaultOpen>
        <Popover.Trigger>Abrir</Popover.Trigger>
        <Popover.Content>
          <button id="dentro">ok</button>
        </Popover.Content>
      </Popover>,
    )
    evento(document.getElementById('dentro')!, 'pointerdown')
    expect(panel()).not.toBeNull()
    evento(document.body, 'pointerdown')
    expect(document.body.querySelector('[data-part="content"]')).toBeNull()
  })
})

describe('DatePicker portal dentro de un Dialog', () => {
  test('el calendario sale del panel del diálogo (no se recorta por su overflow)', () => {
    montar(
      <Dialog open onClose={() => {}} aria-label="Lote">
        <Dialog.Body>
          <DatePicker portal label="Vence el" />
        </Dialog.Body>
      </Dialog>,
    )
    click(document.querySelector('[data-sk="date-picker"] [data-part="trigger"]')!)
    const cal = document.querySelector<HTMLElement>('[data-sk="calendar"]')!
    expect(cal).not.toBeNull()
    expect(cal.closest('[data-sk="dialog"]')).toBeNull()
    expect(cal.closest('[data-part="content"]')!.hasAttribute('data-bare')).toBe(true)
  })
  test('sin portal el calendario sigue dentro del diálogo', () => {
    montar(
      <Dialog open onClose={() => {}} aria-label="Lote">
        <Dialog.Body>
          <DatePicker label="Vence el" />
        </Dialog.Body>
      </Dialog>,
    )
    click(document.querySelector('[data-sk="date-picker"] [data-part="trigger"]')!)
    expect(document.querySelector('[data-sk="calendar"]')!.closest('[data-sk="dialog"]')).not.toBeNull()
  })
})
