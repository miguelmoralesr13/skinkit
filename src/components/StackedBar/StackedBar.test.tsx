/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { StackedBar } from './StackedBar'

const SEGS = [
  { key: 'a', label: 'Salón', value: 60, tone: 'primary' as const },
  { key: 'b', label: 'Llevar', value: 40, tone: 'success' as const },
]

describe('StackedBar', () => {
  test('la barra es role="img" y su aria-label describe todas las partes', () => {
    const html = renderToStaticMarkup(<StackedBar label="Reparto" segments={SEGS} />)
    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="Reparto: Salón 60%, Llevar 40%"')
  })

  test('cada tramo crece por su valor y lleva su tono', () => {
    const html = renderToStaticMarkup(<StackedBar segments={SEGS} />)
    expect(html).toContain('data-tone="primary"')
    expect(html).toContain('flex-grow:60')
    expect(html).toContain('flex-grow:40')
  })

  test('la leyenda escribe etiqueta y valor (el color no es el único canal)', () => {
    const html = renderToStaticMarkup(<StackedBar segments={SEGS} />)
    expect(html).toContain('<span data-part="legend-label">Salón</span>')
    expect(html).toContain('<span data-part="legend-value">60%</span>')
  })

  test('un valor pequeño sigue en la barra y en la leyenda', () => {
    const html = renderToStaticMarkup(
      <StackedBar segments={[{ key: 'a', label: 'Grande', value: 999 }, { key: 'b', label: 'Chico', value: 1 }]} />,
    )
    expect(html).toContain('flex-grow:1"')
    expect(html).toContain('Chico')
  })

  test('valor 0: sin tramo pero sí en la leyenda; suma 0: sin barra y con empty', () => {
    const uno = renderToStaticMarkup(<StackedBar segments={[{ key: 'a', label: 'A', value: 5 }, { key: 'b', label: 'B', value: 0 }]} />)
    expect((uno.match(/data-part="segment"/g) ?? []).length).toBe(1)
    expect(uno).toContain('>B<')
    const nada = renderToStaticMarkup(<StackedBar segments={[{ key: 'a', label: 'A', value: 0 }]} empty="Sin datos" />)
    expect(nada).not.toContain('role="img"')
    expect(nada).toContain('Sin datos')
  })

  test('formatValue pisa el texto y showLegend=false quita la leyenda', () => {
    const html = renderToStaticMarkup(<StackedBar segments={SEGS} showLegend={false} formatValue={(s) => `${s.value} u`} />)
    expect(html).toContain('Salón 60 u')
    expect(html).not.toContain('data-part="legend"')
  })
})
