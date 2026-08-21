import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { cx } from '../../lib/cx'
import { usePointerDrag } from '../../lib/usePointerDrag'
import { useFlowContext } from './Flow'
import type { FlowNode as FlowNodeData, FlowNodeComponentProps, NodeTypes } from './types'

// El id del nodo se expone a Flow.Handle vía context — así el consumidor no necesita reenviar
// `id` a mano a cada <Flow.Handle> dentro de su propio componente de nodo (nodeTypes).
const FlowNodeIdContext = createContext<string | null>(null)
/** @internal usado por FlowHandle — no es parte del API público. */
export function useFlowNodeId(part: string): string {
  const id = useContext(FlowNodeIdContext)
  if (id == null) throw new Error(`skinkit: <Flow.${part}> debe usarse dentro del contenido de un nodo (nodeTypes)`)
  return id
}

export interface FlowNodeProps {
  node: FlowNodeData
  nodeTypes?: NodeTypes
  className?: string
}

const ARROW_STEP = 4
const ARROW_KEYS: Record<string, { dx: number; dy: number }> = {
  ArrowUp: { dx: 0, dy: -1 },
  ArrowDown: { dx: 0, dy: 1 },
  ArrowLeft: { dx: -1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 },
}

function DefaultNodeContent({ id, data }: FlowNodeComponentProps) {
  const label = (data as { label?: unknown } | undefined)?.label
  return <>{label != null ? String(label) : id}</>
}

/**
 * Envoltorio por nodo — arrastre "localmente optimista": la posición visual vive en estado local
 * (re-sincronizada con `node.position` sólo cuando NO hay un drag en curso, igual que un <input>
 * controlado), así que mover el nodo nunca depende de qué tan rápido re-renderice el consumidor.
 * `onNodesChange` avisa el cambio en cada movimiento (`dragging: true`) y una vez más al soltar
 * (`dragging: false`) para que el consumidor lo aplique a su propio array de nodes.
 */
export function FlowNode({ node, nodeTypes, className }: FlowNodeProps) {
  const ctx = useFlowContext('<Flow.Node>')
  const draggable = node.draggable ?? true
  const selectable = node.selectable ?? true

  const [localPosition, setLocalPosition] = useState(node.position)
  const [isDragging, setIsDragging] = useState(false)
  useEffect(() => {
    if (!isDragging) setLocalPosition(node.position)
  }, [node.position, isDragging])

  const elRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = elRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect
      if (box) ctx.setNodeSize(node.id, { width: box.width, height: box.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.id])

  const drag = usePointerDrag<{ startX: number; startY: number }>({
    onStart: (e) => {
      if (!draggable) return false
      e.stopPropagation()
      setIsDragging(true)
      return { startX: localPosition.x, startY: localPosition.y }
    },
    onMove: ({ dx, dy }, start) => {
      const { zoom } = ctx.viewport
      const next = { x: start.startX + dx / zoom, y: start.startY + dy / zoom }
      setLocalPosition(next)
      ctx.applyNodeChanges([{ type: 'position', id: node.id, position: next, dragging: true }])
    },
    onEnd: () => {
      setIsDragging(false)
      ctx.applyNodeChanges([{ type: 'position', id: node.id, position: localPosition, dragging: false }])
    },
  })

  const onClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!selectable) return
    const deselects = ctx.nodes
      .filter((n) => n.id !== node.id && n.selected)
      .map((n) => ({ type: 'select' as const, id: n.id, selected: false }))
    ctx.applyNodeChanges([...deselects, { type: 'select', id: node.id, selected: true }])
  }

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const dir = ARROW_KEYS[e.key]
    if (!dir || !draggable) return
    e.preventDefault()
    const next = { x: localPosition.x + dir.dx * ARROW_STEP, y: localPosition.y + dir.dy * ARROW_STEP }
    setLocalPosition(next)
    ctx.applyNodeChanges([{ type: 'position', id: node.id, position: next, dragging: false }])
  }

  const Content = (node.type && nodeTypes?.[node.type]) || DefaultNodeContent

  return (
    <div
      ref={elRef}
      data-part="node"
      data-node-id={node.id}
      data-selected={node.selected ? '' : undefined}
      data-dragging={isDragging ? '' : undefined}
      className={cx('sk-flow__node', className)}
      tabIndex={selectable || draggable ? 0 : undefined}
      style={
        {
          ['--sk-flow-node-x' as string]: `${localPosition.x}px`,
          ['--sk-flow-node-y' as string]: `${localPosition.y}px`,
        } as CSSProperties
      }
      onPointerDown={drag.onPointerDown}
      onPointerMove={drag.onPointerMove}
      onPointerUp={drag.onPointerUp}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <FlowNodeIdContext.Provider value={node.id}>
        <Content id={node.id} data={node.data} selected={!!node.selected} />
      </FlowNodeIdContext.Provider>
    </div>
  )
}
