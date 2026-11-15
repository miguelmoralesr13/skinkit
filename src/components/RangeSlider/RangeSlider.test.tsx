/// <reference types="bun" />
import '../../test/dom'
import { afterEach, describe, expect, test } from 'bun:test'
import { RangeSlider, type RangeSliderValue } from './RangeSlider'
import { evento, limpiar, montar, tecla } from '../../test/montar'

afterEach(limpiar)
const parte = (h: HTMLElement, p: string) => h.querySelector<HTMLElement>(`[data-part="${p}"]`)!

describe('RangeSlider', () => {
  test('expone dos role=slider con valores y variables de posición', () => {
    const h = montar(<RangeSlider defaultValue={[20, 60]} label="Horario" showValue />)
    expect(parte(h, 'thumb-start').getAttribute('aria-valuenow')).toBe('20')
    expect(parte(h, 'thumb-end').getAttribute('aria-valuenow')).toBe('60')
    expect(parte(h, 'thumb-start').getAttribute('role')).toBe('slider')
    expect((h.firstElementChild as HTMLElement).style.getPropertyValue('--sk-range-start')).toBe('20%')
    expect(parte(h, 'value').textContent).toBe('20 – 60')
  })
  test('teclado: pasos, páginas, límites y sin cruzarse', () => {
    const vistos: RangeSliderValue[] = []
    const h = montar(<RangeSlider defaultValue={[40, 50]} step={5} minDistance={5} onChange={(v) => vistos.push(v)} />)
    const ini = parte(h, 'thumb-start')
    tecla(ini, 'ArrowRight')
    tecla(ini, 'ArrowRight')
    expect(vistos[vistos.length - 1]).toEqual([45, 50])
    tecla(ini, 'End')
    expect(vistos[vistos.length - 1]).toEqual([45, 50])
    tecla(ini, 'Home')
    expect(vistos[vistos.length - 1]).toEqual([0, 50])
    const fin = parte(h, 'thumb-end')
    tecla(fin, 'End')
    expect(vistos[vistos.length - 1]).toEqual([0, 100])
  })
  test('el puntero sobre el riel mueve el pulgar más cercano', () => {
    const vistos: RangeSliderValue[] = []
    const h = montar(<RangeSlider defaultValue={[20, 80]} onChange={(v) => vistos.push(v)} />)
    const riel = parte(h, 'track')
    riel.getBoundingClientRect = () => ({ left: 0, width: 200, top: 0, right: 200, bottom: 8, height: 8, x: 0, y: 0, toJSON() {} }) as DOMRect
    evento(riel, 'pointerdown', { clientX: 150 }) // 75 % -> más cerca del fin
    expect(vistos[vistos.length - 1]).toEqual([20, 75])
    evento(riel, 'pointermove', { clientX: 100 })
    expect(vistos[vistos.length - 1]).toEqual([20, 50])
    evento(riel, 'pointerup', { clientX: 100 })
    evento(riel, 'pointerdown', { clientX: 20 }) // 10 % -> inicio
    expect(vistos[vistos.length - 1]).toEqual([10, 50])
  })
  test('deshabilitado ignora teclado', () => {
    const vistos: RangeSliderValue[] = []
    const h = montar(<RangeSlider defaultValue={[20, 80]} disabled onChange={(v) => vistos.push(v)} />)
    tecla(parte(h, 'thumb-start'), 'ArrowRight')
    expect(vistos).toEqual([])
  })
})

