import {
  useEffect,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { RESIZE_HANDLE_POSITIONS } from '../../lib/resizeBox'
import { usePointerDrag } from '../../lib/usePointerDrag'
import { useZoneCanvasContext } from './ZoneCanvas'
import { ZoneCanvasItem } from './ZoneCanvasItem'
import { resizeZoneGeometry, type ZoneBox } from './zoneCanvasGeometry'
import type { ResizeHandlePosition, Zone, ZoneComponentProps, ZoneTypes } from './types'

export interface ZoneCanvasZoneProps {
  zone: Zone
  zoneTypes?: ZoneTypes
}

const ARROW_STEP = 4
const ARROW_KEYS: Record<string, { dx: number; dy: number }> = {
  ArrowUp: { dx: 0, dy: -1 },
  ArrowDown: { dx: 0, dy: 1 },
  ArrowLeft: { dx: -1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 },
}
const DEFAULT_MIN_SIZE = { width: 80, height: 80 }

// Mismo escape hatch que FlowNode.NO_DRAG_SELECTOR — clickear/escribir en HTML interactivo real
// adentro de una zona (o de un item) nunca debe arrancar un drag.
export const NO_DRAG_SELECTOR =
  'input, textarea, select, button, a, label, [contenteditable="true"], [data-zone-canvas-no-drag]'

function DefaultZoneContent(_props: ZoneComponentProps) {
  return null
}

interface ResizeSnapshot {
  handle: ResizeHandlePosition
  startBox: ZoneBox
}

/**
 * Envoltorio por zona — misma posición "localmente optimista" que FlowNode: local hasta que el
 * gesto termina, re-sincronizada con la prop sólo cuando NO hay drag/resize en curso.
 */
export function ZoneCanvasZone({ zone, zoneTypes }: ZoneCanvasZoneProps) {
  const ctx = useZoneCanvasContext('ZoneCanvasZone')
  const draggable = zone.draggable ?? true
  const resizable = zone.resizable ?? true
  const minSize = zone.minSize ?? DEFAULT_MIN_SIZE

  const [localPosition, setLocalPosition] = useState(zone.position)
  const [localSize, setLocalSize] = useState(zone.size)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setLocalPosition(zone.position)
      setLocalSize(zone.size)
    }
  }, [zone.position, zone.size, isDragging, isResizing])

  const move = usePointerDrag<{ startX: number; startY: number }>({
    onStart: (e) => {
      if (!draggable) return false
      if ((e.target as HTMLElement).closest(NO_DRAG_SELECTOR)) return false
      e.stopPropagation()
      setIsDragging(true)
      return { startX: localPosition.x, startY: localPosition.y }
    },
    onMove: ({ dx, dy }, start) => {
      const next = { x: start.startX + dx, y: start.startY + dy }
      setLocalPosition(next)
      ctx.commitZoneChanges([{ type: 'position', id: zone.id, position: next, dragging: true }])
    },
    onEnd: () => {
      setIsDragging(false)
      ctx.commitZoneChanges([{ type: 'position', id: zone.id, position: localPosition, dragging: false }])
    },
  })

  const resize = usePointerDrag<ResizeSnapshot>({
    onStart: (e) => {
      if (!resizable) return false
      const handle = e.currentTarget.getAttribute('data-handle-position') as ResizeHandlePosition | null
      if (!handle) return false
      e.stopPropagation()
      setIsResizing(true)
      return { handle, startBox: { position: localPosition, size: localSize } }
    },
    onMove: ({ dx, dy }, { handle, startBox }) => {
      const next = resizeZoneGeometry(handle, startBox, dx, dy, minSize)
      setLocalPosition(next.position)
      setLocalSize(next.size)
      ctx.commitZoneChanges([
        { type: 'size', id: zone.id, position: next.position, size: next.size, resizing: true },
      ])
    },
    onEnd: () => {
      setIsResizing(false)
      ctx.commitZoneChanges([
        { type: 'size', id: zone.id, position: localPosition, size: localSize, resizing: false },
      ])
    },
  })

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const dir = ARROW_KEYS[e.key]
    if (!dir || !draggable) return
    e.preventDefault()
    const next = {
      x: localPosition.x + dir.dx * ARROW_STEP,
      y: localPosition.y + dir.dy * ARROW_STEP,
    }
    setLocalPosition(next)
    ctx.commitZoneChanges([{ type: 'position', id: zone.id, position: next, dragging: false }])
  }

  const Content = (zone.type && zoneTypes?.[zone.type]) || DefaultZoneContent
  const isDropTarget = ctx.hover?.zoneId === zone.id
  const items = ctx.itemsByZone(zone.id)

  return (
    <div
      data-part="zone"
      data-zone-id={zone.id}
      data-zone-type={zone.type}
      data-dragging={isDragging ? '' : undefined}
      data-resizing={isResizing ? '' : undefined}
      data-drop-target={isDropTarget ? '' : undefined}
      tabIndex={draggable ? 0 : undefined}
      style={
        {
          ['--sk-zone-canvas-zone-x' as string]: `${localPosition.x}px`,
          ['--sk-zone-canvas-zone-y' as string]: `${localPosition.y}px`,
          ['--sk-zone-canvas-zone-width' as string]: `${localSize.width}px`,
          ['--sk-zone-canvas-zone-height' as string]: `${localSize.height}px`,
        } as CSSProperties
      }
      onPointerDown={move.onPointerDown}
      onPointerMove={move.onPointerMove}
      onPointerUp={move.onPointerUp}
      onKeyDown={onKeyDown}
    >
      {resizable &&
        RESIZE_HANDLE_POSITIONS.map((h) => (
          <div
            key={h}
            data-part="resize-handle"
            data-handle-position={h}
            onPointerDown={resize.onPointerDown}
            onPointerMove={resize.onPointerMove}
            onPointerUp={resize.onPointerUp}
          />
        ))}
      <div data-part="zone-body">
        <Content id={zone.id} data={zone.data} />
        {items.map((item) => (
          <ZoneCanvasItem key={item.id} item={item} zoneSize={localSize} />
        ))}
      </div>
    </div>
  )
}
