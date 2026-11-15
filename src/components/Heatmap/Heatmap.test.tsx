/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { Heatmap, heatLevel } from './Heatmap'

const rows = [{ key: 'r1', label: 'Fila 1' }, { key: 'r2', label: 'Fila 2' }]
const columns = [{ key: 'c1', label: 'A' }, { key: 'c2', label: 'B' }]

describe('Heatmap', () => {
  test('es una tabla con encabezados de columna y fila con scope', () => {
    const html = renderToStaticMarkup(<Heatmap label="Demo" rows={rows} columns={columns} values={[[1, 2], [3, 4]]} />)
    expect(html).toContain('<table')
    expect(html).toContain('<caption data-part="caption">Demo</caption>')
    expect(html).toContain('scope="col"')
    expect(html).toContain('scope="row"')
  })

  test('el número siempre está escrito y la intensidad es una variable', () => {
    const html = renderToStaticMarkup(<Heatmap rows={rows} columns={columns} values={[[0, 50], [100, 25]]} formatValue={(v) => `${v}%`} />)
    expect(html).toContain('>100%<')
    expect(html).toContain('--sk-heatmap-intensity:1')
    expect(html).toContain('--sk-heatmap-intensity:0.5')
  })

  test('cero real y «aún no aplica» se distinguen', () => {
    const html = renderToStaticMarkup(<Heatmap rows={rows} columns={columns} values={[[0, null], [5, undefined]]} />)
    expect(html).toContain('data-state="zero"')
    expect((html.match(/data-state="empty"/g) ?? []).length).toBe(2)
    expect(html).toContain('Aún no aplica')
  })

  test('min/max acotan la intensidad', () => {
    const html = renderToStaticMarkup(<Heatmap rows={[rows[0]]} columns={columns} values={[[10, 200]]} min={0} max={100} />)
    expect(html).toContain('--sk-heatmap-intensity:1')
    expect(html).toContain('--sk-heatmap-intensity:0.1')
  })

  test('heatLevel reparte en 0–4', () => {
    expect([0, 0.1, 0.3, 0.6, 1].map(heatLevel)).toEqual([0, 1, 2, 3, 4])
  })
})
