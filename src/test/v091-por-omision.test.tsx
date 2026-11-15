/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { Calendar } from '../components/Calendar'
import { RangeSlider } from '../components/RangeSlider'
import { SortableList } from '../components/SortableList'

/**
 * Compatibilidad 0.9.1: el marcado por omisión de RangeSlider, Calendar y SortableList es el de
 * 0.9.0 (base generada contra ese código antes de tocarlos). `wrap`, `month`/`onMonthChange` y el
 * ajuste responsive del CSS son opt-in y no alteran este marcado.
 */
const casos: Record<string, () => string> = {
  rangoBasico: () => renderToStaticMarkup(<RangeSlider defaultValue={[20, 60]} label="Horario" showValue helper="ayuda" />),
  rangoTonoMinDist: () => renderToStaticMarkup(<RangeSlider value={[22, 24]} min={0} max={24} step={0.5} minDistance={1} tone="success" disabled />),
  rangoInvertidoSinWrap: () => renderToStaticMarkup(<RangeSlider value={[22, 2]} min={0} max={24} />),
  calendarioSimple: () => renderToStaticMarkup(<Calendar value="2020-03-10" weekStartsOn={1} locale="es" min="2020-03-02" />),
  calendarioMultiple: () => renderToStaticMarkup(<Calendar mode="multiple" value={['2020-03-10', '2020-03-12']} locale="en" marks={{ '2020-03-12': 'info' }} />),
  listaOrdenable: () =>
    renderToStaticMarkup(
      <SortableList
        value={[{ id: 'a', t: 'Uno' }, { id: 'b', t: 'Dos' }]}
        onChange={() => {}}
        renderItem={(i) => <span>{i.t}</span>}
        onAdd={() => {}}
        label="Pasos"
      />,
    ),
  listaVacia: () => renderToStaticMarkup(<SortableList value={[]} onChange={() => {}} renderItem={() => null} />),
}

const ruta = join(import.meta.dir, 'v091-por-omision.base.json')
const generar = process.env.GENERAR_BASE

describe('0.9.1: marcado por omisión sin cambios', () => {
  if (generar) {
    test('genera la base', () => {
      const out: Record<string, string> = {}
      for (const [k, f] of Object.entries(casos)) out[k] = f()
      writeFileSync(generar, JSON.stringify(out, null, 1))
    })
    return
  }
  const base = JSON.parse(readFileSync(ruta, 'utf8')) as Record<string, string>
  for (const [k, f] of Object.entries(casos)) {
    test(k, () => {
      expect(f()).toBe(base[k])
    })
  }
})
