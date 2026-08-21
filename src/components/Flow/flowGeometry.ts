import type { FlowPosition, HandlePosition } from './types'

// Geometría pura de Flow — sin estado, sin DOM. Igual que Sparkline/RadialProgress: SVG crudo,
// geometría calculada a mano, sin librería de paths/bezier.

export interface NodeSize {
  width: number
  height: number
}

export interface Viewport {
  x: number
  y: number
  zoom: number
}

/** Cliente (pantalla) → flow-space, dado el rect del contenedor y el viewport actual (pan+zoom).
 * Inversa de la transform CSS `translate(x,y) scale(zoom)` de [data-part="viewport"]. */
export function screenToFlowPosition(
  clientX: number,
  clientY: number,
  containerRect: { left: number; top: number },
  viewport: Viewport,
): FlowPosition {
  return {
    x: (clientX - containerRect.left - viewport.x) / viewport.zoom,
    y: (clientY - containerRect.top - viewport.y) / viewport.zoom,
  }
}

/** Punto de un handle en flow-space — posición del nodo + offset según el lado + tamaño cacheado
 * (medido una vez por ResizeObserver, nunca leído del DOM en el path de render). */
export function handlePoint(
  nodePosition: FlowPosition,
  nodeSize: NodeSize,
  position: HandlePosition,
): FlowPosition {
  const { x, y } = nodePosition
  const { width, height } = nodeSize
  switch (position) {
    case 'top':
      return { x: x + width / 2, y }
    case 'bottom':
      return { x: x + width / 2, y: y + height }
    case 'left':
      return { x, y: y + height / 2 }
    case 'right':
      return { x: x + width, y: y + height / 2 }
  }
}

function offsetAlong(point: FlowPosition, side: HandlePosition, offset: number): FlowPosition {
  switch (side) {
    case 'top':
      return { x: point.x, y: point.y - offset }
    case 'bottom':
      return { x: point.x, y: point.y + offset }
    case 'left':
      return { x: point.x - offset, y: point.y }
    case 'right':
      return { x: point.x + offset, y: point.y }
  }
}

/** Path bezier entre dos puntos — puntos de control desplazados a lo largo del lado de cada
 * handle, proporcional a la distancia entre ambos (mínimo 50px). Fórmula estándar de
 * diagramadores de nodos (React Flow, xyflow) — no hay precedente propio que copiar, así que se
 * usa la de la industria en vez de inventar una nueva. */
export function bezierPath(
  source: FlowPosition,
  sourcePosition: HandlePosition,
  target: FlowPosition,
  targetPosition: HandlePosition,
): string {
  const dist = Math.max(Math.abs(target.x - source.x), Math.abs(target.y - source.y))
  const offset = Math.max(dist * 0.5, 50)
  const c1 = offsetAlong(source, sourcePosition, offset)
  const c2 = offsetAlong(target, targetPosition, offset)
  return `M ${source.x} ${source.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${target.x} ${target.y}`
}

export function clampZoom(zoom: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, zoom))
}

/** Zoom-to-cursor: recalcula x/y del viewport para que el punto de pantalla bajo el cursor quede
 * fijo en el mismo lugar tras cambiar el zoom. */
export function zoomAtPoint(
  viewport: Viewport,
  cursor: { x: number; y: number },
  nextZoom: number,
): Viewport {
  const ratio = nextZoom / viewport.zoom
  return {
    x: cursor.x - (cursor.x - viewport.x) * ratio,
    y: cursor.y - (cursor.y - viewport.y) * ratio,
    zoom: nextZoom,
  }
}
