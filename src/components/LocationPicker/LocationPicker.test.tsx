/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { LocationPicker } from './LocationPicker'
import { metersPerPixel, project, unproject, visibleTiles, fillTileUrl, clampLatLng } from './geo'

describe('LocationPicker · geo', () => {
  test('project y unproject son inversas', () => {
    const p = { lat: 19.4326, lng: -99.1332 }
    for (const z of [3, 10, 15, 19]) {
      const w = project(p, z)
      const back = unproject(w.x, w.y, z)
      expect(back.lat).toBeCloseTo(p.lat, 5)
      expect(back.lng).toBeCloseTo(p.lng, 5)
    }
  })

  test('el origen (0,0) cae en el centro del mundo', () => {
    const w = project({ lat: 0, lng: 0 }, 1)
    expect(w.x).toBeCloseTo(256, 5)
    expect(w.y).toBeCloseTo(256, 5)
  })

  test('metros por píxel baja con el zoom y con la latitud', () => {
    expect(metersPerPixel(0, 15)).toBeCloseTo(4.777, 2)
    expect(metersPerPixel(60, 15)).toBeCloseTo(metersPerPixel(0, 15) / 2, 3)
    expect(metersPerPixel(0, 16)).toBeLessThan(metersPerPixel(0, 15))
  })

  test('teselas visibles cubren el viewport y la URL se rellena', () => {
    const tiles = visibleTiles({ lat: 0, lng: 0 }, 2, 300, 200, 'https://t/{z}/{x}/{y}.png')
    expect(tiles.length).toBeGreaterThanOrEqual(4)
    expect(tiles.some((t) => t.left <= 0 && t.left + t.size >= 300 / 2)).toBe(true)
    expect(tiles[0].url).toMatch(/^https:\/\/t\/2\/\d\/\d\.png$/)
    expect(fillTileUrl('{s}.x/{z}', 1, 0, 0)).toBe('a.x/1')
  })

  test('clampLatLng acota latitud y envuelve longitud', () => {
    expect(clampLatLng({ lat: 120, lng: 190 })).toEqual({ lat: 85.0511, lng: -170 })
  })
})

describe('LocationPicker', () => {
  const val = { lat: 19.4326, lng: -99.1332 }

  test('sin teselas: estado no-tiles, cuadrícula, pin y campos presentes (nunca en blanco)', () => {
    const html = renderToStaticMarkup(<LocationPicker value={val} onChange={() => {}} />)
    expect(html).toContain('data-state="no-tiles"')
    expect(html).toContain('data-part="pin"')
    expect(html).toContain('data-field="lat"')
    expect(html).toContain('data-field="lng"')
    expect(html).not.toContain('<img')
    expect(html).toContain('value="19.4326"')
  })

  test('con tileUrl pinta <img> de teselas y el crédito', () => {
    const html = renderToStaticMarkup(
      <LocationPicker value={val} onChange={() => {}} tileUrl="https://tile.test/{z}/{x}/{y}.png" attribution="© Proveedor" />,
    )
    expect(html).toContain('<img')
    expect(html).toContain('https://tile.test/15/')
    expect(html).toContain('© Proveedor')
    expect(html).toContain('data-state="ready"')
  })

  test('renderTiles reemplaza las imágenes por defecto', () => {
    const html = renderToStaticMarkup(
      <LocationPicker value={val} onChange={() => {}} renderTiles={(t) => <i data-n={t.length} />} />,
    )
    expect(html).toContain('<i data-n=')
    expect(html).not.toContain('<img')
  })

  test('radio: dibuja el círculo y el campo solo con radius + onRadiusChange', () => {
    const a = renderToStaticMarkup(<LocationPicker value={val} onChange={() => {}} radius={200} />)
    expect(a).toContain('data-part="radius-circle"')
    expect(a).not.toContain('data-field="radius"')
    const b = renderToStaticMarkup(<LocationPicker value={val} onChange={() => {}} radius={200} onRadiusChange={() => {}} />)
    expect(b).toContain('data-field="radius"')
    expect(b).toContain('value="200"')
  })

  test('sin valor: no hay pin ni círculo y los campos están vacíos', () => {
    const html = renderToStaticMarkup(<LocationPicker value={null} onChange={() => {}} radius={100} />)
    expect(html).not.toContain('data-part="pin"')
    expect(html).not.toContain('radius-circle')
  })

  test('locate agrega el botón; disabled apaga entradas; el pin y el mapa tienen nombre accesible', () => {
    const html = renderToStaticMarkup(<LocationPicker value={val} onChange={() => {}} locate disabled />)
    expect(html).toContain('data-part="locate"')
    expect(html).toContain('Usar mi ubicación')
    expect(html).toContain('aria-label="Mapa de ubicación"')
    expect(html).toContain('Marcador de ubicación')
    expect(html).toContain('data-disabled=""')
  })

  test('aria-live para mensajes', () => {
    expect(renderToStaticMarkup(<LocationPicker value={val} onChange={() => {}} />)).toContain('role="status" aria-live="polite"')
  })
})
