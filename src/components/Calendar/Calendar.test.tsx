/// <reference types="bun" />
import '../../test/dom'
import { afterEach, describe, expect, test } from 'bun:test'
import { Calendar } from './Calendar'
import { click, evento, limpiar, montar, tecla } from '../../test/montar'

afterEach(limpiar)
const dia = (h: HTMLElement, iso: string) => h.querySelector<HTMLElement>(`[data-date="${iso}"]`)!

describe('Calendar mode="multiple"', () => {
  test('tocar alterna días sueltos y entrega la lista ordenada', () => {
    const vistos: string[][] = []
    const h = montar(<Calendar mode="multiple" defaultValue={['2026-12-25']} onChange={(v) => vistos.push(v)} />)
    // un toque real: pointerdown + click (el click no repite el toggle)
    evento(dia(h, '2026-12-24'), 'pointerdown')
    evento(dia(h, '2026-12-24'), 'pointerup')
    click(dia(h, '2026-12-24'))
    expect(vistos[vistos.length - 1]).toEqual(['2026-12-24', '2026-12-25'])
    evento(dia(h, '2026-12-25'), 'pointerdown')
    window.dispatchEvent(new MouseEvent('pointerup'))
    expect(vistos[vistos.length - 1]).toEqual(['2026-12-24'])
    expect(h.querySelector('[data-part="grid"]')!.getAttribute('aria-multiselectable')).toBe('true')
  })
  test('click sin puntero (lector de pantalla) también alterna, una sola vez', () => {
    const vistos: string[][] = []
    const h = montar(<Calendar mode="multiple" onChange={(v) => vistos.push(v)} />)
    const hoy = h.querySelector<HTMLElement>('[data-today]')!
    click(hoy)
    expect(vistos).toHaveLength(1)
  })
  test('teclado: Enter y Espacio alternan el día enfocado', () => {
    const vistos: string[][] = []
    const h = montar(<Calendar mode="multiple" defaultValue={['2026-12-10']} onChange={(v) => vistos.push(v)} />)
    const grilla = h.querySelector('[data-part="grid"]')!
    tecla(grilla, 'Enter')
    expect(vistos[vistos.length - 1]).toEqual([])
    tecla(grilla, ' ')
    expect(vistos[vistos.length - 1]).toEqual(['2026-12-10'])
    tecla(grilla, 'ArrowRight')
    tecla(grilla, 'Enter')
    expect(vistos[vistos.length - 1]).toEqual(['2026-12-10', '2026-12-11'])
  })
  test('min y max dejan los días fuera de rango deshabilitados', () => {
    const vistos: string[][] = []
    const h = montar(<Calendar mode="multiple" defaultValue={[]} min="2026-12-02" max="2026-12-28" onChange={(v) => vistos.push(v)} />)
    // diciembre 2026 visible solo si hoy cae ahí: se fuerza la vista con un valor inicial
    expect(vistos).toEqual([])
    h.remove()
    const h2 = montar(<Calendar mode="multiple" defaultValue={['2026-12-10']} min="2026-12-02" max="2026-12-28" onChange={(v) => vistos.push(v)} />)
    expect((dia(h2, '2026-12-01') as HTMLButtonElement).disabled).toBe(true)
    expect((dia(h2, '2026-12-29') as HTMLButtonElement).disabled).toBe(true)
    evento(dia(h2, '2026-12-01'), 'pointerdown')
    expect(vistos).toEqual([])
  })
  test('arrastrar pinta varios días y el modo lo decide el primero', () => {
    const vistos: string[][] = []
    const h = montar(<Calendar mode="multiple" defaultValue={['2026-12-10']} onChange={(v) => vistos.push(v)} />)
    const grilla = h.querySelector<HTMLElement>('[data-part="grid"]')!
    const sobre = (iso: string) => {
      document.elementFromPoint = () => dia(h, iso)
      evento(grilla, 'pointermove', { clientX: 1, clientY: 1 })
    }
    evento(dia(h, '2026-12-11'), 'pointerdown')
    sobre('2026-12-12')
    sobre('2026-12-13')
    window.dispatchEvent(new MouseEvent('pointerup'))
    expect(vistos[vistos.length - 1]).toEqual(['2026-12-10', '2026-12-11', '2026-12-12', '2026-12-13'])
    // arrastre que empieza en un día marcado: borra
    evento(dia(h, '2026-12-12'), 'pointerdown')
    sobre('2026-12-13')
    window.dispatchEvent(new MouseEvent('pointerup'))
    expect(vistos[vistos.length - 1]).toEqual(['2026-12-10', '2026-12-11'])
  })
})

