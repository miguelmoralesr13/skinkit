/** Matemática Web Mercator (teselas de 256 px) para LocationPicker. Pura, sin DOM. */
export const TILE_SIZE = 256
export const MAX_LAT = 85.0511

export interface LatLng {
  lat: number
  lng: number
}

export function clampLatLng(p: LatLng): LatLng {
  const lng = ((((p.lng + 180) % 360) + 360) % 360) - 180
  const r6 = (n: number) => Math.round(n * 1e6) / 1e6 // ~0,1 m: sin colas de decimales en los campos
  return { lat: r6(Math.min(MAX_LAT, Math.max(-MAX_LAT, p.lat))), lng: r6(lng) }
}

/** Píxeles del mundo (0..256·2^z) de una coordenada. */
export function project(p: LatLng, zoom: number): { x: number; y: number } {
  const size = TILE_SIZE * 2 ** zoom
  const sin = Math.sin((Math.min(MAX_LAT, Math.max(-MAX_LAT, p.lat)) * Math.PI) / 180)
  return {
    x: ((p.lng + 180) / 360) * size,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size,
  }
}

export function unproject(x: number, y: number, zoom: number): LatLng {
  const size = TILE_SIZE * 2 ** zoom
  const n = Math.PI - (2 * Math.PI * y) / size
  return clampLatLng({
    lat: (180 / Math.PI) * Math.atan(Math.sinh(n)),
    lng: (x / size) * 360 - 180,
  })
}

/** Metros por píxel a esa latitud y zoom. */
export function metersPerPixel(lat: number, zoom: number): number {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom
}

export interface TileInfo {
  key: string
  z: number
  x: number
  y: number
  /** Posición del borde superior-izquierdo dentro del viewport, en px. */
  left: number
  top: number
  size: number
  url: string
}

export function fillTileUrl(template: string, z: number, x: number, y: number): string {
  const sub = ['a', 'b', 'c'][Math.abs(x + y) % 3]
  return template.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y)).replace('{s}', sub)
}

/** Teselas que cubren un viewport de width×height centrado en `center`. */
export function visibleTiles(center: LatLng, zoom: number, width: number, height: number, template: string): TileInfo[] {
  const c = project(center, zoom)
  const originX = c.x - width / 2
  const originY = c.y - height / 2
  const n = 2 ** zoom
  const out: TileInfo[] = []
  const x0 = Math.floor(originX / TILE_SIZE)
  const x1 = Math.floor((originX + width) / TILE_SIZE)
  const y0 = Math.max(0, Math.floor(originY / TILE_SIZE))
  const y1 = Math.min(n - 1, Math.floor((originY + height) / TILE_SIZE))
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const wrapped = ((tx % n) + n) % n
      out.push({
        key: `${zoom}/${tx}/${ty}`,
        z: zoom,
        x: wrapped,
        y: ty,
        left: tx * TILE_SIZE - originX,
        top: ty * TILE_SIZE - originY,
        size: TILE_SIZE,
        url: fillTileUrl(template, zoom, wrapped, ty),
      })
    }
  }
  return out
}
