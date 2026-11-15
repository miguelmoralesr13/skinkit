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
