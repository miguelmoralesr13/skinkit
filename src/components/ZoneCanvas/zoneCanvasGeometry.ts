import { resizeBoxGeometry, RESIZE_HANDLE_POSITIONS } from '../../lib/resizeBox'
import type { Box, ResizeHandlePosition } from '../../lib/resizeBox'
import type { CanvasPosition, CanvasSize } from './types'

// Geometría pura de ZoneCanvas — sin estado, sin DOM (salvo resolveZoneUnderPoint, que sí toca
// el DOM a propósito: es el mismo truco de FlowHandle.resolveHandleUnder para saber qué hay bajo
// el cursor durante un gesto con pointer capture, donde sólo el elemento de origen recibe eventos
// de puntero reales). El resize 2D en sí vive en src/lib/resizeBox.ts — Flow lo necesita ahora
// también (resize de nodos), así que se promovió ahí; acá se re-exporta con los nombres
// originales para no tocar los call-sites existentes (ZoneCanvasZone.tsx).

export type { Box as ZoneBox, ResizeHandlePosition } from '../../lib/resizeBox'
export { RESIZE_HANDLE_POSITIONS }
export const resizeZoneGeometry: (
  handle: ResizeHandlePosition,
  startBox: Box,
  dx: number,
  dy: number,
  minSize: CanvasSize,
) => Box = resizeBoxGeometry

/** Clampea sólo la posición (top-left) de un item dentro de los límites de su zona — no
 * considera el tamaño propio del item (mantiene esto simple: la esquina no sale de la zona, el
 * resto del item puede desbordar visualmente, consistente con `overflow: visible` por default). */
export function clampPosition(position: CanvasPosition, bounds: CanvasSize): CanvasPosition {
  return {
    x: Math.min(Math.max(position.x, 0), Math.max(bounds.width, 0)),
    y: Math.min(Math.max(position.y, 0), Math.max(bounds.height, 0)),
  }
}

/** Busca el `[data-part="zone"]` bajo un punto de pantalla — usado durante un drag de item (con
 * pointer capture en el propio item) para saber sobre qué zona está el cursor, ya que el item
 * arrastrado en sí queda con `pointer-events: none` (ver zone-canvas.css) para no taparlo. */
export function resolveZoneUnderPoint(clientX: number, clientY: number): string | null {
  const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null
  const zoneEl = el?.closest<HTMLElement>('[data-part="zone"]')
  return zoneEl?.getAttribute('data-zone-id') ?? null
}
