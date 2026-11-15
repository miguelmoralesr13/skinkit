import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { resizeBoxGeometry, RESIZE_HANDLE_POSITIONS, type Box } from '../../lib/resizeBox'
import { usePointerDrag } from '../../lib/usePointerDrag'
import { useZoneCanvasContext } from './ZoneCanvas'
import { NO_DRAG_SELECTOR } from './ZoneCanvasZone'
import { clampPosition, resolveZoneUnderPoint } from './zoneCanvasGeometry'
import type { CanvasSize, Item, ItemComponentProps, ResizeHandlePosition } from './types'

export interface ZoneCanvasItemProps {
  item: Item
  /** Tamaño ACTUAL (en vivo, no la prop) de la zona dueña — usado para clampear el drag dentro de
   * sus límites; lo pasa ZoneCanvasZone porque ya lo tiene (su propio localSize). */
  zoneSize: CanvasSize
}

const ARROW_STEP = 4
const ARROW_KEYS: Record<string, { dx: number; dy: number }> = {
  ArrowUp: { dx: 0, dy: -1 },
  ArrowDown: { dx: 0, dy: 1 },
  ArrowLeft: { dx: -1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 },
}
const DEFAULT_MIN_SIZE: CanvasSize = { width: 60, height: 32 }

function DefaultItemContent({ id }: ItemComponentProps) {
  return <>{id}</>
}

/**
 * Envoltorio por item — misma posición "localmente optimista" que FlowNode/ZoneCanvasZone. El
 * drag se clampea contra la zona de ORIGEN (sigue siendo hijo del DOM de esa zona durante todo
 * el gesto — ver rendering approach en el plan); al soltar sobre una zona DISTINTA, se emite un
 * único change `reparent` con la posición recalculada relativa a la zona nueva.
 */