describe('RangeSlider wrap (eje circular)', () => {
  const riel = (h: HTMLElement) => {
    const r = parte(h, 'track')
    r.getBoundingClientRect = () => ({ left: 0, width: 240, top: 0, right: 240, bottom: 8, height: 8, x: 0, y: 0, toJSON() {} }) as DOMRect
    return r
  }
  test('end < start cruza: dos tramos, [data-crossing] y valuetext coherente', () => {
    const h = montar(<RangeSlider wrap min={0} max={24} value={[22, 2]} showValue formatValue={(n) => `${n}h`} />)
    const raiz = h.firstElementChild as HTMLElement
    expect(raiz.hasAttribute('data-wrap')).toBe(true)
    expect(raiz.hasAttribute('data-crossing')).toBe(true)
    expect(h.querySelector('[data-part="range-wrap"]')).not.toBeNull()
    expect(parte(h, 'value').textContent).toBe('22h – 2h')
    expect(parte(h, 'thumb-start').getAttribute('aria-valuetext')).toBe('22h')
    expect(parte(h, 'thumb-end').getAttribute('aria-valuetext')).toBe('2h')
  })
  test('sin cruce: un solo tramo; max se normaliza a min', () => {
    const h = montar(<RangeSlider wrap min={0} max={24} value={[8, 24]} />)
    // 24 equivale a 0: el rango [8,0] cruza
    expect(parte(h, 'thumb-end').getAttribute('aria-valuenow')).toBe('0')
    expect(h.firstElementChild!.hasAttribute('data-crossing')).toBe(true)
  })
  test('teclado: el fin cruza el final del eje y el inicio vuelve atrás', () => {
    const vistos: RangeSliderValue[] = []
    const h = montar(<RangeSlider wrap min={0} max={24} step={1} defaultValue={[20, 23]} onChange={(v) => vistos.push(v)} />)
    const fin = parte(h, 'thumb-end')
    tecla(fin, 'ArrowRight')
    expect(vistos[vistos.length - 1]).toEqual([20, 0])
    tecla(fin, 'ArrowRight')
    expect(vistos[vistos.length - 1]).toEqual([20, 1])
    const ini = parte(h, 'thumb-start')
    tecla(ini, 'ArrowRight')
    expect(vistos[vistos.length - 1]).toEqual([21, 1])
    tecla(ini, 'ArrowLeft')
    tecla(ini, 'ArrowLeft')
    tecla(ini, 'ArrowLeft')
    expect(vistos[vistos.length - 1]).toEqual([18, 1])
  })
  test('minDistance se respeta sobre el arco y los pulgares no se rebasan', () => {
    const vistos: RangeSliderValue[] = []
    const h = montar(<RangeSlider wrap min={0} max={24} step={1} minDistance={2} defaultValue={[22, 2]} onChange={(v) => vistos.push(v)} />)
    const fin = parte(h, 'thumb-end')
    tecla(fin, 'ArrowLeft') // arco 3
    tecla(fin, 'ArrowLeft') // arco 2
    expect(vistos[vistos.length - 1]).toEqual([22, 0])
    tecla(fin, 'ArrowLeft') // arco 1 < 2: no se mueve
    expect(vistos[vistos.length - 1]).toEqual([22, 0])
    tecla(fin, 'Home') // arco mínimo
    expect(vistos[vistos.length - 1]).toEqual([22, 0])
    tecla(fin, 'End') // arco máximo = span - max(minDistance, step) = 22
    expect(vistos[vistos.length - 1]).toEqual([22, 20])
    const ini = parte(h, 'thumb-start')
    tecla(ini, 'ArrowLeft') // con el arco ya al máximo, el inicio no puede rebasar al fin por detrás
    expect(vistos[vistos.length - 1]).toEqual([22, 20])
    tecla(ini, 'ArrowRight') // hacia adelante sí: el arco se acorta
    expect(vistos[vistos.length - 1]).toEqual([23, 20])
  })
  test('arrastre: el pulgar elige el camino circular más corto', () => {
    const vistos: RangeSliderValue[] = []
    const h = montar(<RangeSlider wrap min={0} max={24} step={1} defaultValue={[22, 2]} onChange={(v) => vistos.push(v)} />)
    const r = riel(h)
    // 240 px = 24 h -> 10 px por hora. Clic en la hora 4 (más cerca del fin que del inicio).
    evento(r, 'pointerdown', { clientX: 40 })
    expect(vistos[vistos.length - 1]).toEqual([22, 4])
    evento(r, 'pointermove', { clientX: 230 }) // hora 23: del 4 al 23 el camino corto va hacia atrás (cruza el 0)… el fin queda acotado por el inicio
    const ult = vistos[vistos.length - 1]
    expect(ult[0]).toBe(22)
    evento(r, 'pointerup', { clientX: 230 })
  })
  test('sin wrap no emite nada nuevo y los extremos no se cruzan', () => {
    const vistos: RangeSliderValue[] = []
    const h = montar(<RangeSlider min={0} max={24} defaultValue={[20, 23]} onChange={(v) => vistos.push(v)} />)
    expect(h.firstElementChild!.hasAttribute('data-wrap')).toBe(false)
    expect(h.querySelector('[data-part="range-wrap"]')).toBeNull()
    tecla(parte(h, 'thumb-end'), 'ArrowRight')
    expect(vistos[vistos.length - 1]).toEqual([20, 24])
    tecla(parte(h, 'thumb-end'), 'ArrowRight')
    expect(vistos[vistos.length - 1]).toEqual([20, 24])
  })
})
