import { useCallback } from 'react'
import { useFlowContext } from './Flow'
import { clampZoom, screenToFlowPosition } from './flowGeometry'
import type { FlowNode, FlowPosition } from './types'

export interface UseFlowResult {
  zoomIn: (step?: number) => void
  zoomOut: (step?: number) => void
  zoomTo: (zoom: number) => void
  resetViewport: () => void
  /** Centra y ajusta el zoom para que todos los nodos entren en el canvas. */
  fitView: (padding?: number) => void
  screenToFlowPosition: (clientX: number, clientY: number) => FlowPosition
  getNode: (id: string) => FlowNode | undefined
}

const ZOOM_STEP = 1.2
const DEFAULT_PADDING = 40

/**
 * Hook público para consumidores — se usa desde CUALQUIER lugar dentro de <Flow> (típicamente
 * dentro del contenido de un nodo, o en <Flow.Controls>). Distinto de `useFlowContext` (interno,
 * expone todo el estado bruto) — este da sólo las acciones que un consumidor necesita.
 */
export function useFlow(): UseFlowResult {
  const ctx = useFlowContext('useFlow()')

  const zoomTo = useCallback(
    (zoom: number) => {
      const next = clampZoom(zoom, ctx.minZoom, ctx.maxZoom)
      ctx.setViewport({ ...ctx.viewport, zoom: next })
    },
    [ctx],
  )
  const zoomIn = useCallback((step = ZOOM_STEP) => zoomTo(ctx.viewport.zoom * step), [ctx, zoomTo])
  const zoomOut = useCallback((step = ZOOM_STEP) => zoomTo(ctx.viewport.zoom / step), [ctx, zoomTo])
  const resetViewport = useCallback(() => ctx.setViewport({ x: 0, y: 0, zoom: 1 }), [ctx])

  const fitView = useCallback(
    (padding = DEFAULT_PADDING) => {
      const rect = ctx.rootRef.current?.getBoundingClientRect()
      if (!rect || ctx.nodes.length === 0) return

      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity
      for (const node of ctx.nodes) {
        const size = ctx.nodeSizes.current.get(node.id) ?? { width: 0, height: 0 }
        minX = Math.min(minX, node.position.x)
        minY = Math.min(minY, node.position.y)
        maxX = Math.max(maxX, node.position.x + size.width)
        maxY = Math.max(maxY, node.position.y + size.height)
      }
      const boundsWidth = Math.max(maxX - minX, 1)
      const boundsHeight = Math.max(maxY - minY, 1)

      const zoom = clampZoom(
        Math.min((rect.width - padding * 2) / boundsWidth, (rect.height - padding * 2) / boundsHeight),
        ctx.minZoom,
        ctx.maxZoom,
      )
      const flowCenterX = minX + boundsWidth / 2
      const flowCenterY = minY + boundsHeight / 2
      ctx.setViewport({
        x: rect.width / 2 - flowCenterX * zoom,
        y: rect.height / 2 - flowCenterY * zoom,
        zoom,
      })
    },
    [ctx],
  )

  const screenToFlowPositionFn = useCallback(
    (clientX: number, clientY: number): FlowPosition => {
      const rect = ctx.rootRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      return screenToFlowPosition(clientX, clientY, rect, ctx.viewport)
    },
    [ctx],
  )

  return {
    zoomIn,
    zoomOut,
    zoomTo,
    resetViewport,
    fitView,
    screenToFlowPosition: screenToFlowPositionFn,
    getNode: ctx.getNode,
  }
}
