import { useEffect, type PointerEvent as ReactPointerEvent } from 'react'
import { cx } from '../../lib/cx'
import { useFlowContext } from './Flow'
import { useFlowNodeId } from './FlowNode'
import { screenToFlowPosition } from './flowGeometry'
import type { Connection, HandleKind, HandlePosition } from './types'

export interface FlowHandleProps {
  /** Obligatorio sólo si el nodo tiene más de un handle del mismo `kind`. */
  id?: string
  kind: HandleKind
  position: HandlePosition
  className?: string
}

/**
 * Puerto de conexión — el consumidor lo coloca DENTRO de su propio componente de nodo (vía
 * `nodeTypes`, ver FlowNode.tsx). Flow nunca decide cuántos handles tiene un nodo ni dónde van:
 * eso es exactamente lo que hace esto "basado en HTML de verdad".
 *
 * El pointer capture del gesto de conexión queda en ESTE handle (el de origen) — ningún otro
 * handle recibe pointermove/pointerup propios durante el arrastre. Por eso el hover/drop se
 * resuelve a mano con `document.elementFromPoint`, no con eventos nativos del handle destino.
 */
export function FlowHandle({ id = '', kind, position, className }: FlowHandleProps) {
  const ctx = useFlowContext('<Flow.Handle>')
  const nodeId = useFlowNodeId('Handle')

  useEffect(() => ctx.registerHandle(nodeId, id, { position }), [ctx, nodeId, id, position])

  const resolveHandleUnder = (clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null
    const handleEl = el?.closest<HTMLElement>('[data-part="handle"]')
    if (!handleEl) return null
    const targetNodeId = handleEl.getAttribute('data-node-id')
    if (!targetNodeId) return null
    return { nodeId: targetNodeId, handleId: handleEl.getAttribute('data-handle-id') || undefined }
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = ctx.rootRef.current?.getBoundingClientRect()
    if (!rect) return
    const point = screenToFlowPosition(e.clientX, e.clientY, rect, ctx.viewport)
    ctx.startConnection(nodeId, id || undefined, point)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!ctx.pendingConnection) return
    const rect = ctx.rootRef.current?.getBoundingClientRect()
    if (!rect) return
    const point = screenToFlowPosition(e.clientX, e.clientY, rect, ctx.viewport)
    ctx.updateConnection(point, resolveHandleUnder(e.clientX, e.clientY))
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
    ctx.endConnection(resolveHandleUnder(e.clientX, e.clientY))
  }

  const pc = ctx.pendingConnection
  const isHovered = !!pc?.hover && pc.hover.nodeId === nodeId && (pc.hover.handleId ?? '') === id
  let dataState: 'idle' | 'valid' | 'invalid' = 'idle'
  if (isHovered) {
    const connection: Connection = {
      source: pc!.nodeId,
      sourceHandle: pc!.handleId,
      target: nodeId,
      targetHandle: id || undefined,
    }
    dataState = !ctx.isValidConnection || ctx.isValidConnection(connection) ? 'valid' : 'invalid'
  }

  return (
    <div
      className={cx('sk-flow__handle', className)}
      data-part="handle"
      data-node-id={nodeId}
      data-handle-id={id}
      data-handle-kind={kind}
      data-handle-position={position}
      data-state={dataState}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  )
}
