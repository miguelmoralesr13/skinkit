import type { MouseEvent as ReactMouseEvent } from 'react'
import { cx } from '../../lib/cx'
import { useFlowContext } from './Flow'
import { bezierPath, handlePoint } from './flowGeometry'
import type { FlowEdge as FlowEdgeData } from './types'

export interface FlowEdgeProps {
  edge: FlowEdgeData
  className?: string
}

const DEFAULT_SIZE = { width: 0, height: 0 }

/**
 * Un edge real — sin medir el DOM en cada render: la posición de cada extremo sale de
 * `node.position` + el lado del handle (registrado por FlowHandle) + el tamaño del nodo
 * (cacheado una vez por ResizeObserver en FlowNode). Path bezier calculado a mano — mismo
 * criterio que Sparkline/RadialProgress (SVG crudo, sin librería de paths).
 */
export function FlowEdge({ edge, className }: FlowEdgeProps) {
  const ctx = useFlowContext('<Flow.Edge>')
  const sourceNode = ctx.getNode(edge.source)
  const targetNode = ctx.getNode(edge.target)
  if (!sourceNode || !targetNode) return null

  const sourceReg = ctx.handleRegistry.current.get(`${edge.source}:${edge.sourceHandle ?? ''}`)
  const targetReg = ctx.handleRegistry.current.get(`${edge.target}:${edge.targetHandle ?? ''}`)
  const sourcePosition = sourceReg?.position ?? 'right'
  const targetPosition = targetReg?.position ?? 'left'

  const sourceSize = ctx.nodeSizes.current.get(edge.source) ?? DEFAULT_SIZE
  const targetSize = ctx.nodeSizes.current.get(edge.target) ?? DEFAULT_SIZE

  const from = handlePoint(sourceNode.position, sourceSize, sourcePosition)
  const to = handlePoint(targetNode.position, targetSize, targetPosition)
  const d = bezierPath(from, sourcePosition, to, targetPosition)

  const onClick = (e: ReactMouseEvent<SVGPathElement>) => {
    e.stopPropagation()
    ctx.applyEdgeChanges([{ type: 'select', id: edge.id, selected: !edge.selected }])
  }

  return (
    <path
      d={d}
      fill="none"
      className={cx('sk-flow__edge', className)}
      data-part="edge"
      data-edge-id={edge.id}
      data-selected={edge.selected ? '' : undefined}
      markerEnd={`url(#${ctx.arrowMarkerId})`}
      onClick={onClick}
    />
  )
}
