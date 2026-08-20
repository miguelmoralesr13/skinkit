import type { TourPlacement } from './types'

// Geometría pura (sin DOM más que getBoundingClientRect/window.innerWidth) — funciones testeables
// sin necesitar renderizar nada. No es un solver de colisión multi-eje como Floating UI: alcanza
// con "el placement pedido, o el primero de un orden fijo que entre en el viewport" — a propósito,
// ver el diseño del plan.

export interface Rect {
  top: number
  left: number
  width: number
  height: number
}

/** Mide el target en el DOM. null si el selector no matchea nada ahora mismo. */
export function getTargetRect(target: string): Rect | null {
  if (typeof document === 'undefined') return null
  const el = document.querySelector(target)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

export interface SpotlightFrame {
  /** Franja arriba del agujero. */
  top: Rect
  /** Franja abajo. */
  bottom: Rect
  /** Franja a la izquierda (entre top y bottom). */
  left: Rect
  /** Franja a la derecha. */
  right: Rect
  /** El agujero mismo (target + padding) — útil para dibujar un borde alrededor. */
  hole: Rect
}

/** Cuatro rects que cubren TODO el viewport salvo un agujero rectangular alrededor de `target`
 * (+ `padding`). Se prefiere esto a un clip-path mantenido a mano: más simple, más robusto entre
 * navegadores. */
export function computeSpotlightFrame(
  target: Rect,
  padding: number,
  viewportWidth: number,
  viewportHeight: number,
): SpotlightFrame {
  const hole: Rect = {
    top: Math.max(0, target.top - padding),
    left: Math.max(0, target.left - padding),
    width: target.width + padding * 2,
    height: target.height + padding * 2,
  }
  const holeBottom = hole.top + hole.height
  const holeRight = hole.left + hole.width

  return {
    top: { top: 0, left: 0, width: viewportWidth, height: hole.top },
    bottom: { top: holeBottom, left: 0, width: viewportWidth, height: Math.max(0, viewportHeight - holeBottom) },
    left: { top: hole.top, left: 0, width: hole.left, height: hole.height },
    right: { top: hole.top, left: holeRight, width: Math.max(0, viewportWidth - holeRight), height: hole.height },
    hole,
  }
}

export interface TooltipPosition {
  top: number
  left: number
  /** Placement REAL usado (puede diferir del pedido, si tuvo que voltearse por espacio). */
  placement: 'top' | 'bottom' | 'left' | 'right'
}

const GAP = 12
const VIEWPORT_MARGIN = 8
const SIDES: readonly ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right']

function fitsSide(
  side: 'top' | 'bottom' | 'left' | 'right',
  target: Rect,
  w: number,
  h: number,
  vw: number,
  vh: number,
): boolean {
  switch (side) {
    case 'top':
      return target.top - GAP - h >= 0
    case 'bottom':
      return target.top + target.height + GAP + h <= vh
    case 'left':
      return target.left - GAP - w >= 0
    case 'right':
      return target.left + target.width + GAP + w <= vw
    default:
      return false
  }
}

/** Posición del tooltip para `placement` — si no entra, prueba el resto de los lados en un orden
 * fijo y usa el primero que entre (o el pedido igual, si ninguno entra del todo). */
export function computeTooltipPosition(
  target: Rect,
  placement: TourPlacement,
  tooltipWidth: number,
  tooltipHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): TooltipPosition {
  const order: ('top' | 'bottom' | 'left' | 'right')[] =
    placement === 'auto'
      ? ['bottom', 'top', 'right', 'left']
      : [placement, ...SIDES.filter((s) => s !== placement)]

  const chosen =
    order.find((s) => fitsSide(s, target, tooltipWidth, tooltipHeight, viewportWidth, viewportHeight)) ?? order[0]

  let top = 0
  let left = 0
  switch (chosen) {
    case 'top':
      top = target.top - GAP - tooltipHeight
      left = target.left + target.width / 2 - tooltipWidth / 2
      break
    case 'bottom':
      top = target.top + target.height + GAP
      left = target.left + target.width / 2 - tooltipWidth / 2
      break
    case 'left':
      top = target.top + target.height / 2 - tooltipHeight / 2
      left = target.left - GAP - tooltipWidth
      break
    case 'right':
      top = target.top + target.height / 2 - tooltipHeight / 2
      left = target.left + target.width + GAP
      break
  }

  left = Math.min(Math.max(left, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, viewportWidth - tooltipWidth - VIEWPORT_MARGIN))
  top = Math.min(Math.max(top, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, viewportHeight - tooltipHeight - VIEWPORT_MARGIN))

  return { top, left, placement: chosen }
}