describe('Calendar arrastre rápido', () => {
  test('un movimiento que salta celdas pinta también las intermedias', () => {
    const vistos: string[][] = []
    const h = montar(<Calendar mode="multiple" defaultValue={['2026-12-10']} onChange={(v) => vistos.push(v)} />)
    evento(dia(h, '2026-12-14'), 'pointerdown')
    document.elementFromPoint = () => dia(h, '2026-12-17')
    evento(h.querySelector('[data-part="grid"]')!, 'pointermove', { clientX: 1, clientY: 1 })
    window.dispatchEvent(new MouseEvent('pointerup'))
    expect(vistos[vistos.length - 1]).toEqual(['2026-12-10', '2026-12-14', '2026-12-15', '2026-12-16', '2026-12-17'])
  })
})

describe('Calendar marks', () => {
  test('el día marcado emite data-state y su estado en el aria-label', () => {
    const h = montar(
      <Calendar value="2026-10-16" marks={{ '2026-10-16': 'exception', '2026-10-20': 'repeat' }} markLabels={{ exception: 'excepción' }} locale="es" />,
    )
    expect(dia(h, '2026-10-16').getAttribute('data-state')).toBe('exception')
    expect(dia(h, '2026-10-16').getAttribute('aria-label')).toContain('excepción')
    expect(dia(h, '2026-10-20').getAttribute('data-state')).toBe('repeat')
    expect(dia(h, '2026-10-21').hasAttribute('data-state')).toBe(false)
  })
  test('renderDay reemplaza el contenido del día', () => {
    const h = montar(<Calendar value="2026-10-16" renderDay={(c) => <i>{c.state ?? c.day}</i>} marks={{ '2026-10-16': 'x' }} />)
    expect(dia(h, '2026-10-16').textContent).toBe('x')
    expect(dia(h, '2026-10-17').textContent).toBe('17')
  })
  test('single sin marks no emite atributos nuevos', () => {
    const h = montar(<Calendar value="2026-10-16" />)
    expect(h.querySelector('[data-state]')).toBeNull()
    expect(h.querySelector('[aria-multiselectable]')).toBeNull()
    expect(h.querySelector('[data-mode]')).toBeNull()
  })
})

describe('Calendar mes controlado', () => {
  const titulo = (h: HTMLElement) => h.querySelector('[data-part="title"]')!.textContent
  test('con `month` el mes visible lo manda el padre y la navegación avisa por onMonthChange', () => {
    const avisos: Date[] = []
    const h = montar(<Calendar locale="es" month={new Date(2026, 10, 15)} onMonthChange={(m) => avisos.push(m)} />)
    expect(titulo(h)).toContain('noviembre')
    click(h.querySelector('[data-part="next"]')!)
    expect(avisos).toHaveLength(1)
    expect(avisos[0].getFullYear()).toBe(2026)
    expect(avisos[0].getMonth()).toBe(11)
    expect(avisos[0].getDate()).toBe(1)
    // el padre no lo cambió: sigue en noviembre
    expect(titulo(h)).toContain('noviembre')
    click(h.querySelector('[data-part="prev"]')!)
    expect(avisos[1].getMonth()).toBe(9)
  })
  test('sin `month` navega solo (como siempre) y también avisa', () => {
    const avisos: Date[] = []
    const h = montar(<Calendar locale="es" value="2026-11-10" onMonthChange={(m) => avisos.push(m)} />)
    click(h.querySelector('[data-part="next"]')!)
    expect(titulo(h)).toContain('diciembre')
    expect(avisos).toHaveLength(1)
  })
  test('teclado RePág pide el mes siguiente', () => {
    const avisos: Date[] = []
    const h = montar(<Calendar locale="es" month={new Date(2026, 10, 1)} onMonthChange={(m) => avisos.push(m)} />)
    tecla(h.querySelector('[data-part="grid"]')!, 'PageDown')
    expect(avisos.length).toBe(1)
  })
})
