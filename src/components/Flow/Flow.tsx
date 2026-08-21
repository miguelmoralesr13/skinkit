import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  type CSSProperties,
  type RefObject,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { cx } from '../../lib/cx'
import { usePointerDrag } from '../../lib/usePointerDrag'
import { bezierPath, clampZoom, handlePoint, zoomAtPoint } from './flowGeometry'
import { FlowControls } from './FlowControls'
import { FlowEdge } from './FlowEdge'
import { FlowHandle } from './FlowHandle'
import { FlowNode } from './FlowNode'
import { useFlowState, type FlowStateModel } from './useFlowState'
import type { FlowProps } from './types'

export interface FlowContextValue extends FlowStateModel {
  rootRef: RefObject<HTMLDivElement | null>
  minZoom: number
  maxZoom: number
  arrowMarkerId: string
}
const FlowContext = createContext<FlowContextValue | null>(null)

/** @internal usado por FlowNode/FlowHandle/FlowEdge/FlowControls/useFlow — no es parte del API
 * público. `where` es la descripción completa a mostrar en el error (ej. "<Flow.Node>", "useFlow()"). */
export function useFlowContext(where: string): FlowContextValue {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error(`skinkit: ${where} debe usarse dentro de <Flow>`)
  return ctx
}

const NOT_PANNABLE_SELECTOR = '[data-part="node"], [data-part="handle"], [data-part="controls"]'

/**
 * Flow headless, compuesto: <Flow> · <Flow.Handle> · <Flow.Controls>. Diagramador de nodos/edges:
 * canvas pannable/zoomable, nodos HTML reales (posicionados vía `nodeTypes`) conectables por
 * edges bezier. La forma la da el CSS — ver flow.css.
 *
 * Contrato (ver también FlowNode.tsx/FlowEdge.tsx/FlowHandle.tsx/FlowControls.tsx):
 *   [data-sk="flow"]           raíz (expone --sk-flow-viewport-x/-y/-zoom)
 *   [data-part="background"]  fondo punteado, sigue pan/zoom vía las custom properties del root
 *   [data-part="viewport"]    capa transformada (translate+scale) — nodos/edges viven adentro
 */
export function Flow({
  nodes,
  defaultNodes,
  onNodesChange,
  edges,
  defaultEdges,
  onEdgesChange,
  viewport,
  defaultViewport,
  onViewportChange,
  nodeTypes,
  minZoom = 0.25,
  maxZoom = 2,
  onConnect,
  isValidConnection,
  className,
  classNames,
  style,
  children,
  ...rest
}: FlowProps) {
  const state = useFlowState({
    nodes,
    defaultNodes,
    onNodesChange,
    edges,
    defaultEdges,
    onEdgesChange,
    viewport,
    defaultViewport,
    onViewportChange,
    onConnect,
    isValidConnection,
  })
  const rootRef = useRef<HTMLDivElement>(null)
  // useId() incluye ":" (inválido en un id usado con url(#...) sin escapar) — se limpia acá.
  const arrowMarkerId = `sk-flow-arrow-${useId().replace(/:/g, '')}`

  const pan = usePointerDrag<{ startX: number; startY: number }>({
    onStart: (e) => {
      const target = e.target as HTMLElement
      if (target.closest(NOT_PANNABLE_SELECTOR)) return false
      return { startX: state.viewport.x, startY: state.viewport.y }
    },
    onMove: ({ dx, dy }, start) => {
      state.setViewport({ x: start.startX + dx, y: start.startY + dy, zoom: state.viewport.zoom })
    },
  })

  const onWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
      e.preventDefault()
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect) return
      const cursor = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
      const nextZoom = clampZoom(state.viewport.zoom * factor, minZoom, maxZoom)
      state.setViewport(zoomAtPoint(state.viewport, cursor, nextZoom))
    },
    [state, minZoom, maxZoom],
  )

  const ctxValue: FlowContextValue = { ...state, rootRef, minZoom, maxZoom, arrowMarkerId }

  const onViewportClick = () => {
    const selected = state.nodes.filter((n) => n.selected)
    if (selected.length) {
      state.applyNodeChanges(selected.map((n) => ({ type: 'select', id: n.id, selected: false })))
    }
  }

  // Path de la conexión en progreso (arrastrando desde un handle, todavía no soltada) — el
  // extremo fijo sale del mismo registro/tamaño-cacheado que usa FlowEdge; el extremo libre es
  // `pendingConnection.point`, ya en flow-space (ver FlowHandle.tsx).
  const pc = state.pendingConnection
  let connectionPath: string | null = null
  if (pc) {
    const sourceNode = state.getNode(pc.nodeId)
    if (sourceNode) {
      const reg = state.handleRegistry.current.get(`${pc.nodeId}:${pc.handleId ?? ''}`)
      const sourcePosition = reg?.position ?? 'right'
      const size = state.nodeSizes.current.get(pc.nodeId) ?? { width: 0, height: 0 }
      const from = handlePoint(sourceNode.position, size, sourcePosition)
      // El extremo libre no tiene "lado" propio — se trata como si llegara desde el lado
      // opuesto al de origen, para que la curva salga y entre con la misma forma que un edge real.
      const oppositeOf = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const
      connectionPath = bezierPath(from, sourcePosition, pc.point, oppositeOf[sourcePosition])
    }
  }

  return (
    <FlowContext.Provider value={ctxValue}>
      <div
        ref={rootRef}
        data-sk="flow"
        className={cx('sk-flow', className)}
        style={
          {
            ['--sk-flow-viewport-x' as string]: `${state.viewport.x}px`,
            ['--sk-flow-viewport-y' as string]: `${state.viewport.y}px`,
            ['--sk-flow-viewport-zoom' as string]: String(state.viewport.zoom),
            ...(style as CSSProperties),
          } as CSSProperties
        }
        onWheel={onWheel}
        {...rest}
      >
        <div data-part="background" aria-hidden="true" />
        <div
          data-part="viewport"
          onPointerDown={pan.onPointerDown}
          onPointerMove={pan.onPointerMove}
          onPointerUp={pan.onPointerUp}
          onClick={onViewportClick}
        >
          <svg data-part="edges" aria-hidden="true">
            <defs>
              <marker
                id={arrowMarkerId}
                markerWidth={10}
                markerHeight={10}
                refX={8}
                refY={5}
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" data-part="arrowhead" />
              </marker>
            </defs>
            {state.edges.map((edge) => (
              <FlowEdge key={edge.id} edge={edge} className={classNames?.edge} />
            ))}
            {connectionPath && <path d={connectionPath} fill="none" data-part="connection" />}
          </svg>
          {state.nodes.map((node) => (
            <FlowNode key={node.id} node={node} nodeTypes={nodeTypes} className={classNames?.node} />
          ))}
        </div>
        {children}
      </div>
    </FlowContext.Provider>
  )
}

Flow.Handle = FlowHandle
Flow.Controls = FlowControls