export function ZoneCanvasItem({ item, zoneSize }: ZoneCanvasItemProps) {
  const ctx = useZoneCanvasContext('ZoneCanvasItem')
  const draggable = !ctx.readOnly && (item.draggable ?? true)
  const resizable = !ctx.readOnly && (item.resizable ?? true)
  const clickable = !!ctx.onItemClick
  const moved = useRef(false)
  const minSize = item.minSize ?? DEFAULT_MIN_SIZE

  const elRef = useRef<HTMLDivElement>(null)
  const [localPosition, setLocalPosition] = useState(item.position)
  const [localSize, setLocalSize] = useState(item.size)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  useEffect(() => {
    if (!isDragging) setLocalPosition(item.position)
  }, [item.position, isDragging])
  useEffect(() => {
    if (!isResizing) setLocalSize(item.size)
  }, [item.size, isResizing])

  const drag = usePointerDrag<{ startX: number; startY: number }>({
    onStart: (e) => {
      if (!draggable) return false
      if ((e.target as HTMLElement).closest(NO_DRAG_SELECTOR)) return false
      e.stopPropagation()
      moved.current = false
      setIsDragging(true)
      return { startX: localPosition.x, startY: localPosition.y }
    },
    onMove: ({ dx, dy }, start, e) => {
      if (dx !== 0 || dy !== 0) moved.current = true
      const raw = { x: start.startX + dx, y: start.startY + dy }
      const next = clampPosition(raw, zoneSize)
      setLocalPosition(next)

      const hoverZoneId = resolveZoneUnderPoint(e.clientX, e.clientY)
      ctx.setHover(hoverZoneId && hoverZoneId !== item.zoneId ? { itemId: item.id, zoneId: hoverZoneId } : null)

      ctx.commitItemChanges([{ type: 'position', id: item.id, position: next, dragging: true }])
    },
    onEnd: (_start, e) => {
      setIsDragging(false)
      ctx.setHover(null)

      // Mismo truco que FlowHandle: pointer capture deja todos los eventos en ESTE elemento, así
      // que hay que resolver a mano qué zona está bajo el punto de soltar.
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      const zoneEl = el?.closest<HTMLElement>('[data-part="zone"]')
      const dropZoneId = zoneEl?.getAttribute('data-zone-id') ?? null

      if (dropZoneId && dropZoneId !== item.zoneId && zoneEl) {
        const bodyEl = zoneEl.querySelector<HTMLElement>('[data-part="zone-body"]')
        const rect = bodyEl?.getBoundingClientRect()
        if (rect) {
          const relPosition = clampPosition(
            { x: e.clientX - rect.left, y: e.clientY - rect.top },
            { width: rect.width, height: rect.height },
          )
          ctx.commitItemChanges([{ type: 'reparent', id: item.id, zoneId: dropZoneId, position: relPosition }])
          return
        }
      }
      ctx.commitItemChanges([{ type: 'position', id: item.id, position: localPosition, dragging: false }])
    },
  })

  const resize = usePointerDrag<{ handle: ResizeHandlePosition; startBox: Box }>({
    onStart: (e) => {
      if (!resizable) return false
      const handle = e.currentTarget.getAttribute('data-handle-position') as ResizeHandlePosition | null
      if (!handle) return false
      e.stopPropagation()
      // Sin `size` explícito, el item se autoajustó a su contenido — medimos lo YA renderizado
      // (no hay un cache tipo nodeSizes acá, ZoneCanvas no lo necesita para nada más).
      let startSize = localSize
      if (!startSize) {
        const rect = elRef.current?.getBoundingClientRect()
        startSize = rect ? { width: rect.width, height: rect.height } : minSize
      }
      setLocalSize(startSize)
      setIsResizing(true)
      return { handle, startBox: { position: localPosition, size: startSize } }
    },
    onMove: ({ dx, dy }, { handle, startBox }) => {
      const next = resizeBoxGeometry(handle, startBox, dx, dy, minSize)
      setLocalPosition(next.position)
      setLocalSize(next.size)
      ctx.commitItemChanges([
        { type: 'size', id: item.id, position: next.position, size: next.size, resizing: true },
      ])
    },
    onEnd: () => {
      setIsResizing(false)
      ctx.commitItemChanges([
        { type: 'size', id: item.id, position: localPosition, size: localSize ?? minSize, resizing: false },
      ])
    },
  })

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      ctx.onItemClick?.(item)
      return
    }
    const dir = ARROW_KEYS[e.key]
    if (!dir || !draggable) return
    e.preventDefault()
    const next = clampPosition(
      { x: localPosition.x + dir.dx * ARROW_STEP, y: localPosition.y + dir.dy * ARROW_STEP },
      zoneSize,
    )
    setLocalPosition(next)
    ctx.commitItemChanges([{ type: 'position', id: item.id, position: next, dragging: false }])
  }

  const Content = (item.type && ctx.itemTypes?.[item.type]) || DefaultItemContent

  return (
    <div
      ref={elRef}
      data-part="item"
      data-item-id={item.id}
      data-item-type={item.type}
      data-dragging={isDragging ? '' : undefined}
      data-resizing={isResizing ? '' : undefined}
      data-tone={item.tone}
      data-clickable={clickable ? '' : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={draggable || clickable ? 0 : undefined}
      onClick={
        clickable
          ? () => {
              if (moved.current) {
                moved.current = false
                return
              }
              ctx.onItemClick?.(item)
            }
          : undefined
      }
      style={
        {
          ['--sk-zone-canvas-item-x' as string]: `${localPosition.x}px`,
          ['--sk-zone-canvas-item-y' as string]: `${localPosition.y}px`,
          ...(localSize
            ? {
                ['--sk-zone-canvas-item-width' as string]: `${localSize.width}px`,
                ['--sk-zone-canvas-item-height' as string]: `${localSize.height}px`,
              }
            : {}),
        } as CSSProperties
      }
      onPointerDown={drag.onPointerDown}
      onPointerMove={drag.onPointerMove}
      onPointerUp={drag.onPointerUp}
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
      <Content id={item.id} data={item.data} />
    </div>
  )
}
