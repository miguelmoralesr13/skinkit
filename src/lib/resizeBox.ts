// Geometría de resize 2D — promovida desde ZoneCanvas (zoneCanvasGeometry.ts) porque Flow la
// necesita ahora también (resize de nodos): 8 handles (4 bordes + 4 esquinas), mismo criterio de
// clamp-temprano que Resizable.applyDelta pero en 2 dimensiones en vez de un split porcentual.

export interface BoxPosition {
  x: number
  y: number
}

export interface BoxSize {
  width: number
  height: number
}

export interface Box {
  position: BoxPosition
  size: BoxSize
}

export type ResizeHandlePosition =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export const RESIZE_HANDLE_POSITIONS: ResizeHandlePosition[] = [
  'top',
  'right',
  'bottom',
  'left',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
]

const MOVES_LEFT: ResizeHandlePosition[] = ['left', 'top-left', 'bottom-left']
const MOVES_RIGHT: ResizeHandlePosition[] = ['right', 'top-right', 'bottom-right']
const MOVES_TOP: ResizeHandlePosition[] = ['top', 'top-left', 'top-right']
const MOVES_BOTTOM: ResizeHandlePosition[] = ['bottom', 'bottom-left', 'bottom-right']

/** Aplica el delta de arrastre de UN handle de resize a la caja inicial, clampeando a `minSize`
 * — si el ancho/alto resultante quedaría por debajo del mínimo, el borde que se está moviendo se
 * detiene a `minSize` de distancia del borde fijo. */
export function resizeBoxGeometry(
  handle: ResizeHandlePosition,
  startBox: Box,
  dx: number,
  dy: number,
  minSize: BoxSize,
): Box {
  const movesLeft = MOVES_LEFT.includes(handle)
  const movesRight = MOVES_RIGHT.includes(handle)
  const movesTop = MOVES_TOP.includes(handle)
  const movesBottom = MOVES_BOTTOM.includes(handle)

  let x = startBox.position.x
  let width = startBox.size.width
  if (movesLeft) {
    x = startBox.position.x + dx
    width = startBox.size.width - dx
  } else if (movesRight) {
    width = startBox.size.width + dx
  }
  if (width < minSize.width) {
    if (movesLeft) x = startBox.position.x + startBox.size.width - minSize.width
    width = minSize.width
  }

  let y = startBox.position.y
  let height = startBox.size.height
  if (movesTop) {
    y = startBox.position.y + dy
    height = startBox.size.height - dy
  } else if (movesBottom) {
    height = startBox.size.height + dy
  }
  if (height < minSize.height) {
    if (movesTop) y = startBox.position.y + startBox.size.height - minSize.height
    height = minSize.height
  }

  return { position: { x, y }, size: { width, height } }
}
